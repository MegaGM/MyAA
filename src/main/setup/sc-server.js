'use strict'
const fs = require('fs-extra')
const path = require('path')
const http = require('http')
const { attach } = require('socketcluster-server')

let scServer
let httpServer

module.exports = { setupSCServer }
function setupSCServer() {
  if (scServer)
    return scServer

  httpServer = http.createServer(server)
  scServer = attach(httpServer)
  httpServer.listen(7700)

  return scServer
}

function server(req, res) {
  const whitelist = ['/', '/index.html', '/web-renderer.js', '/web-renderer.css']
  if (whitelist.includes(req.url)) {
    res.writeHead(200)
    let filename = req.url === '/' ? '/index.html' : req.url
    filename = filename.substr(1)
    const filepath = path.resolve('./build/web-renderer', filename)
    res.end(fs.readFileSync(filepath))
  }
  else {
    res.writeHead(501)
    res.end('Not implemented')
  }
}