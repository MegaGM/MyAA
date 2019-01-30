<template>
  <div>
    <h2>MyAnimeList: Currently Watching</h2>
    <a-table
      :pagination="pagination"
      :columns="columns"
      :dataSource="MalEntries"
      size="small"
      :showHeader="false"
    >
      <span slot="titleAndTags" slot-scope="title, MalEntry" class="line-height2">
        <a @click="openLink(MalEntry.href)">{{MalEntry.title}}</a>

        <a-tag
          v-for="NyaaEpisode in MalEntry.newEpisodes"
          :color="NyaaEpisode.downloaded ? 'blue' : 'red'"
          :key="NyaaEpisode.torrentID"
          closable
          @close="ignoreEpisode"
        >
          <span @click="downloadAndUpdate(NyaaEpisode)">&nbsp;{{NyaaEpisode.episodeNumber}}&nbsp;</span>
        </a-tag>
      </span>
      
      <span slot="progress" slot-scope="progress, MalEntry">
        <a-button-group size="small">
          <a-button
            type="default"
            icon="arrow-up"
            size="small"
            @click="updateMalEntryProgress(MalEntry.progress.current + 1, MalEntry)"
          />
          <a-button type="dashed">
            {{progress.current}}
            /
            {{progress.overall}}
          </a-button>
          <a-button
            type="default"
            icon="arrow-down"
            size="small"
            @click="updateMalEntryProgress(MalEntry.progress.current - 1, MalEntry)"
          />
        </a-button-group>
      </span>
    </a-table>
  </div>
</template>


<script>
import mockdata from '../mockdata.json'
import { ipcRenderer } from 'electron'


export default {
  data() {
    return {
      pagination: { pageSize: 13 },
      columns: [
        {
          key: 'progress',
          title: 'Progress',
          dataIndex: 'progress',
          scopedSlots: { customRender: 'progress' },
          width: '150px',
          align: 'center',
        },
        {
          key: 'title',
          title: 'Title and new episodes',
          dataIndex: 'title',
          scopedSlots: { customRender: 'titleAndTags' },
        },
      ],
      MalEntries: [],
      newEpisodes: {},
    }
  },
  computed: {
  },
  methods: {
    updateMalEntryProgress(newEpisodeNumber, MalEntry) {
      ipcRenderer.send('updateMalEntryProgress', { newEpisodeNumber, MalEntry })
    },
    openLink(link) {
      this.$electron.shell.openExternal(link)
    },
    downloadAndUpdate({ title, href }) {
      this.openLink(href)

      setTimeout(() => {
        this.forceMalEntryToBeUpdated(title)
      }, 10 * 1000)
    },
    ignoreEpisode(e) {
      e.preventDefault()
      let closest = e.target.closest('.ant-tag')
      console.info('ignoreEpisode closest: ', closest)
      ipcRenderer.send('ignoreEpisode')
    },
    sortMalEntries() {
      const withNewEpisodesOnly_descByLex = this.MalEntries
        .filter(MalEntry => MalEntry.newEpisodes.length)
        .sort((a, b) => a.title.localeCompare(b.title))

      const withoutNewEpisodesOnly_descByLex = this.MalEntries
        .filter(MalEntry => !MalEntry.newEpisodes.length)
        .sort((a, b) => a.title.localeCompare(b.title))

      this.MalEntries = [
        ...withNewEpisodesOnly_descByLex,
        ...withoutNewEpisodesOnly_descByLex,
      ]
    },
    forceMalEntryToBeUpdated(title) {
      ipcRenderer.send('forceMalEntryToBeUpdated', title)
    },
    requestDownloadedEpisodes() {
      ipcRenderer.send('getDownloadedEpisodes')
    },
    requestMalEntries() {
      ipcRenderer.send('getMalEntries')
    },
    requestUpdates() {
      ipcRenderer.send('getUpdates')
    },
    injectNewEpisodesToMalEntries() {
      for (const [title, newEpisodes] of Object.entries(this.newEpisodes))
        this.applyUpdate({ title, newEpisodes })
    },
    applyUpdate(update) {
      // console.info('applyUpdate: ', update.newEpisodes.length, update.title)
      for (const newEpisode of update.newEpisodes)
        console.info('applyUpdate FOR: ', newEpisode.downloaded, newEpisode.title, newEpisode.episodeNumber)

      if (update.newEpisodes.length === 0)
        return

      this.newEpisodes[update.title] = update.newEpisodes

      // MalEntries has 0 length at cold load
      for (const MalEntry of this.MalEntries) {
        if (MalEntry.title === update.title) {
          this.$set(MalEntry, 'newEpisodes', update.newEpisodes)
          this.sortMalEntries()
          break
        }
      }
    },
  },
  async mounted() {
    ipcRenderer.on('downloadedEpisodes', (event, downloadedEpisodes) => {
      console.info('downloadedEpisodes: ', downloadedEpisodes)
      this.downloadedEpisodes = downloadedEpisodes
    })
    this.requestDownloadedEpisodes()

    ipcRenderer.on('MalEntries', (event, MalEntries) => {
      console.info('MalEntries: ', MalEntries)
      this.MalEntries = MalEntries
      /**
       * because MalEntries do not contain MalEntry.newEpisodes anymore
       */
      this.injectNewEpisodesToMalEntries()
    })
    this.requestMalEntries()

    ipcRenderer.on('update', (event, update) => {
      this.applyUpdate(update)
    })

    ipcRenderer.on('updates', (event, updates) => {
      for (const update of updates)
        this.applyUpdate(update)

      this.injectNewEpisodesToMalEntries()
    })
    this.requestUpdates()
  },
}
</script> 
<style scoped>
h2 {
  margin: 20px;
}

.line-height2 {
  line-height: 2;
}
</style>
