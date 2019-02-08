<template>
  <a-layout id="app" class="layout">
    <a-layout-content class="content">
      <router-view></router-view>
    </a-layout-content>
    <a-layout-footer class="footer">
      Mega
      <span class="copyleft">&copy;</span> 2019
    </a-layout-footer>
  </a-layout>
</template>

<script>

export default {
}
</script>

<style>
body {
  background-color: #f0f2f5 !important;
}

.layout {
  padding: 0 50px;
}

.content {
  padding: 0 15px;
  background-color: #fff !important;
}

.footer {
  text-align: center;
  background-color: #f0f2f5 !important;
}

.copyleft {
  display: inline-block;
  transform: rotate(180deg);
}
</style>

