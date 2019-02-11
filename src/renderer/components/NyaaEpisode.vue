<template>
  <a-tag
    class="padding-fix margin-fix"
    :class="getNyaaEpisodeFileStatus(NyaaEpisode)"
    :key="NyaaEpisode.torrentID"
  >
    <div class="display-flex">
      <div
        class="cell episode-number"
        @click="openNyaaEpisode(NyaaEpisode)"
      >{{NyaaEpisode.episodeNumber}}</div>
      <div class="cell download" @click="downloadTorrent(NyaaEpisode)">D</div>
      <div class="cell open" @click="openNyaaFile(NyaaEpisode)">O</div>
      <div class="cell finish" @click="markAsDone(NyaaEpisode)">F</div>
    </div>
  </a-tag>
</template>


<script>
import { ipcRenderer } from 'electron'

import { getOrCreateStore } from '../store'
const store = getOrCreateStore()

export default {
  props: ['NyaaEpisode'],
  computed: {
    ...store.mapAll('getters')
  },
  methods: {
    markAsDone(NyaaEpisode) {
      ipcRenderer.send('markAsDone', NyaaEpisode)
    },
    downloadTorrent(NyaaEpisode) {
      this.$root.openLink(NyaaEpisode.href)
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
  background: #fff1f0;
  border-color: #ffa39e;
}

.ant-tag.downloaded {
  color: #52c41a;
  background: #f6ffed;
  border-color: #b7eb8f;
}

.ant-tag.done {
  color: #1890ff;
  background: #e6f7ff;
  border-color: #91d5ff;
}

.cell {
  padding: 0 6px;
  border-right: 1px dashed;
}
.cell.episode-number {
}
.cell.download {
}
.cell.open {
}
.cell.finish {
  border-right: none;
}
</style>