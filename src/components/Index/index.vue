<template>
  <el-card>
    <template #header>
      <el-form v-if="filter" ref="form" inline :model="params" :disabled="store.state.isLoading">
        <slot name="form-item" />
        <el-form-item>
          <el-button-group>
            <el-button type="primary" :icon="'Search'" @click="load">搜索</el-button>
            <el-button type="primary" @click="resetFields(form)">重置</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
      <slot name="form" />
      <el-button-group>
        <el-button v-if="defaultHandler" type="primary" :icon="'Plus'" @click="handlerA">新增{{ title }}</el-button>
        <slot name="form-item-button" />
      </el-button-group>
    </template>
    <slot name="table-header" />
    <el-table :data="data" v-loading="store.state.isLoading" @selection-change="onDataSelect">
      <slot name="table-column" />
    </el-table>
    <Pagination
      v-model:page="params.page"
      v-model:size="params.size"
      :count="count"
      :load-list="load"
      :disabled="store.state.isLoading"
    />
  </el-card>
  <slot name="a" />
  <slot name="b" />
  <slot name="c" />
  <slot name="d" />
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import store from '@/store'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  params: {
    type: Object,
    required: true
  },
  count: {
    type: Number,
    required: true
  },
  data: {
    type: Array,
    required: true
  },
  onDataSelect: {
    type: Function as PropType<(data: any) => void>,
    default: () => {}
  },
  load: {
    type: Function as PropType<() => Promise<void>>,
    default: () => Promise.resolve()
  },
  handlerA: {
    type: Function as PropType<(payload: number | MouseEvent) => void>,
    default: () => {}
  },
  filter: {
    type: Boolean,
    default: true
  },
  defaultHandler: {
    type: Boolean,
    default: true
  }
})

const { title, params, count, data } = toRefs(props)

const form = ref<typeof ElForm>()
const resetFields = (form: typeof ElForm | undefined) => {
  if (!form) return
  form.resetFields()
  props.load()
}

</script>

<style lang="scss" scoped>

</style>
