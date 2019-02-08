import { Browser } from 'puppeteer'

export interface BrowserExtendedInterface extends Browser {
  _connection: {
    _closed: boolean
  }
}
