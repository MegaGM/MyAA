'use strict'
const
  fs = require('fs-extra'),
  axios = require('axios'),
  { exec } = require('child_process')

module.exports = {
  downloadNyaaEpisode,
  saveTorrent,
  openFile,
}


async function downloadNyaaEpisode({ state, commit }, NyaaEpisode) {
  if (!NyaaEpisode.href)
    throw new RangeError('[downloadNyaaEpisode] Invalid NyaaEpisode.href', NyaaEpisode.href)

  const filepath = await saveTorrent(NyaaEpisode)
  await openFile(filepath)

  commit('unqueue:downloadNyaaEpisode', NyaaEpisode)
}


async function saveTorrent({ href, torrentID }) {
  const
    response = await axios({
      url: href,
      method: 'GET',
      responseType: 'arraybuffer',
    }),
    torrent = Buffer.from(response.data),
    filepath = `./torrents/${torrentID}.torrent`

  fs.outputFileSync(filepath, torrent)

  return filepath
}


async function openFile(filepath) {
  let command // choose platform speciefic command to open .torrent
  switch (process.platform) {
    case 'win32':
      command = 'cmd /c start'
      break;
    case 'darwin':
      command = 'open'
      break;
    case 'linux':
    default:
      command = 'xdg-open'
  }

  // MyAA.service has to get absolute executable path, instead of a universal command
  // well, it seems that actually that's not true ^
  // if (filepath.match(/\.torrent$/)) {
  //   command = '/usr/bin/qbittorrent'
  // }
  // else if (filepath.match(/\.mkv$/)) {
  //   command = '/usr/bin/vlc'
  // }

  const output = await execAsync(`${command} "${filepath}"`)
  return output
}


/**
 * Utils
 */
async function execAsync(command) {
  let child = exec(command)
  return new Promise((resolve, reject) => {
    let { stdout, stderr } = child
    stdout.on('data', console.info)
    stderr.on('data', console.error)
    // child.on('close', code => console.info('closing code: ' + code))
    child.addListener('error', reject)
    child.addListener('exit', resolve)
  })
}

// new version of execAsync?
// async function execAsync(command) {
//   let child = exec(command)
//   return new Promise((resolve, reject) => {
//     let { stdout, stderr } = child
//     let outBuffer = '', errBuffer = ''
//     stdout.on('data', data => outBuffer += data)
//     stderr.on('data', data => errBuffer += data)
//     child.addListener('exit', () => resolve(outBuffer))
//     child.addListener('error', () => reject(errBuffer))
//     // child.on('close', code => console.info('closing code: ' + code))
//   })
// }