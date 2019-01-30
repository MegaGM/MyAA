'use strict'

import fs from 'fs-extra'
import { getBrowser } from './pptr'
import { Browser, Page } from 'puppeteer'
import { createSecureContext } from 'tls';


let isAuthenticated = false
const malURL = `https://myanimelist.net/animelist/Megga?status=1`
const CREDENTIALS = {
  username: 'TheSafeguard',
  password: 'safeguardforMAL',
}

export async function getCW() {
  return getBrowser()
    .then(selectPage) // return about:blank page
    // .then(setCookies)
    .then(navigateToMAL)
    .then(authenticateIfNeeded)
    .then(scrapeOngoings)
    .then(ongoings => {
      // console.info('ongoings: ', ongoings)
      return ongoings
    })
}


type updateProgressOptions = {
  newEpisodeNumber: number
  MalEntry: MalEntry
}
export async function updateProgress(options: updateProgressOptions): Promise<MalEntry> {
  const { newEpisodeNumber, MalEntry } = options
  return getBrowser()
    .then(selectPage)
    .then(navigateToMAL)
    .then(async page => {
      const MAL_ID = MalEntry.href.replace(/https:\/\/myanimelist.net\/anime\/(\d+)\/.*/, '$1')

      await page.click(`#epText${MAL_ID}`)
      await page.waitFor(500)
      await page.click(`#epID${MAL_ID}`)
      await page.keyboard.type(newEpisodeNumber + '')
      await page.keyboard.press('Enter')
      await page.waitFor(1000)

      return MalEntry
    })
}


// auth.generateCookies(page: Page)
// auth.serializeCookies(page: Page)
// auth.deserializeCookies(page: Page)
// auth.injectCookies(page: Page)
/**
 * components
 */
function click(el: any) {
  return el && el.click()
}

async function setCookies(page: Page) {
  try {
    const cookies = fs.readJsonSync('../cookies')
    await page.setCookie(...cookies)
  } catch (err) {
    console.warn('No cookies!')
  }

  return page
}

async function getFirstPage(browser: Browser) {
  return (await browser.pages())[0]
}

async function selectPage(browser: Browser): Promise<Page> {
  let selectedPage = null

  for (const page of await browser.pages()) {
    const url = await page.url()
    if (url === malURL || url === 'http://localhost/') {
      selectedPage = page
      break
    }
  }

  if (!selectedPage)
    selectedPage = await browser.newPage()

  return selectedPage
}

async function navigateToMAL(page: Page) {
  // await page.tracing.start({ path: 'trace.json', categories: ['devtools.timeline'] })
  const url = await page.url()
  if (url !== malURL)
    await page.goto(malURL, { waitUntil: 'load' })
  /**
   * mitigate the annoying policy blah-blah popup
   */
  const policyBtnSelector = 'body > div.root > div > div.modal-wrapper > div > button'
  if ((await page.$(policyBtnSelector))) {
    console.info('policyBtnSelector found')
    await page.$eval(policyBtnSelector, click)
  }

  return page
}

async function authenticateIfNeeded(page: Page) {
  /**
   * check authentication
   */
  isAuthenticated = !(await page.$('#malLogin'))
  if (isAuthenticated)
    return page

  /**
   * authenticate
   */
  const
    loginBtnSelector = '#dialog > tbody > tr > td > form > div > p.pt16.ac > input',
    CWSelector = '#list_surround > table:nth-child(2) > tbody > tr > td.status_selected > a'

  await page.$eval('#malLogin', click)
  await page.waitForSelector('#loginUserName')
  await page.type('#loginUserName', CREDENTIALS.username)
  await page.type('#login-password', CREDENTIALS.password)
  await page.$eval(loginBtnSelector, click)
  await page.waitForSelector(CWSelector)

  /**
   * save authentication state
   */
  const cookies = await page.cookies()
  fs.outputJsonSync('cookies', cookies)
  isAuthenticated = true

  return page
}

async function scrapeOngoings(page: Page): Promise<MalEntry[]> {
  return page.$$eval('a.animetitle', (animetitles) => {
    return animetitles.map((at: HTMLAnchorElement | any) => {
      const
        tr: HTMLTableRowElement | any = at.closest('tr'),
        href = at.href,
        title = tr.querySelector('td:nth-child(2) > a.animetitle > span').innerText,
        scoreRaw = tr.querySelector('td:nth-child(3)').innerText,
        progressRaw = tr.querySelector('td:nth-child(5)').innerText,
        fetchTime = new Date().getTime()

      function decorateOngoing(o: any): MalEntry {
        o.title = o.title
          .replace(/ \(TV\)/, '')
          .replace(/[~!:]/g, '')

        o.score = +o.scoreRaw.replace('-', '0')

        o.progressRaw
          .replace(/ +/, '') // example: '2/12 +' or '15/- +'
          .replace('-', '0')
          .replace(/([\d]+)\/([\d]+)/, (match: never, $1: string, $2: string) => {
            o.progress = {
              current: +$1,
              overall: +$2,
            }

            return ''
          })

        return o
      }

      return decorateOngoing({
        href,
        title,
        scoreRaw,
        progressRaw,
        fetchTime,
        newEpisodes: [],
      })
    })
  })
}

interface MalEntry {
  title: string
  href: string
  fetchTime: number
  progress: {
    current: number
    overall: number
  }
  score: number
  newEpisodes?: []
}