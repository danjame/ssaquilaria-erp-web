<template>
  <Dialog :title="id ? '编辑角色' : '新增角色'" :submit="handleSubmit">
    <el-form ref="form" :model="role" :rules="rules" label-width="100px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="role.name" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input type="textarea" v-model="role.remark" autosize placeholder="请输入描述" />
      </el-form-item>
      <el-form-item label="角色权限" prop="permissionIds">
        <el-select
          v-model="role.permissionIds"
          multiple
          collapse-tags
          collapse-tags-tooltip
          placeholder="请选择权限"
        >
          <el-option v-for="(permission, i) in permissions" :key="i" :label="permission.name" :value="permission.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="角色菜单" prop="menuIds">
        <el-tree
          ref="tree"
          :data="menus"
          show-checkbox
          node-key="id"
          :props="{ children: 'children', label: 'label' }"
          v-loading="menusLoading"
        />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script lang="ts" setup>
import { getAllPermissions } from '@/api/system/permission'
import { Permission } from '@/api/system/types/permission'
import { getAllMenus } from '@/api/system/menu'
import { Menu } from '@/api/system/types/menu'
import { createRole, getRoleById, updateRole } from '@/api/system/role'
import { RoleAttrs } from '@/api/system/types/role'
import { ElTree } from 'element-plus'

const props = defineProps({
  id: {
    type: Number,
    default: null
  }
})

// 表单验证
const rules = reactive({
  name: [
    { required: true, message: '角色名称不能为空', trigger: 'blur' }
  ],
  remark: [
    { required: false, message: '描述不能为空', trigger: 'blur' }
  ],
  permissionIds: [
    { required: false, message: '角色权限不能为空', trigger: 'blur' }
  ],
  menuIds: [
    { required: false, message: '角色菜单不能为空', trigger: 'blur' }
  ]
})

onMounted(async () => {
  loadAllPermissions()
  await loadAllMenus()
  if (props.id) await loadRole()
})

// 权限
const permissions = ref<Permission[]>()
const loadAllPermissions = async () => {
  permissions.value = await getAllPermissions()
}

// 菜单
const tree = ref<typeof ElTree>()

const menusLoading = ref(false)

const menus = ref<Menu[]>([])
const loadAllMenus = async () => {
  menusLoading.value = true
  menus.value = await getAllMenus()
  menusLoading.value = false
}

// 角色信息
const role = reactive({} as RoleAttrs)

const loadRole = async () => {
  const {
    name,
    remark,
    permissions,
    menuIds
  } = await getRoleById(props.id)

  Object.assign(role, {
    name,
    remark,
    permissionIds: permissions ? permissions.map(permission => permission.id) : [],
    menuIds: menuIds ? menuIds.map(Number) : []
  })

  // 回显选中菜单
  role.menuIds?.forEach(id => {
    const node = tree.value?.getNode(id)
    if (node && node.isLeaf) tree.value?.setChecked(id, true, false)
  })
}

// 表单提交
const form = ref<typeof ElForm>()
const emit = defineEmits(['submit'])
const handleSubmit = async () => {
  const valid = form.value?.validate()
  if (!valid) return
  // 验证通过
  // 获取所有选中 id
  role.menuIds = tree.value?.getCheckedNodes(false, true).map((node: { id: number }) => node.id)
  if (!props.id) {
    await createRole(role)
    ElMessage.success('新增成功')
  } else {
    await updateRole(props.id, role)
    ElMessage.success('更新成功')
  }

  emit('submit')
}

</script>
