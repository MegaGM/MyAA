'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const { readJsonSync, outputJsonSync } = require('../../common/nativeRequireBypassWebpack.js')('fs-extra');
const { configureChromeHead, getChromeTab, bakeCookies } = require('../../common/nativeRequireBypassWebpack.js')('/myaa/chrome-head/build/index.js'); // Docker mount point
// ('/home/mega/github/chrome-head/build/index.js')
configureChromeHead({
    LOG_LEVEL: 5,
    ENABLE_PLUGINS: false,
});
const malURL = `https://myanimelist.net/animelist/Megga?status=1`;
const cookiesPath = './cookies';
let cookies = [];
let isAuthenticated = false;
const CREDENTIALS = {
    username: 'TheSafeguard',
    password: 'safeguardforMAL',
};
async function ensureCookies() {
    if (!cookies || !cookies.length) {
        try {
            cookies = readJsonSync(cookiesPath);
        }
        catch (err) {
            console.error('Catched in MAL.ensureCookies', err.code, err.path);
        }
    }
    if (!cookies || !cookies.length) {
        cookies = await bakeCookies(malURL);
        outputJsonSync(cookiesPath, cookies);
    }
}
exports.ensureCookies = ensureCookies;
async function getCW() {
    try {
        // await ensureCookies()
        const tab = await getChromeTab({
            url: malURL,
            // cookies,
            strategy: 'connect',
            forceClean: false,
        });
        await onLoadMiddleware(tab);
        // await authenticateIfNeeded(tab)
        const MalEntries = await scrapeOngoings(tab);
        // MalEntries.forEach(MalEntry => {
        //   if (MalEntry.title.match(/Amazing/)) {
        //     console.info('AMAZING: ', MalEntry)
        //   }
        // })
        return MalEntries;
    }
    catch (err) {
        console.error('[MAL] catched in getCW(): ', err.message);
        throw err;
        // return mocked MalEntry[], not to break qCycled job
        return [];
    }
}
exports.getCW = getCW;
async function updateProgress(options) {
    let { MAL_ID, MalEntry, newEpisodeNumber } = options;
    if (!MAL_ID) {
        if (MalEntry) {
            MAL_ID = MalEntry.MAL_ID;
        }
        else {
            throw new RangeError('Invalid upOptions in MAL.updateProgress');
        }
    }
    try {
        const tab = await getChromeTab({
            url: malURL,
            // cookies,
            strategy: 'connect',
            forceClean: false,
        });
        await onLoadMiddleware(tab);
        // await authenticateIfNeeded(tab)
        await tab.evaluate(_updateEpisodeNumber, {
            MAL_ID,
            newEpisodeNumber
        });
        await tab.evaluate(() => {
            // close popup if progress.current has reached progress.overall
            setTimeout(() => {
                const doNotSetAsCompleted = document.querySelector('#fancybox-confirm-no-button');
                doNotSetAsCompleted && doNotSetAsCompleted.click();
            }, 800);
        });
        console.info('[MAL.updateProgress]', { MAL_ID, newEpisodeNumber });
        return true;
    }
    catch (err) {
        console.error('[MAL.updateProgress] catched: ', err.message);
        // returning false implies we'll retry 2 secs later (by default)
        return false;
    }
}
exports.updateProgress = updateProgress;
function _updateEpisodeNumber({ MAL_ID, newEpisodeNumber }) {
    const input = document.getElementById('epID' + (MAL_ID + ''));
    if (!input)
        throw new Error(`[MAL.updateProgress] Cannot find <input> on MAL page`);
    // return console.warn(`[MAL.updateProgress] Cannot find <input> on MAL page`)
    input.value = newEpisodeNumber + '';
    const form = input.closest('form');
    let onsubmit = form && form.getAttribute('onsubmit');
    if (onsubmit) {
        // onsubmit="return changeep_loadurl('38301', '0', '1', 1, 0, 38301);"
        onsubmit = onsubmit.replace('return ', '');
        eval(onsubmit);
        {
            window.determineEpVisibility(MAL_ID + '');
        }
    }
    else {
        console.error('[MAL.updateProgress] error no onsubmit');
    }
}
/**
 * components
 */
function click(el) {
    el && el.click();
}
async function onLoadMiddleware(tab) {
    /**
     * mitigate the annoying policy blah-blah popup
     */
    await tab.evaluate(() => {
        const policyBtnSelector = 'body > div.root > div > div.modal-wrapper > div > button', el = document.querySelector(policyBtnSelector);
        el && el.click();
    });
    return tab;
}
async function authenticateIfNeeded(tab) {
    /**
     * check authentication
     */
    isAuthenticated = !(await tab.$('#malLogin'));
    if (isAuthenticated)
        return tab;
    /**
     * authenticate
     */
    /**
     * Old-fashion, with imperative login procedure
     */
    // const
    //   loginBtnSelector = '#dialog > tbody > tr > td > form > div > p.pt16.ac > input',
    //   CWSelector = '#list_surround > table:nth-child(2) > tbody > tr > td.status_selected > a'
    // await tab.$eval('#malLogin', click)
    // await tab.waitForSelector('#loginUserName')
    // await tab.type('#loginUserName', CREDENTIALS.username)
    // await tab.type('#login-password', CREDENTIALS.password)
    // await tab.$eval(loginBtnSelector, click)
    // await tab.waitForSelector(CWSelector)
    // /**
    //  * save authentication state
    //  */
    // const cookies = await tab.cookies()
    // outputJsonSync(cookiesPath, cookies)
    /**
     * New-style, ask user to login manually, then get cookies
     */
    cookies = await bakeCookies(malURL);
    isAuthenticated = true;
    outputJsonSync(cookiesPath, cookies);
    throw new Error('BreakException');
    // return tab
}
async function scrapeOngoings(tab) {
    // TODO: change $$eval to tab.evaluate
    return tab.$$eval('a.animetitle', (animetitles) => {
        return animetitles.map((at) => {
            const tr = at.closest('tr'), href = at.href, title = tr.querySelector('td:nth-child(2) > a.animetitle > span').innerText, scoreRaw = tr.querySelector('td:nth-child(3)').innerText, progressRaw = tr.querySelector('td:nth-child(5)').innerText, fetchTime = new Date().getTime();
            return decorateOngoing({
                href,
                title,
                scoreRaw,
                progressRaw,
                fetchTime,
            });
            function decorateOngoing(o) {
                o.MAL_ID = +o.href.replace(/https:\/\/myanimelist.net\/anime\/(\d+)\/.*/, '$1');
                o.title = o.title
                    .replace(/ \(TV\)/, '')
                    .replace(/[~!:]/g, '');
                o.score = +o.scoreRaw.replace('-', '0');
                o.progressRaw
                    .replace(/ \+/, '') // example: '2/12 +' or '15/- +'
                    .replace(/\-/g, '0')
                    .replace(/([\d]+)\/([\d]+)/, (match, $1, $2) => {
                    o.progress = {
                        current: +$1,
                        overall: +$2,
                    };
                    return '';
                });
                return o;
            }
        });
    });
}
