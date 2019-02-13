'use strict'

let browser: Browser
import axios from 'axios'
import puppeteer, { Browser } from 'puppeteer'

declare module 'puppeteer/index' {
  // expose a private variable
  interface Browser {
    _connection: {
      _closed: boolean
    }
  }
}


export async function getConnectionToChrome(): Promise<Browser> {
  if (browser && !browser._connection._closed)
    return browser

  const endpoint = await findWSEndpoint()
  if (endpoint) {
    browser = <Browser>await puppeteer.connect({
      browserWSEndpoint: endpoint,
      defaultViewport: {
        width: 1440,
        height: 804,
      },
    })
  } else {
    browser = <Browser>await puppeteer.launch({
      headless: false,
      devtools: false,
      defaultViewport: {
        width: 1440,
        height: 760,
      },
      args: ['--start-maximized'],
    })
  }

  browser.on('disconnected', () => {
    console.info('browser.on(disconnected) browser._connection._closed', browser._connection._closed)
  })
  return browser
}

async function findWSEndpoint() {
  try {
    const
      json = await axios.get('http://localhost:9240/json/version'),
      browserWSEndpoint = json.data.webSocketDebuggerUrl

    return browserWSEndpoint
  } catch (err) { }

  return null
}