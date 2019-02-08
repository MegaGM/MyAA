<template>
  <div>
    <h2>MyAA: My Anime Assistant.</h2>
    <a-table
      :pagination="pagination"
      :columns="columns"
      :dataSource="MalEntries__byComplexAlgorithm"
      size="small"
      :showHeader="false"
    >
      <span slot="progress" slot-scope="progress, MalEntry">
        <a-button-group size="small">
          <a-button
            type="default"
            icon="arrow-up"
            size="small"
            @click="updateMalEntryProgress(progress.current + 1, MalEntry)"
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
            @click="updateMalEntryProgress(progress.current - 1, MalEntry)"
          />
        </a-button-group>
      </span>
      
      <span slot="titleAndTags" slot-scope="title, MalEntry" class="line-height2">
        <a @click="openLink(MalEntry.href)">{{MalEntry.title}}</a>

        <a-tag
          v-for="NyaaEpisode in NyaaEpisodes__byMalEntry(MalEntry)"
          :class="getNyaaEpisodeFileStatus(NyaaEpisode)"
          :key="NyaaEpisode.torrentID"
        >
          <span @click="downloadAndUpdate(NyaaEpisode)">&nbsp;{{NyaaEpisode.episodeNumber}}&nbsp;</span>
        </a-tag>
      </span>
    </a-table>
  </div>
</template>


<script>
import Vue from 'vue'

import { ipcRenderer } from 'electron'
import Vuex, { mapGetters, mapActions, mapMutations } from 'vuex'
import { getOrCreateStore } from '../store'
const store = getOrCreateStore()

function mapIfAny(type) {
  if (!['state', 'getters', 'mutations', 'actions'].includes(type))
    throw new RangeError('[Vuex:mapIfAny()] Invalid mapper type')

  const mapperKey = 'map' + type[0].toUpperCase() + type.slice(1)
  if (!['mapState', 'mapGetters', 'mapMutations', 'mapActions'].includes(mapperKey))
    throw new RangeError('[Vuex:mapIfAny()] Invalid mapperKey')

  const keys = Object.keys(store[type])
  if (!keys || !keys.length)
    return []

  return Vuex[mapperKey](keys)
}


export default {
  data() {
    return {
      pagination: { pageSize: 15 },
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
    }
  },
  computed: {
    ...mapIfAny('getters')
    // ...mapGetters(Object.keys(store.getters))
  },
  methods: {
    // ...mapActionsIfAny(),
    openLink(link) {
      this.$electron.shell.openExternal(link)
    },
    downloadAndUpdate({ title, href }) {
      this.openLink(href)
    },
    coldLoad() {
      ipcRenderer.send('COLD:MalEntries')
      ipcRenderer.send('COLD:NyaaEpisodes')
      ipcRenderer.send('COLD:files')
    },
    updateMalEntryProgress(newEpisodeNumber, MalEntry) {
      ipcRenderer.send('MAL.updateProgress', { newEpisodeNumber, MalEntry })
    },
  },
  async mounted() {
    this.coldLoad()
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

.ant-tag.fresh {
  color: #f5222d;
  background: #fff1f0;
  border-color: #ffa39e;
}

.ant-tag.downloaded {
  color: #1890ff;
  background: #e6f7ff;
  border-color: #91d5ff;
}

.ant-tag.done {
  color: #52c41a;
  background: #f6ffed;
  border-color: #b7eb8f;
}
</style>
