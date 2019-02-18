<template>
  <a-layout id="app" class="layout myaa-theme-background-color">
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
.layout {
  /* padding: 0 50px; */
  padding: 0;
}

.content {
  padding: 30px 15px 0 15px;
}

.footer {
  text-align: center;
  background-color: #282a36;
  color: #919ca0;
}

.copyleft {
  display: inline-block;
  transform: rotate(180deg);
}
</style>

