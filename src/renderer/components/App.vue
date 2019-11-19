<template>
  <a-layout id="app" class="layout myaa-theme-background-color">
    <a-layout-content class="content">
      <router-view></router-view>
    </a-layout-content>
    <a-layout-footer class="footer">
      Megga
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
  /* padding: 30px 15px 0 15px; */
  padding: 60px 22.5% 0 22.5%;
}

.footer {
  text-align: center;
  background-color: #282a36;
  background-color: #08080a;
  background-color: #000000;
  color: #919ca0;
}

.copyleft {
  display: inline-block;
  transform: rotate(180deg);
}
</style>

