<template>
  <div>
    <a-progress
      v-if="(progressBar && progressBar < 100)"
      :percent="progressBar"
      status="active"
      strokeLinecap="square"
      :strokeColor="('#1bc3d8')"
      :format="format => format + '%'"
    />
    <a-list
      size="small"
      bordered
      :dataSource="MalEntries__ascByTitle"
      class="myaa-theme-background-color myaa-theme-border-color"
    >
      <div
        slot="header"
        class="display-flex myaa-theme-color myaa-theme-border-color"
        id="table-header"
      >
        <div class="magic-cell progress">Progress</div>
        <div class="magic-cell timeago">Timeago</div>
        <div class="magic-cell episodes">Episodes</div>
        <div class="magic-cell title">
          Title
          <a-badge
            :count="MalEntries__ascByTitle.length"
            class="myaa-theme-background-color myaa-theme-border-color text-bold"
            style="vertical-align: text-bottom;"
          ></a-badge>
          <!-- :numberStyle="{backgroundColor: '#f0f2f5', color: 'rgba(0, 0, 0, 0.65)'}" -->
        </div>
      </div>

      <a-list-item
        slot="renderItem"
        slot-scope="MalEntry"
        :key="MalEntry.MAL_ID"
        class="myaa-theme-border-color"
      >
        <div class="magic-cell progress myaa-theme-color">
          <a-button-group size="small">
            <!-- <a-button
              type="default"
              icon="arrow-up"
              size="small"
              @click="updateMalEntryProgress(MalEntry.progress.current + 1, MalEntry)"
            />-->
            <!-- <span>
            {{MalEntry.progress.current}}
            /
            {{MalEntry.progress.overall}}
            </span>-->
            <a-button class="myaa-theme-color myaa-theme-background-color">
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

        <div class="magic-cell timeago myaa-theme-color">
          <Timeago
            :timestamp="getLastNyaaEpisodeUploadTimeByMalEntry(MalEntry)"
            :class="{outdated: isMalEntryOutdated(MalEntry)}"
          ></Timeago>
        </div>

        <div class="magic-cell episodes">
          <NyaaEpisode
            v-for="NyaaEpisode in getFreshNyaaEpisodesByMalEntry(MalEntry)"
            :key="NyaaEpisode.torrentID"
            :NyaaEpisode="NyaaEpisode"
          ></NyaaEpisode>
        </div>

        <div class="magic-cell title">
          <a @click="$root.openLink(MalEntry.href)" class="myaa-theme-color">{{MalEntry.title}}</a>
        </div>
      </a-list-item>
    </a-list>
  </div>
</template>


<script>
import Vuex, { mapGetters, mapActions, mapMutations } from 'vuex'
import { getOrCreateStore } from 'renderer/store'
const store = getOrCreateStore()

import NyaaEpisode from './NyaaEpisode'
import Timeago from './Timeago'


export default {
  components: { NyaaEpisode, Timeago },
  computed: {
    ...store.mapAll('getters'),
    progressBar() {
      const
        keys = Object.keys(store.state.MalEntries),
        overall = keys.length,
        outdated = keys.filter(key => {
          const MalEntry = store.state.MalEntries[key]
          return store.getters.isMalEntryOutdated(MalEntry)
        }).length,
        updated = overall - outdated

      return Math.floor(((100 / overall) * updated))
    },
  },
  methods: {
    coldLoad() {
      // this.$scSocket.emit('COLD:state')
      // ipcRenderer.on('COLD:state', (event, state) => {
      //   store.replaceState(JSON.parse(state))
      //   console.info('store.state: ', store.state)
      // })

      // this.$scSocket.emit('COLD:state')

      this.$scSocket.emit('COLD:MalEntries')
      this.$scSocket.emit('COLD:fetchTime')
      this.$scSocket.emit('COLD:files')
      this.$scSocket.emit('COLD:NyaaEpisodes')
    },
    updateMalEntryProgress(newEpisodeNumber, MalEntry) {
      this.$scSocket.emit('MAL.updateProgress', { newEpisodeNumber, MalEntry })
    },
  },
  mounted() {
    this.coldLoad()
  },
}
</script> 


<style>
#table-header {
  margin: 0 -16px;
}

.ant-list-split .ant-list-header {
  border-bottom: 1px solid #1ac3d8;
}

.magic-cell.progress {
  flex-basis: 88px;
  flex-shrink: 0;
  padding-right: 10px;
  text-align: right;
}
.magic-cell.timeago {
  flex-basis: 90px;
  flex-shrink: 0;
  padding-right: 10px;
  text-align: right;
}
.magic-cell.timeago .outdated {
  color: #ff4e4e;
}
.magic-cell.episodes {
  flex-basis: 126px;
  flex-shrink: 0;
  text-align: center;
}
.magic-cell.title {
  flex-grow: 1;
}
.magic-cell.title a {
  /* vertical-align: middle; */
  vertical-align: sub;
}

.ant-list-bordered {
  /* border-left: none;
  border-right: none; */
}

.ant-list-item {
  padding: 3px 0 !important;
}

.ant-btn {
  border-color: #144d54;
}
.ant-btn:hover,
.ant-btn:focus {
  color: #1bc3d8;
  border-color: #144d54;
  background-color: inherit;
}

.ant-progress-line {
  position: absolute;
  top: 0;
  padding: 0 240px 0 200px;
}
.ant-progress-inner {
  background-color: rgb(0, 113, 127);
}
.ant-progress-text {
  color: #1bc3d8;
}
</style>
