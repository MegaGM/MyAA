'use strict'

import fs from 'fs-extra'
import { getConnectionToChrome } from './pptr'
import { Browser, Page, ElementHandle, ExecutionContext } from 'puppeteer'
// import { createSecureContext } from 'tls';


let isAuthenticated = false
const malURL = `https://myanimelist.net/animelist/Megga?status=1`
const CREDENTIALS = {
  username: 'TheSafeguard',
  password: 'safeguardforMAL',
}

export async function getCW() {
  return getConnectionToChrome()
    .then(selectPage) // return about:blank page
    // .then(setCookies)
    .then(navigateToMAL)
    .then(authenticateIfNeeded)
    .then(scrapeOngoings)
    .then(MalEntries => {
      // console.info('MalEntries: ', MalEntries)
      return MalEntries.filter(MalEntry => MalEntry.title === 'Mob Psycho 100 II')
      // return MalEntries
    })
    .catch(async err => {
      console.error('catched in MAL.getCW: ', err)
      // return mocked ongoings array, not to break qCycled job
      return []
    })
}


type updateProgressOptions = {
  MAL_ID?: number
  MalEntry?: MalEntry
  newEpisodeNumber: number
}

export async function updateProgress({
  MAL_ID,
  MalEntry,
  newEpisodeNumber,
}: updateProgressOptions): Promise<boolean> {
  if (!MAL_ID) {
    if (MalEntry)
      MAL_ID = MalEntry.MAL_ID
    else
      throw new RangeError('Invalid updateProgressOptions in MAL.updateProgress')
  }

  return await getConnectionToChrome()
    .then(selectPage)
    .then(navigateToMAL)
    .then(async page => {
      await page.$eval(`#epText${MAL_ID}`, click)
      await page.waitFor(700)
      await page.$eval(`#epID${MAL_ID}`, click)
      await page.waitFor(200)
      await page.keyboard.type(newEpisodeNumber + '')
      await page.waitFor(200)
      await page.keyboard.press('Enter')
      await page.waitFor(1000)
    })
    .then(() => {
      console.info('MAL.updateProgress', { MAL_ID, newEpisodeNumber })
      return true
    })
    .catch(err => {
      console.error('MAL.updateProgress catched: ', err)
      return false
    })
}


// auth.generateCookies(page: Page)
// auth.serializeCookies(page: Page)
// auth.deserializeCookies(page: Page)
// auth.injectCookies(page: Page)
/**
 * components
 */
function click(el: Element) {
  return el && (el as HTMLElement).click()
}

async function getFirstPage(browser: Browser) {
  console.info('o: ', browser._connection._closed)
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

async function setCookies(page: Page) {
  try {
    const cookies = fs.readJsonSync('../cookies')
    await page.setCookie(...cookies)
  } catch (err) {
    console.warn('[MAL API] No cookies to set! We\'ll bake new cookies after authentication.')
  }

  return page
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


// declare global {
//   interface Window {
//     decorateOngoing(ongoing: any): MalEntry
//   }
// }

async function scrapeOngoings(page: Page): Promise<MalEntry[]> {
  // if (!(await page.evaluate(() => 'decorateOngoing' in window)))
  //   page.exposeFunction('decorateOngoing', decorateOngoing)

  return page.$$eval('a.animetitle', (animetitles) => {
    return animetitles.map((at: HTMLAnchorElement | any) => {
      const
        tr: HTMLTableRowElement | any = at.closest('tr'),
        href = at.href,
        title = tr.querySelector('td:nth-child(2) > a.animetitle > span').innerText,
        scoreRaw = tr.querySelector('td:nth-child(3)').innerText,
        progressRaw = tr.querySelector('td:nth-child(5)').innerText,
        fetchTime = new Date().getTime()


      return decorateOngoing({
        href,
        title,
        scoreRaw,
        progressRaw,
        fetchTime,
      })

      function decorateOngoing(o: any): MalEntry {
        o.MAL_ID = +o.href.replace(/https:\/\/myanimelist.net\/anime\/(\d+)\/.*/, '$1')

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
    })
  })
}


interface MalEntry {
  title: string
  href: string
  MAL_ID: number
  fetchTime: number
  progress: {
    current: number
    overall: number
  }
  score: number
}