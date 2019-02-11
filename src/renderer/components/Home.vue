<template>
  <div>
    <a-list size="small" bordered :dataSource="MalEntries__byComplexAlgorithm" class="white-bg">
      <div slot="header">MyAA CW: {{MalEntries__byComplexAlgorithm.length}}</div>

      <a-list-item slot="renderItem" slot-scope="MalEntry, index" class="padding-fix">
        <div class="magic-cell progress">
          <a-button-group size="small">
            <a-button
              type="default"
              icon="arrow-up"
              size="small"
              @click="updateMalEntryProgress(MalEntry.progress.current + 1, MalEntry)"
            />
            <a-button type="dashed">
              {{MalEntry.progress.current}}
              /
              {{MalEntry.progress.overall}}
            </a-button>
            <a-button
              type="default"
              icon="arrow-down"
              size="small"
              @click="updateMalEntryProgress(MalEntry.progress.current - 1, MalEntry)"
            />
          </a-button-group>
        </div>

        <div class="magic-cell title-and-tags">
          <a @click="$root.openLink(MalEntry.href)">{{MalEntry.title}}</a>

          <NyaaEpisode
            v-for="NyaaEpisode in NyaaEpisodes__byMalEntry(MalEntry)"
            :class="getNyaaEpisodeFileStatus(NyaaEpisode)"
            :key="NyaaEpisode.torrentID"
            :NyaaEpisode="NyaaEpisode"
          ></NyaaEpisode>
        </div>
      </a-list-item>
    </a-list>
  </div>
</template>


<script>
import { ipcRenderer } from 'electron'

import Vue from 'vue'
import Vuex, { mapGetters, mapActions, mapMutations } from 'vuex'
import { getOrCreateStore } from '../store'
const store = getOrCreateStore()

import NyaaEpisode from './NyaaEpisode'

export default {
  components: { NyaaEpisode },
  computed: {
    ...store.mapAll('getters')
  },
  methods: {
    openLink(link) {
      this.$electron.shell.openExternal(link)
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


<style>
.magic-cell.progress {
  flex-basis: 152px;
  flex-shrink: 0;
  padding-right: 22px;
  text-align: right;
}

.magic-cell.title-and-tags {
  flex-grow: 1;
}

.ant-list-item.padding-fix {
  padding: 2px 0 !important;
}
</style>
