<template>
  <Dialog :title="id ? '编辑产品' : '新增产品'" :submit="handleSubmit">
    <el-form ref="form" :rules="rules" :model="product" label-width="100px">
      <el-form-item label="产品编号" prop="serialNum">
        <el-input v-model="product.serialNum" placeholder="请输入产品编号" />
      </el-form-item>
      <el-form-item label="产品名称" prop="name">
        <el-input v-model="product.name" placeholder="请输入产品名称" />
      </el-form-item>
      <el-form-item label="产品类别" prop="categoryId">
        <el-select v-model="product.categoryId" placeholder="请选择产品类别">
          <el-option v-for="(category, i) in categories" :key="i" :label="category.name" :value="category.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="单位" prop="unitId">
        <el-select v-model="product.unitId" placeholder="请选择产品单位">
          <el-option v-for="(unit, i) in units" :key="i" :label="unit.name" :value="unit.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="product.description" autosize placeholder="请输入产品描述" />
      </el-form-item>
      <el-form-item label="预警库存" prop="warnQty">
        <el-input-number v-model="product.warnQty" :min="0" :controls="false" placeholder="请输入产品预警数量" />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script lang="ts" setup>
import { Category } from '@/api/manufacture/types/category'
import { PropType } from 'vue'
import { getAllUnits } from '@/api/manufacture/unit'
import { Unit } from '@/api/manufacture/types/unit'
import { getAllMaterials } from '@/api/manufacture/material'
import { Material } from '@/api/manufacture/types/material'
import { getProductById, createProduct, updateProduct } from '@/api/manufacture/product'
import { ProductAttrs } from '@/api/manufacture/types/product'
import { validateQty } from '@/utils/validator'

const props = defineProps({
  id: {
    type: Number,
    default: null
  },
  categories: {
    type: Array as PropType<Category[]>,
    required: true
  }
})

const rules = reactive({
  serialNum: [
    { required: true, message: '产品编号不能为空', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '产品名称不能为空', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '产品类别不能为空', trigger: 'blur' }
  ],
  unitId: [
    { required: true, message: '产品单位不能为空', trigger: 'blur' }
  ],
  description: [
    { required: false, message: '产品描述不能为空', trigger: 'blur' }
  ],
  warnQty: [
    { required: true, validator: validateQty, trigger: 'blur' }
  ]
})

onMounted(() => {
  if (props.id) loadProduct()
  loadAllUnits()
  loadAllMaterials()
})

// 产品单位
const units = ref<Unit[]>([])
const loadAllUnits = async () => {
  const results = await getAllUnits()
  units.value = results
}

// 原料
const materials = ref<Material[]>([])
const loadAllMaterials = async () => {
  const results = await getAllMaterials()
  materials.value = results
}

// 产品信息
const product = reactive({} as ProductAttrs)
const loadProduct = async () => {
  const {
    serialNum,
    name,
    category,
    unit,
    description,
    warnQty
  } = await getProductById(props.id)

  Object.assign(product, {
    serialNum,
    name,
    categoryId: category?.id,
    unitId: unit?.id,
    description,
    warnQty
  })
}

// 表单提交
const form = ref<typeof ElForm>()
const emit = defineEmits(['submit'])
const handleSubmit = async () => {
  const valid = await form.value?.validate()
  if (!valid) return
  // 验证通过
  if (!props.id) {
    await createProduct(product)
    ElMessage.success('新增成功')
  } else {
    await updateProduct(props.id, product)
    ElMessage.success('更新成功')
  }
  emit('submit')
}

</script>
