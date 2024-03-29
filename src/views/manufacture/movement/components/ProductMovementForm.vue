<template>
  <el-dialog
    title="产品出入库"
    ref="dialog"
    v-model="visible"
    custom-class="product-movement-dialog-container"
    destroy-on-close
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    center
  >
    <el-form ref="form" :model="movement" :rules="rules" label-width="70px">
      <el-form-item prop="type">
        <el-radio-group v-model="movement.type">
          <el-radio-button :label="DECR">出库</el-radio-button>
          <el-radio-button :label="INCR">入库</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="项目">
        <el-table v-if="movement.type === INCR" :data="movement.goods" style="width: 100%" border>
          <el-table-column type="index" align="center" width="60" />
          <el-table-column label="产品" align="center">
            <template #default="scope">
              <el-form-item class="product-form-item">
                <el-select v-model="scope.row.productId" placeholder="请选择产品">
                  <el-option v-for="(p, i) in products" :key="i" :label="p.name" :value="p.id" />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="规格" align="center">
            <template #default="scope">
              <el-form-item class="product-form-item">
                <el-input v-model="scope.row.size" placeholder="请输入规格" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="重量" align="center">
            <template #default="scope">
              <el-form-item class="product-form-item">
                <el-input v-model="scope.row.weight" placeholder="请输入重量" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="消耗原料" align="center" inline>
            <template #default="scope">
              <el-form-item class="product-form-item">
                <el-select v-model="scope.row.materialId" placeholder="请选择原料">
                  <el-option v-for="(m, i) in materials" :key="i" :label="m.name" :value="m.id" />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="消耗数量" align="center">
            <template #default="scope">
              <el-form-item class="product-form-item">
                <el-input-number v-model="scope.row.materialQty" :min="0" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="定价(元)" align="center">
            <template #default="scope">
              <el-form-item class="product-form-item">
                <el-input-number v-model="scope.row.fixedPrice" :min="0" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="数量" align="center">
            <template #default="scope">
              <el-form-item class="product-form-item">
                <el-input-number v-model="scope.row.quantity" :min="0" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template #default="scope">
              <el-button type="primary" link @click="deleteGoods(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-table v-else :data="movement.commodities" style="width: 100%" border>
          <el-table-column type="index" align="center" width="60" />
          <el-table-column label="* 商品编号" align="center">
            <template #default="scope">
              <el-form-item>
                <el-input v-model="scope.row.serialNum" placeholder="请输入编号" @blur="onBlur(scope.row)" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="name" align="center" />
          <el-table-column label="规格" prop="size" align="center" />
          <el-table-column label="重量" prop="weight" align="center" />
          <el-table-column label="操作" width="100" align="center">
            <template #default="scope">
              <el-button type="primary" link @click="deleteCommodity(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleAdd">添加项目</el-button>
      </el-form-item>
      <el-form-item label="数量" prop="quantity">
        <el-input-number :model-value="qty" :controls="false" disabled />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="movement.remark" autosize placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="isLoading">提 交</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { Product } from '@/api/manufacture/types/product'
import { Material } from '@/api/manufacture/types/material'
import { createProductMovement } from '@/api/manufacture/movement'
import { ProductMovementAttrs } from '@/api/manufacture/types/movement'
import { validateQty } from '@/utils/validator'
import { DECR, INCR, PRODUCT } from '@/utils/constants'
import { getCommodityBySerialNum } from '@/api/commerce/commodity'

defineProps({
  products: {
    type: Array as PropType<Product[]>,
    required: true
  },
  materials: {
    type: Array as PropType<Material[]>,
    required: true
  }
})

// 表单验证
const rules = reactive({
  type: [
    { required: true, message: '出｜入库不能为空', trigger: 'blur' }
  ],
  quantity: [
    { required: true, validator: validateQty, trigger: 'blur' }
  ],
  remark: [
    { required: false, message: '备注不能为空', trigger: 'blur' }
  ]
})

// 变动信息
const movement = reactive({
  type: DECR,
  target: PRODUCT,
  goods: [{
    productId: undefined,
    size: '',
    weight: '',
    fixedPrice: 0,
    quantity: 1,
    materialId: undefined,
    materialQty: 0
  }],
  commodities: [{
    serialNum: '',
    name: '',
    size: '',
    weight: ''
  }],
  quantity: undefined,
  remark: ''
} as ProductMovementAttrs)

const qty = computed(() => movement.type === INCR ? movement.goods?.reduce((sum, item) => (sum + item.quantity), 0) : movement.commodities?.length)

// 入库
const deleteGoods = async (index: number) => {
  movement.goods?.splice(index, 1)
}

// 出库
const deleteCommodity = async (index: number) => {
  movement.commodities?.splice(index, 1)
}

const onBlur = async (article: {
  serialNum: string;
  name: string;
  size: string;
  weight: string;
  }) => {
  getCommodityBySerialNum(article.serialNum)
    .then(commodity => {
      const { product: { name: productName }, size, weight } = commodity
      article.name = productName
      article.size = size
      article.weight = weight
    })
    .catch(error => {
      console.log(error)
    })
}

const handleAdd = () => {
  if (movement.type === INCR) {
    movement.goods?.push({
      productId: undefined,
      size: '',
      weight: '',
      fixedPrice: 0,
      quantity: 1,
      materialId: undefined,
      materialQty: 0
    })
  } else {
    movement.commodities?.push({
      serialNum: '',
      name: '',
      size: '',
      weight: ''
    })
  }
}

// 表单提交
const isLoading = ref(false)
const form = ref<typeof ElForm>()
const emit = defineEmits(['submit'])
const handleSubmit = async () => {
  movement.quantity = qty.value
  const { type, quantity, goods, commodities, remark } = movement

  const valid = await form.value?.validate()
  if (!valid) return

  if (type === DECR) {
    movement.commodities?.forEach(item => {
      item.serialNum = item.serialNum.trim()
    })

    if (!movement.commodities?.length) return ElMessage.error('项目为必填项')
    if (movement.commodities?.some(item => item.serialNum === '')) return ElMessage.error('编号不能为空')

    const unique: string[] = []
    const duplicate: string[] = []

    movement.commodities?.forEach(item => {
      if (unique.indexOf(item.serialNum) === -1) {
        unique.push(item.serialNum)
      } else {
        duplicate.push(item.serialNum)
      }
    })

    const list = [...new Set(duplicate)]
    if (list.length > 0) {
      return ElMessage.error(`编号${list}重复，请检查编号`)
    }
  }

  // 验证通过
  ElMessageBox.confirm(
    type === INCR ? '确定提交产品入库?' : '确定提交产品出库?',
    type === INCR ? '产品入库' : '产品出库'
  ).then(async () => {
    isLoading.value = true

    let ret = null
    if (type === INCR) {
      ret = await createProductMovement({ type, quantity, goods, remark })
    } else {
      ret = await createProductMovement({ type, quantity, serialNums: commodities?.map(item => item.serialNum), remark })
    }

    if (ret) {
      ElMessage.success('新增成功')
      emit('submit')
    }
    isLoading.value = false
  })
}

const visible = false
const dialog = ref<typeof ElDialog>()
const handleCancel = () => {
  dialog.value!.visible = false
}
</script>

<style lang="scss">
.product-movement-dialog-container {
  min-width: 1520px;

  .product-form-item {
    display: inline-flex;
  }
}
</style>
