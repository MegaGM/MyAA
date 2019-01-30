'use strict'

const
  fs = require('fs-extra'),
  url = require('url'),
  path = require('path'),
  { exec } = require('child_process'),
  { app, BrowserWindow, ipcMain, Tray, Menu, globalShortcut } = require('electron'),
  Nyaa = require('../common/Nyaa.api.js'),
  MAL = require('../common/mal-api/build/MAL.api.js'),
  qCycle = require('../common/qCycle.portable.js'),
  cycle = new qCycle({ stepTime: 2, debug: false })

let
  w, //: BrowserWindow
  tray //: Tray

const START_CYCLE = true
// const START_CYCLE = false
const START_MOCKING = false
// const START_MOCKING = true
let UPDATE_IN_BACKGROUND = true

const store = {
  MalEntries: {},
  sortedMalEntries: [],
  newEpisodes: {},
  FORCED_UPDATE_FOR_TITLE: null,
  updateMalEntries(MalEntriesArr) {
    for (const MalEntry of MalEntriesArr)
      this.MalEntries[MalEntry.title] = MalEntry
  },
  sortMalEntries() {
    this.sortedMalEntries = Object.values(this.MalEntries)
      .sort((a, b) => a.fetchTime - b.fetchTime)
  },
  forceMalEntryToBeUpdated(title) {
    console.info('forced: ', title)
    this.FORCED_UPDATE_FOR_TITLE = title
  },
}


// nani sore?
// app.dock.hide()
app.commandLine.appendSwitch('ignore-gpu-blacklist')

{
  /**
   * Focus the window instead of launching second app
   */
  const firstInstance = app.requestSingleInstanceLock()
  if (!firstInstance)
    app.quit()
  else
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      if (w.isMinimized())
        w.restore()
      w.show()
      w.focus()
    })
}

app.on('activate', () => w === null && createWindow())
app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit())

app.once('ready', () => {
  // app.makeSingleInstance(() => { })
  globalShortcut.register('CommandOrControl+Shift+Y', () => {
    showHideWindow()
  })

  /**
   * debug abit
   */
  console.info('__dirname: ', __dirname)
  // console.info('appData: ', app.getPath('appData'))

  setupTray()
  createWindow()
  setupAPI()
  setupDevEnv()
})


/**
 * Flow and Utils
 */
function showHideWindow() {
  if (w.isVisible())
    w.hide()
  else {
    w.show()
    w.focus()
  }
}

function createWindow() {
  const wOptions = {
    center: false,
    autoHideMenuBar: true,
    scrollBounce: true,
    icon: path.resolve(__dirname, '../../resources/icons/tray/lock-1.png'),
    webPreferences: {
      backgroundThrottling: false,
    },
    x: 0,
    y: 24,
    width: 1440,
    height: 876,
  }

  w = new BrowserWindow(wOptions)

  w.loadURL(url.format({
    pathname: path.resolve(__dirname, '../../build/renderer/index.html'),
    protocol: 'file:',
    slashes: true,
  }))

  w.on('move', saveWindowPosition)
  w.on('resize', saveWindowPosition)
  // w.on('blur', () => w.hide())
  w.on('closed', () => w = null)
  w.once('ready-to-show', () => {
    w.show()
    w.focus()
  })

  function saveWindowPosition(e) {
    // console.info('saveWindowPosition STUB, w.getBounds(): ', w.getBounds())
  }
}

function setupTray() {
  /**
   * Setup Tray icon and TrayMenu
   */
  // tray = new Tray(path.resolve(__dirname, '../../resources/icons/tray', 'electron-icon.png'))
  tray = new Tray(path.resolve(__dirname, '../../resources/icons/tray/lock-1.png'))

  // TODO: possibly register all events in one space-separated string
  tray.on('click', showHideWindow)
  tray.on('right-click', showHideWindow)
  tray.on('double-click', showHideWindow)
  tray.on('mouse-move', mouseMove => console.info('mouseMove: ', mouseMove))

  tray.setToolTip('Nyaa!:3')
  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: 'Show/Hide',
      type: 'normal',
      click: showHideWindow
    },
    { type: 'separator' },
    {
      label: 'Update in background',
      type: 'checkbox',
      checked: UPDATE_IN_BACKGROUND,
      click: () => UPDATE_IN_BACKGROUND = !UPDATE_IN_BACKGROUND,
    },
    {
      label: 'Quit',
      role: 'quit'
    },
  ]))
}

function setupDevEnv() {
  const env = process.env.NODE_ENV
  if (!env || !env.toLowerCase().startsWith('dev'))
    return

  {
    /**
     * Extensions
     */
    // const { default: installExtension, VUEJS_DEVTOOLS } = require('electron-devtools-installer')
    // installExtension(VUEJS_DEVTOOLS)
    // BrowserWindow.removeDevToolsExtension('Lubuntu Scrollbars')
    // const installedExtensions = BrowserWindow.getDevToolsExtensions()
    // console.info('installedExtensions: ', installedExtensions)
  }

  w.webContents.openDevTools()
}


async function refetchMalEntries() {
  const MalEntriesArr = await MAL.getCW()
  store.updateMalEntries(MalEntriesArr)
  store.sortMalEntries()
  return MalEntriesArr
}

async function setupAPI() {
  // ipcMain.on('getDownloadedEpisodes', async (event, title) => {
  //   const
  //     files = await fs.readdir('/new/trrnt/anime/ongoings'),
  //     episodes = files.map(file => parseFilename(file)).filter(Boolean)

  //   event.sender.send('downloadedEpisodes', episodes)
  // })

  ipcMain.on('updateMalEntryProgress', async (event, options) => {
    const MalEntry = await MAL.updateProgress(options)
    const MalEntriesArr = await refetchMalEntries()
    store.forceMalEntryToBeUpdated(MalEntry.title)
    event.sender.send('MalEntries', MalEntriesArr)
  })

  ipcMain.on('forceMalEntryToBeUpdated', async (event, title) => {
    store.forceMalEntryToBeUpdated(title)
  })

  ipcMain.on('getMalEntries', async (event, payload) => {
    const MalEntriesArr = await refetchMalEntries()
    /**
     * sending MalEntriesArr, unsorted Array of MalEntries,
     * instead of grabbing the Object from store,
     * because on the client we need an Array of MalEntries
     * and because the array will be sorted there anyway
     */
    event.sender.send('MalEntries', MalEntriesArr)
  })

  ipcMain.on('getUpdates', async (event, payload) => {
    const withNewEpisodes = Object.entries(store.newEpisodes)
      .filter(([title, newEpisodes]) => newEpisodes.length)

    const updates = []
    for (const [title, newEpisodes] of withNewEpisodes) {
      updates.push({
        title,
        newEpisodes,
      })
    }

    event.sender.send('updates', updates)
  })
}




cycle.setJob(job);
(async () => {
  const MalEntries = await MAL.getCW()
  await store.updateMalEntries(MalEntries)
  if (START_CYCLE)
    cycle.start()
})()

async function job() {
  if (!UPDATE_IN_BACKGROUND)
    return
  store.sortMalEntries()

  let MalEntry = store.sortedMalEntries[0]
  if (store.FORCED_UPDATE_FOR_TITLE) {
    MalEntry = store.MalEntries[store.FORCED_UPDATE_FOR_TITLE]
    console.info('FORCED_UPDATE_FOR_TITLE: ', store.FORCED_UPDATE_FOR_TITLE)
    console.info('MalEntry.title: ', MalEntry.title)
    console.info('MalEntries.keys()', Object.keys(store.MalEntries))
    store.FORCED_UPDATE_FOR_TITLE = null
  }
  const
    { title } = MalEntry,
    newEpisodes = await getNewEpisodes(MalEntry)

  store.newEpisodes[title] = newEpisodes
  // since MalEntry.fetchTime has been changed, sort again
  store.sortMalEntries()

  // if (store.newEpisodes[title].length)
  // for now let's send all, including empty,
  // to get better feeling of what's going on, on the client side
  w.webContents.send('update', { title, newEpisodes })

  /**
   * debug
   */
  // const withNewEpisodes = Object.entries(store.newEpisodes)
  //   .filter(([title, newEpisodes]) => newEpisodes.length)

  // for (const [title, newEpisodes] of withNewEpisodes)
  //   w.webContents.send('update', { title, newEpisodes })

}

if (START_MOCKING)
  Mockery()
async function Mockery() {
  let mockMalEntry = {
    title: 'Dororo',
    progress: { current: 2 }
  }
  const newEpisodes = await getNewEpisodes(mockMalEntry)
  console.info('\n\n\ngetNewEpisodes: ', newEpisodes)
}

async function getNewEpisodes(MalEntry) {
  const now = new Date().getTime()
  console.info(`-${now - MalEntry.fetchTime}`, 'getNewEpisodes', MalEntry.title)
  MalEntry.fetchTime = now
  const
    // TODO: replace with chokidar
    downloadedFiles = fs.readdirSync('/new/trrnt/anime/ongoings'),
    downloadedEpisodes = downloadedFiles.map(file => parseFilename(file)).filter(Boolean),
    fetchedEpisodes = await Nyaa.fetchEpisodes(MalEntry.title)

  return fetchedEpisodes
    .map(NyaaEpisode => {
      if (NyaaEpisode.episodeNumber <= MalEntry.progress.current)
        return null

      return NyaaEpisode
    })
    .filter(Boolean)
    .sort((a, b) => a.episodeNumber - b.episodeNumber)
    .map(NyaaEpisode => {
      for (const downloadedEpisode of downloadedEpisodes)
        if (downloadedEpisode.title.toLowerCase() === NyaaEpisode.title.toLowerCase())
          if (downloadedEpisode.episodeNumber === NyaaEpisode.episodeNumber)
            NyaaEpisode.downloaded = true

      return NyaaEpisode
    })
}

function parseFilename(title) {
  let parsed = null
  title.replace(
    /\[HorribleSubs] (.+) - (\d+) \[(\d+)p]/,
    (match, $1, $2, $3) => {
      parsed = {}
      parsed.title = $1
      parsed.episodeNumber = +$2
      parsed.quality = $3
    })

  return parsed
}

async function execAsync(command) {
  const child = exec(command)

  return new Promise((resolve, reject) => {
    const { stdout, stderr } = child
    stdout.on('data', console.info)
    stderr.on('data', console.error)
    // child.on('close', code => console.info('closing code: ' + code))
    child.addListener('error', reject)
    child.addListener('exit', resolve)
  })
}
