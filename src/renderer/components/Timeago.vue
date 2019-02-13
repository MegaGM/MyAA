<template>
  <span v-if="this.timeago">{{timeago.days}}D {{timeago.hours}}:{{timeago.minutes}}</span>
  <span v-else>N/A</span>
</template>


<script>
export default {
  name: 'Timeago',
  props: ['timestamp'],
  data() {
    return {
      time: 0,
      intervalSwitch: true,
      intervalMs: 60 * 1000,
    }
  },
  computed: {
    timeago() {
      if (this.time)
        return this.parseTimestamp(this.time)
      else
        return null
    },
  },
  mounted() {
    this.time = +this.timestamp
    /**
     * SuperMonkey(tm) fix
     * its here to make the computed.timeago to recompute once in this.intervalMs
     */
    setInterval((function () {
      if (!this.time)
        return

      this.intervalSwitch = !this.intervalSwitch

      if (this.intervalSwitch)
        this.time += 1
      else
        this.time -= 1
    }).bind(this), this.intervalMs)
  },
  methods: {
    parseTimestamp(timestamp) {
      const
        now = new Date().getTime(),
        diff = now - timestamp,
        ISOFormattedDiff = new Date(diff).toISOString()

      return this.parseISODate(ISOFormattedDiff)
    },
    parseISODate(ISODate) {
      /**
       * calculate how much
       * years, months, days, hours, minutes, seconds
       * have passed since ISODate moment
       */
      // '1972-07-14T15:50:00.000Z'
      ISODate = ISODate.split('.')[0]

      // '1972-07-14T15:50:00'
      const [datestring, timestring] = ISODate.split('T')

      // '1972-07-14'
      let [years, months, days] = datestring.split('-').map(i => parseInt(i))
      years = years - 1970
      months = months - 1
      days = days - 1

      // '15:50:00'
      const [hours, minutes, seconds] = timestring.split(':').map(i => parseInt(i))

      const diff = {
        years,
        months,
        days,
        hours,
        minutes,
        seconds,
      }

      function prepend(unit) {
        diff[unit] = diff[unit] + ''
        return diff[unit].length === 1 ? '0' + diff[unit] : diff[unit]
      }

      diff.hours = prepend('hours')
      diff.minutes = prepend('minutes')

      return diff
    }
  },
}
</script>


<style></style>
