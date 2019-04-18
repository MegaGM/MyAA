/**
 * externals are listed in webpack.config.js
 * @example
 * ['ws', 'fsevents', 'puppeteer', 'vue']
 */
global.puppeteer = require('puppeteer')
global.vue = require('vue')

require('./build/main/electron-main.js')