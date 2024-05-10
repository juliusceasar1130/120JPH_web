<template>
  <el-card>
    <el-form inline class="form">
      <el-form-item label="职位搜索">
        <el-input placeholder="请输入职位关键字" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="!keyword" @click="search">
          搜索
        </el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card>
    <el-button type="primary" icon="Plus" @click="addRole">添加职位</el-button>
    <el-table border style="margin: 10px 10px" :data="allRole">
      <el-table-column type="index" aglin="center" label="#"></el-table-column>
      <el-table-column align="center" label="ID" prop="id"></el-table-column>
      <el-table-column
        align="center"
        label="职位名称"
        prop="roleName"
      ></el-table-column>
      <el-table-column
        align="center"
        label="创建时间"
        prop="createTime"
      ></el-table-column>
      <el-table-column
        align="center"
        label="更新时间"
        prop="updateTime"
      ></el-table-column>
      <el-table-column align="center" label="操作" width="400px">
        <template #="{ row, $index }">
          <el-button
            type="primary"
            size="small"
            icon="User"
            @click="setPermisstion(row)"
          >
            分配权限
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateRole(row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            :title="`你确定要删除${row.roleName}?`"
            width="260px"
            @confirm="removeRole(row.id)"
          >
            <template #reference>
              <el-button type="primary" size="small" icon="Delete">
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[5, 7, 8, 9]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @size-change="gethasRole()"
      @current-change="gethasRole(pageNo)"
    />
  </el-card>
  <!--添加和更新已有职位的结构-->
  <el-dialog
    v-model="dialogVisible"
    :title="RoleParams.id > 0 ? '更新职位' : '添加职位'"
    width="500"
    :before-close="handleClose"
  >
    <el-form :model="RoleParams" :rules="rules" ref="formRef">
      <el-form-item label="职位名称" prop="roleName">
        <el-input
          placeholder="请输入职位名称"
          v-model="RoleParams.roleName"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确认</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 抽屉组件:分配职位的菜单权限与按钮的权限 -->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>分配菜单与按钮的权限</h4>
    </template>
    <template #default>
      <!-- 树形控件 -->
      <el-tree
        ref="tree"
        :data="menuArr"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="selectArr"
        :props="defaultProps"
      />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="handler">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqAllRoleList,
  reqAddOrUpdateRole,
  reqAllMenuList,
  reqSetPermisstion,
  reqRemoveRole,
} from '@/api/acl/role'
import type {
  RoleResponseData,
  Records,
  RoleData,
  MenuResponseData,
  MenuList,
} from '@/api/acl/role/type'
import useLayOutSettingStore from '@/store/modules/setting'
import { ElMessage } from 'element-plus'

let pageNo = ref(1)
let pageSize = ref(10)
let total = ref()
//搜索职位的关键字
let keyword = ref('')
let allRole = ref<Records>([])

let settingStore = useLayOutSettingStore()
//对话框显示隐藏
let dialogVisible = ref(false)
//收集新增岗位数
let RoleParams = reactive<RoleData>({
  id: 0,
  roleName: '',
})
let formRef = ref()
let drawer = ref(false)
let menuArr = ref<MenuList>([])
//准备数组用于存储勾选的节点的ID(4级，其他自动勾选上)
let selectArr = ref<number[]>([])
//获取tree的树形控件
let tree = ref()

//组件挂载完毕
onMounted(() => {
  gethasRole()
})
const gethasRole = async (pager = 1) => {
  pageNo.value = pager
  let result: RoleResponseData = await reqAllRoleList(
    pageNo.value,
    pageSize.value,
    keyword.value,
  )
  if (result.code == 200) {
    total.value = result.data.total
    allRole.value = result.data.records
  }
}
const search = () => {
  gethasRole()
  keyword.value = ''
}
const reset = () => {
  settingStore.refsh = !settingStore.refsh
}
const addRole = () => {
  //清空数据
  Object.assign(RoleParams, {
    roleName: '',
    id: 0,
  })

  //清空表单效验的结果
  nextTick(() => {
    formRef.value.clearValidate('roleName')
  })

  //显示对话框
  dialogVisible.value = true
}
const updateRole = (row: RoleData) => {
  //清空数据
  Object.assign(RoleParams, {
    roleName: '',
    roleId: 0,
  })
  //打开对话框
  dialogVisible.value = true
  //获取数据
  Object.assign(RoleParams, row)
}

//自定义校验规则回调 一定要用在前面
const validatorRoleName = (rule: any, value: any, callback: any) => {
  if (value.trim().length < 2) {
    callback(new Error('职位名称至少两位'))
  } else {
    callback()
  }
}

//职位相关的校验规则
const rules = {
  roleName: [
    {
      required: true,
      trigger: 'blur',
      validator: validatorRoleName,
    },
  ],
}

//确定按钮
const save = async () => {
  //保存前先保证校验合格
  await formRef.value.validate()
  //添加职位
  let result = await reqAddOrUpdateRole(RoleParams)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: RoleParams.id ? '修改成功' : '添加成功',
    })
    //在此刷新数据
    gethasRole(RoleParams.id ? pageNo.value : 1)
  }
  dialogVisible.value = false
}

//树形控件的测试数据
const defaultProps = {
  children: 'children',
  label: 'name',
}
//分配权限按钮的回调
const setPermisstion = async (row: RoleData) => {
  drawer.value = true
  //获取当前职位的权限
  Object.assign(RoleParams, row)
  let result: MenuResponseData = await reqAllMenuList(RoleParams.id)
  if (result.code == 200) {
    menuArr.value = result.data
    selectArr.value = filterSelectArr(menuArr.value, [])
    console.log(selectArr.value)
  }
}
const filterSelectArr = (allData: any, initArr: any) => {
  allData.forEach((item: any) => {
    if (item.select && item.level == 4) {
      initArr.push(item.id)
    }
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr)
    }
  })
  return initArr
}
//抽屉确定按钮的回调
const handler = async (row: any) => {
  //
  const roleId = RoleParams.id as number
  //获取选中的节点
  let arr = tree.value.getCheckedKeys()
  //获取半选中的节点
  let arr1 = tree.value.getHalfCheckedKeys()
  let permissionId = arr.concat(arr1)
  //下发权限
  let result = await reqSetPermisstion(roleId, permissionId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '权限分配成功',
    })
    drawer.value = false
    //页面刷新 重新路由
    window.location.reload()
  }
}

//删除已有的职位
const removeRole = async (id: number) => {
  let result: any = await reqRemoveRole(id)
  if (result.code == 200) {
    //提示信息
    ElMessage({ type: 'success', message: '删除成功' })
    gethasRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}
</script>
<style>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
}
</style>
