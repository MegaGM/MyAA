'use strict'
/**
 * Check if this module is loaded as part of Electro
 * or as a standalone module, like `const Cycle = require('q-cycle')`
 */
if (!global.config || typeof global.config.getLogger !== 'function') {
  var log = {
    debug: console.log.bind(console),
    info: console.log.bind(console),
    error: console.error.bind(console),
  }
} else
  log = config.getLogger('modules/cycle')

Promise.delay = Promise.delay || (ms => new Promise(resolve => setTimeout(resolve, ms)))

if (!global.H)
  global.H = { now: () => new Date().getTime() }

/**
 * we're okay now, let's start actual work
 */
const
  math = require('mathjs'),
  cron = require('cron')

let debug = false // by default
// let debug = true

class Cycle {
  constructor(options = {}) {
    this.math = math
    if (options.debug != void 0)
      debug = options.debug

    this.checkQueueDelay = options.checkQueueDelay || 250
    this.stepTime = options.stepTime || 1 // seconds
    this.job = options.job
    this.inWork = false
    this.inQueue = false

    this.cronjob = new cron.CronJob({
      cronTime: `*/${this.stepTime} * * * * *`,
      onTick: this.nextIteration.bind(this),
      onComplete: console.log.bind('stopped meow'),
      start: false,
      timezone: 'Asia/Yekaterinburg',
    })

    if (debug) {
      this.elapsedTimes = []
      this.counters = {
        iterations: 0,
        finished: 0,
        catched: 0,
        startQueue: 0,
        checkQueue: 0,
        doubleBusy: 0,
      }
    }
  }

  setJob(job) {
    this.job = job
  }

  start() {
    this.cronjob.start()
  }

  stop() {
    this.break = true
    this.cronjob.stop()
  }

  nextIteration() {
    if (this.break)
      return null // break the cycle

    if (debug) {
      this.counters.iterations += 1
      if (this.inWork && this.inQueue)
        this.counters.doubleBusy += 1
      log.debug('\n', this.counters)
    }

    if (this.inWork && this.inQueue)
      return debug && log.debug('nextIteration is inWork and inQueue')
    if (this.inWork && !this.inQueue)
      return this.startQueue()
    if (!this.inWork && !this.inQueue)
      return this.work()
  }

  startQueue() {
    if (debug) {
      this.counters.startQueue += 1
      // log.debug('\n', this.counters)
    }
    this.inQueue = true
    return this.checkQueue()
  }

  checkQueue() {
    if (debug) {
      this.counters.checkQueue += 1
      // log.debug('\n', this.counters)
    }
    if (this.inWork)
      return Promise.delay(this.checkQueueDelay).then(() => this.checkQueue())
    else {
      this.inQueue = false
      return this.nextIteration()
    }
  }

  async work() {
    this.inWork = true
    if (debug) {
      this.startTime = H.now()
    }

    try {
      await this.job()
    } catch (err) {
      log.error(err)
      if (debug) {
        this.counters.catched += 1
      }
    } finally {
      this.inWork = false
      if (debug) {
        this.counters.finished += 1
        this.stopTime = H.now()

        let elapsed = this.stopTime - this.startTime
        this.elapsedTimes.push(elapsed)

        let min = this.counters.min || elapsed
        let max = this.counters.max || elapsed
        this.counters.min = elapsed < min ? elapsed : min
        this.counters.max = elapsed > max ? elapsed : max

        let median = this.math.median(this.elapsedTimes)
        let mean = this.math.mean(this.elapsedTimes)
        this.counters.median = this.math.floor(median)
        this.counters.mean = this.math.floor(mean)
        // log.debug('\n', this.counters)
      }
    }
  }

}

module.exports = Cycle
