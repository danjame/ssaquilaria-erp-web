<template>
  <el-breadcrumb separator=">">
    <el-breadcrumb-item v-for="(route, i) in routes" :key="i">
      {{ route.meta!.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts" setup>
import router from '@/router'

const routes = computed(() => {
  return router.currentRoute.value.matched.filter(item => item.meta.title)
})

</script>
