<template>
  <Index
    title="树木"
    :params="listParams"
    :count="count"
    :data="trees"
    :load="loadTrees"
    :handler-a="openForm"
  >
    <template #form-item>
      <el-form-item label="树木编号" prop="serialNum">
        <el-input v-model="listParams.serialNum" placeholder="请输入树木编号" />
      </el-form-item>
      <el-form-item label="树木品种" prop="name">
        <el-input v-model="listParams.name" placeholder="请输入品种" />
      </el-form-item>
      <el-form-item label="所属林场" prop="farmId">
        <el-select v-model="listParams.farmId" placeholder="请选择林场" clearable>
          <el-option v-for="(farm, i) in farms" :key="i" :label="farm.name" :value="farm.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="林场区域" prop="areaId">
        <el-select v-model="listParams.areaId" placeholder="请选择区域" clearable>
          <el-option v-for="(area, i) in areas" :key="i" :label="area.name" :value="area.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="行" prop="positionX">
        <el-input-number v-model="listParams.positionX" placeholder="请输入行" />
      </el-form-item>
      <el-form-item label="列" prop="positionY">
        <el-input-number v-model="listParams.positionY" placeholder="请输入列" />
      </el-form-item>
    </template>
    <template #form-item-button>
      <el-button type="primary" :icon="'Upload'" @click="uploadVisible = true">批量上传</el-button>
    </template>
    <template #table-column>
      <el-table-column label="序号" type="index" align="center" width="60" />
      <el-table-column label="树木编号" prop="serialNum" align="center" min-width="140" />
      <el-table-column label="树木品种" prop="name" align="center" min-width="120" />
      <el-table-column label="所属林场" align="center">
        <template #default="scope">
          <span>{{ scope.row.farm.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="林场区域" align="center">
        <template #default="scope">
          <span>{{ scope.row.area.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="行" prop="positionX" align="center" />
      <el-table-column label="列" prop="positionY" align="center" />
      <el-table-column label="种植时间" align="center">
        <template #default="scope">
          <span>{{ moment(scope.row.plantedAt).format('YYYY/MM') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="210" align="center" fixed="right">
        <template #default="scope">
          <el-space spacer="|">
            <el-button type="primary" link @click="openRecord(scope.row.id)">查看</el-button>
            <el-button type="primary" link @click="openForm(scope.row.id)">编辑</el-button>
            <el-button type="primary" link @click="openReplace(scope.row.id)">补种</el-button>
            <el-popconfirm title="确定要删除该树木吗?" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="primary" link>删除</el-button>
              </template>
            </el-popconfirm>
          </el-space>
        </template>
      </el-table-column>
    </template>
    <template #a>
      <TreeForm
        v-if="formVisible"
        v-model="formVisible"
        :id="treeId"
        :farms="farms"
        @submit="onFormSubmitted"
      />
    </template>
    <template #b>
      <TreeRecord
        v-if="recordVisible"
        v-model="recordVisible"
        :id="treeId"
      />
    </template>
    <template #c>
      <TreeUpload
        v-if="uploadVisible"
        v-model="uploadVisible"
        @submit="onUploadSubmitted"
      />
    </template>
    <template #d>
      <TreeReplace
        v-if="replaceVisible"
        v-model="replaceVisible"
        :id="treeId"
        @submit="onReplaceSubmitted"
      />
    </template>
  </Index>
</template>

<script lang="ts" setup>
import TreeForm from './components/TreeForm.vue'
import TreeUpload from './components/TreeUpload.vue'
import TreeRecord from './components/TreeRecord.vue'
import TreeReplace from './components/TreeReplace.vue'
import { getAllFarms } from '@/api/forest/farm'
import { Farm } from '@/api/forest/types/farm'
import { getAreasByFarm } from '@/api/forest/area'
import { Area } from '@/api/forest/types/area'
import { getTreesByConditions, deleteTree } from '@/api/forest/tree'
import { Tree } from '@/api/forest/types/tree'
import moment from 'moment'

onMounted(() => {
  loadAllFarms()
  loadTrees()
})

// 所属林场
const farms = ref<Farm[]>([])
const loadAllFarms = async () => {
  farms.value = await getAllFarms()
}

// 林场区域
const areas = ref<Area[]>([])
const loadAreasByFarm = async (id: number) => {
  areas.value = await getAreasByFarm(id)
}

// 树木列表
const listParams = reactive({
  serialNum: undefined,
  name: undefined,
  farmId: undefined,
  areaId: undefined,
  positionX: undefined,
  positionY: undefined,
  page: 1,
  size: 10
})
const trees = ref<Tree[]>([])
const count = ref(0)
const loadTrees = async () => {
  const data = await getTreesByConditions(listParams)
  trees.value = data.results
  count.value = data.count
}

const handleDelete = async (id: number) => {
  await deleteTree(id)
  ElMessage.success('删除成功')
  loadTrees()
}

const treeId = ref<number | undefined>(undefined)
// 新增与编辑组件
const formVisible = ref(false)
const openForm = (payload: number | MouseEvent) => {
  if (typeof payload === 'number') {
    treeId.value = payload
  } else {
    treeId.value = undefined
  }
  formVisible.value = true
}

const onFormSubmitted = () => {
  formVisible.value = false
  loadTrees()
}

// 成长记录组件
const recordVisible = ref(false)
const openRecord = (payload: number) => {
  treeId.value = payload
  recordVisible.value = true
}

// 批量上传组件
const uploadVisible = ref(false)
const onUploadSubmitted = () => {
  uploadVisible.value = false
  loadTrees()
}

// 批量替换组件
const replaceVisible = ref(false)
const openReplace = (payload: number) => {
  treeId.value = payload
  replaceVisible.value = true
}
const onReplaceSubmitted = () => {
  replaceVisible.value = false
  loadTrees()
}

// 监听参数变化
watch(() => listParams.name, name => {
  if (name === '') listParams.name = undefined
})
watch(() => listParams.serialNum, serialNum => {
  if (serialNum === '') listParams.serialNum = undefined
})
watch(() => listParams.farmId, id => {
  listParams.areaId = undefined
  areas.value = []
  listParams.farmId = !id ? undefined : id
  if (id) loadAreasByFarm(id)
})
watch(() => listParams.areaId, id => {
  listParams.areaId = !id ? undefined : id
})
</script>
