<template>
  <a-tag class="padding-fix margin-fix" :class="getFileStatusByNyaaEpisode(NyaaEpisode)">
    <div class="display-flex">
      <div class="cell episode-number" @click="openNyaaEpisode(NyaaEpisode)">
        <b>{{paddedEpisodeNumber}}</b>
      </div>
      <div class="cell download" @click="downloadNyaaEpisode(NyaaEpisode)">D</div>
      <div class="cell open" @click="openNyaaFile(NyaaEpisode)">O</div>
      <div class="cell finish" @click="finishNyaaEpisode(NyaaEpisode)">F</div>
    </div>
  </a-tag>
</template>


<script>
import { ipcRenderer } from 'electron'

import { getOrCreateStore } from 'renderer/store'
const store = getOrCreateStore()

export default {
  name: 'NyaaEpisode',
  props: ['NyaaEpisode'],
  computed: {
    ...store.mapAll('getters'),
    paddedEpisodeNumber() {
      const n = this.NyaaEpisode.episodeNumber
      return (n + '').length === 1 ? '0' + n : n
    },
  },
  methods: {
    downloadNyaaEpisode(NyaaEpisode) {
      ipcRenderer.send('enqueue:downloadNyaaEpisode', NyaaEpisode)
    },
    finishNyaaEpisode(NyaaEpisode) {
      ipcRenderer.send('enqueue:finishNyaaEpisode', NyaaEpisode)
    },
    openNyaaEpisode(NyaaEpisode) {
      const link = NyaaEpisode.href
        .replace('.torrent', '')
        .replace('download/', 'view/')
      this.$root.openLink(link)
    },
    openNyaaFile(NyaaEpisode) {
      const
        lookup = files =>
          files
            .filter(f => f.title.toLowerCase() === NyaaEpisode.title.toLowerCase())
            .filter(f => f.episodeNumber === NyaaEpisode.episodeNumber)

      const
        inOngoings = lookup(Object.values(store.state.files.ongoings)),
        inDone = lookup(Object.values(store.state.files.done))

      let filepath = null
      if (inOngoings.length)
        filepath = inOngoings[0].filepath
      else if (inDone.length)
        filepath = inDone[0].filepath
      else
        return

      filepath = 'file://' + filepath
      this.$root.openLink(filepath)
    },
  },
}
</script>


<style>
.ant-tag.padding-fix {
  padding: 0 !important;
}
.ant-tag.margin-fix {
  margin-bottom: 2px;
}

.ant-tag.fresh {
  color: #f5222d;
  border-color: #632f32;
  background-color: #2d2d2d;
}

.ant-tag.downloaded {
  color: #59cc20;
  border-color: #285d00;
  background-color: #2d2d2d;
}

.ant-tag.done {
  color: #1890ff;
  border-color: #23465c;
  background-color: #2d2d2d;
}

.cell {
  padding: 0 6px;
  border-right: 1px dashed;
}
.cell.finish {
  border-right: none;
}
</style>