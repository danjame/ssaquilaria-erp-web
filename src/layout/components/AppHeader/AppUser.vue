<template>
  <el-dropdown>
    <span class="username">{{ store.state.user?.name }}</span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item divided @click="handleLogout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import router from '@/router'
import store from '@/store'

const handleLogout = () => {
  ElMessageBox.confirm(
    '确定退出登录吗?',
    '退出提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }
  ).then(() => {
    store.commit('setUser', null)
    ElMessage.success('退出成功')
    router.push({ name: 'login' })
  })
}

</script>

<style lang="scss">
.username {
  color: $primary-color
}

</style>
