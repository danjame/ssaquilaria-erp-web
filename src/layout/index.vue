<template>
  <el-container>
    <el-aside><AppAside /></el-aside>
    <el-container>
      <el-header><AppHeader /></el-header>
      <el-main><router-view /></el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import AppAside from './components/AppAside/index.vue'
import AppHeader from './components/AppHeader/index.vue'

</script>

<style lang="scss" scoped>
.el-container {
  height: 100vh;
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-aside {
  width: auto;
}

.el-main {
  background-color: $body-bg;
}

</style>
