<template>
  <div>
    <a-table :columns="columns" :dataSource="ongoings">
      <h2 slot="title" slot-scope="ongoings, ongoing">MyAnimeList Currently Watching</h2>
      <a slot="aTitle" slot-scope="title, ongoing" @click="openLink(ongoing.href)">{{ongoing.title}}</a>
      <span slot="tags" slot-scope="tags, ongoing">
        <a-tag v-for="tag in tags" color="blue" :key="tag">{{tag}}</a-tag>
      </span>
      <span slot="progress" slot-scope="p, ongoing">
        <span>{{ongoing.progress.current}} / {{ongoing.progress.maximum}}</span>
      </span>
      <span slot="action" slot-scope="href, ongoing">
        <a href="javascript:;">Invite 一</a>
        <a-divider type="vertical"/>
        <a href="javascript:;">D1</a>
      </span>
    </a-table>
  </div>
</template>


<script>
import mockdata from '../mockdata.json'

const columns = [{
  key: 'title',
  title: 'Title',
  dataIndex: 'title',
  scopedSlots: { customRender: 'aTitle' },
}, {
  key: 'score',
  title: 'Score',
  dataIndex: 'score',
}, {
  key: 'progress',
  title: 'Progress',
  dataIndex: 'progress',
  scopedSlots: { customRender: 'progress' },
}, {
  key: 'tags',
  title: 'Tags',
  dataIndex: 'tags',
  scopedSlots: { customRender: 'tags' },
}, {
  title: 'Action',
  key: 'action',
  scopedSlots: { customRender: 'action' },
}]

export default {
  data() {
    return {
      home: 'dasha',
      ongoings: mockdata,
      columns,
    }
  },
  methods: {
    openLink(link) {
      this.$electron.shell.openExternal(link)
    }
  },
}
</script> 