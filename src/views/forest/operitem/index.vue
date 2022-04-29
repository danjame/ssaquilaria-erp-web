<template>
  <el-card>
    <template #header>
      <el-form ref="form" inline :model="listParams" :disabled="store.state.isLoading">
        <el-form-item label="记录类" prop="operTypeId">
          <el-select v-model="listParams.operTypeId" placeholder="请选择记录类" clearable>
            <el-option v-for="operType in operTypes" :key="operType.id" :label="operType.name" :value="operType.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" :icon="'Search'" @click="loadOperItems">搜索</el-button>
            <el-button type="primary" @click="resetFields(form)">重置</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
      <el-button type="primary" :icon="'Plus'" @click="openForm">新增记录项</el-button>
    </template>
    <el-table :data="operItems" v-loading="store.state.isLoading">
      <el-table-column label="记录项名称" prop="name" align="center" />
      <el-table-column label="记录类" align="center">
        <template #default="scope">
          <span>{{ scope.row.operType?.name }}</span>
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
            <el-popconfirm title="确定要删除该记录项吗?" @confirm="handleDelete(scope.row.id)">
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
      :load-list="loadOperItems"
      :disabled="store.state.isLoading"
    />
  </el-card>
  <OperItemForm
    v-if="formVisible"
    v-model="formVisible"
    :id="operItemId"
    :oper-types="operTypes"
    @submit="onFormSubmitted"
  />
</template>

<script lang="ts" setup>
import OperItemForm from './components/OperItemForm.vue'
import { getOperItemsByConditions, deleteOperItem } from '@/api/forest/operitem'
import { OperItem } from '@/api/forest/types/operitem'
import { getAllOperTypes } from '@/api/forest/opertype'
import store from '@/store'

onMounted(() => {
  loadAllOperTypes()
  loadOperItems()
})

// 记录类
const operTypes = ref<OperItem[]>([])
const loadAllOperTypes = async () => {
  operTypes.value = await getAllOperTypes()
}

// 记录项列表
const listParams = reactive({
  operTypeId: undefined,
  page: 1,
  size: 10
})
const operItems = ref<OperItem[]>([])
const count = ref(0)
const loadOperItems = async () => {
  const data = await getOperItemsByConditions(listParams)
  operItems.value = data.results
  count.value = data.count
}

const form = ref<typeof ElForm>()
const resetFields = (form: ElForm | undefined) => {
  if (!form) return
  form.resetFields()
  loadOperItems()
}

// 新增与编辑组件
const formVisible = ref(false)
const operItemId = ref(undefined as number | undefined)
const openForm = (payload: number | MouseEvent) => {
  if (typeof payload === 'number') {
    operItemId.value = payload
  } else {
    operItemId.value = undefined
  }
  formVisible.value = true
}

const onFormSubmitted = () => {
  formVisible.value = false
  loadOperItems()
}

const handleDelete = async (id: number) => {
  await deleteOperItem(id)
  ElMessage.success('删除成功')
  loadOperItems()
}

// 监听参数变化
watch(() => listParams.operTypeId, id => {
  listParams.operTypeId = !id ? undefined : id
})
</script>

<style lang="scss" scoped>

</style>