'use strict'

import axios from 'axios'
import puppeteer, { Browser } from 'puppeteer'

export async function getBrowser(): Promise<Browser> {
  let browser = null

  const endpoint = await findWSEndpoint()
  if (endpoint) {
    browser = await puppeteer.connect({
      browserWSEndpoint: endpoint,
      defaultViewport: {
        width: 1440,
        height: 804,
      },
    })
  } else {
    browser = await puppeteer.launch({
      headless: false,
      devtools: false,
      defaultViewport: {
        width: 1440,
        height: 760,
      },
      args: ['--start-maximized'],
    })
  }

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