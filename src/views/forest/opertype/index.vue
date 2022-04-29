<template>
  <el-card>
    <template #header>
      <el-button type="primary" :icon="'Plus'" @click="openForm">新增记录类</el-button>
    </template>
    <el-table :data="operTypes" v-loading="store.state.isLoading">
      <el-table-column label="记录类名称" prop="name" align="center" />
      <el-table-column label="记录项" min-width="1200" align="center">
        <template #default="scope">
          <span v-if="!scope.row.operItems.length">-</span>
          <el-space v-else>
            <el-tag v-for="(item, i) in scope.row.operItems" :key="i">{{ item.name }}</el-tag>
          </el-space>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template #default="scope">
          <span>{{ scope.row.remark ? scope.row.remark : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center" fixed="right">
        <template #default="scope">
          <el-space spacer="|">
            <el-button type="text" @click="openForm(scope.row.id)">编辑</el-button>
            <el-popconfirm title="确定要删除该记录类吗?" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="text">删除</el-button>
              </template>
            </el-popconfirm>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-model:page="listParams.page"
      v-model:size="listParams.size"
      :count="count"
      :load-list="loadOperTypes"
      :disabled="store.state.isLoading"
    />
  </el-card>
  <OperTypeForm
    v-if="formVisible"
    v-model="formVisible"
    :id="operTypeId"
    @submit="onFormSubmitted"
  />
</template>

<script lang="ts" setup>
import OperTypeForm from './components/OperTypeForm.vue'
import { getOperTypesByConditions, deleteOperType } from '@/api/forest/operType'
import { OperType } from '@/api/forest/types/operType'
import store from '@/store'

onMounted(() => {
  loadOperTypes()
})

// 记录类列表
const listParams = reactive({
  page: 1,
  size: 10
})
const operTypes = ref<OperType[]>([])
const count = ref(0)
const loadOperTypes = async () => {
  const data = await getOperTypesByConditions(listParams)
  operTypes.value = data.results
  count.value = data.count
}

// 新增与编辑组件
const formVisible = ref(false)
const operTypeId = ref(undefined as number | undefined)
const openForm = (payload: number | MouseEvent) => {
  if (typeof payload === 'number') {
    operTypeId.value = payload
  } else {
    operTypeId.value = undefined
  }
  formVisible.value = true
}

const onFormSubmitted = () => {
  formVisible.value = false
  loadOperTypes()
}

const handleDelete = async (id: number) => {
  await deleteOperType(id)
  ElMessage.success('删除成功')
  loadOperTypes()
}

</script>

<style lang="scss" scoped>

</style>