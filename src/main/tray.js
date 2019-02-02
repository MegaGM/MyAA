const
  path = require('path'),
  { showHideWindow } = require('./windowManagement.js'),
  { Tray, Menu } = require('electron')

module.exports = {
  createTray,
}

function createTray({ w }) {
  /**
   * Setup Tray icon and TrayMenu
   */
  // tray = new Tray(path.resolve(__dirname, '../../resources/icons/tray', 'electron-icon.png'))
  let tray = new Tray(path.resolve(__dirname, '../../resources/icons/tray/lock-1.png'))

  // TODO: possibly register all events in one space-separated string
  tray.on('click', () => showHideWindow(w))
  tray.on('right-click', () => showHideWindow(w))
  tray.on('double-click', () => showHideWindow(w))
  tray.on('mouse-move', mouseMove => console.info('mouseMove: ', mouseMove))

  tray.setToolTip('Nyaa!:3')
  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: 'Show/Hide',
      type: 'normal',
      click: () => showHideWindow(w)
    },
    { type: 'separator' },
    {
      label: 'Update in background',
      type: 'checkbox',
      checked: global.UPDATE_IN_BACKGROUND,
      click: () => global.UPDATE_IN_BACKGROUND = !global.UPDATE_IN_BACKGROUND,
    },
    {
      label: 'Quit',
      role: 'quit'
    },
  ]))

  return tray
}