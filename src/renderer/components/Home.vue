<template>
  <div>
    <a-list size="small" bordered :dataSource="MalEntries__ascByTitle" class="white-bg">
      <div slot="header" class="display-flex" id="table-header">
        <div class="magic-cell progress">Progress</div>
        <div class="magic-cell timeago">Timeago</div>
        <div class="magic-cell episodes">Episodes</div>
        <div class="magic-cell title">Title
          <a-badge
            :count="MalEntries__ascByTitle.length"
            :numberStyle="{backgroundColor: '#f0f2f5', color: 'rgba(0, 0, 0, 0.65)'}"
          ></a-badge>
        </div>
      </div>

      <a-list-item
        slot="renderItem"
        slot-scope="MalEntry, index"
        class="padding-fix"
        :key="MalEntry.MAL_ID"
      >
        <div class="magic-cell progress">
          <a-button-group size="small">
            <!-- <a-button
              type="default"
              icon="arrow-up"
              size="small"
              @click="updateMalEntryProgress(MalEntry.progress.current + 1, MalEntry)"
            />-->
            <a-button type="dashed">
              {{MalEntry.progress.current}}
              /
              {{MalEntry.progress.overall}}
            </a-button>
            <!-- <a-button
              type="default"
              icon="arrow-down"
              size="small"
              @click="updateMalEntryProgress(MalEntry.progress.current - 1, MalEntry)"
            />-->
          </a-button-group>
        </div>

        <div class="magic-cell timeago">
          <Timeago :timestamp="getLastNyaaEpisodeUploadTimeByMalEntry(MalEntry)"></Timeago>
        </div>

        <div class="magic-cell episodes">
          <NyaaEpisode
            v-for="NyaaEpisode in getFreshNyaaEpisodesByMalEntry(MalEntry)"
            :key="NyaaEpisode.torrentID"
            :NyaaEpisode="NyaaEpisode"
          ></NyaaEpisode>
        </div>

        <div class="magic-cell title">
          <a @click="$root.openLink(MalEntry.href)">{{MalEntry.title}}</a>
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
import Timeago from './Timeago'


export default {
  components: { NyaaEpisode, Timeago },
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
  flex-basis: 80px;
  flex-shrink: 0;
  padding-right: 10px;
  text-align: right;
}

.magic-cell.timeago {
  flex-basis: 80px;
  flex-shrink: 0;
  padding-right: 10px;
  text-align: right;
}

.magic-cell.episodes {
  flex-basis: 95px;
  flex-shrink: 0;
  text-align: center;
}

.magic-cell.title {
  flex-grow: 1;
}

.ant-list-item.padding-fix {
  padding: 2px 0 !important;
}

#table-header {
  margin: 0 -16px;
}
</style>
