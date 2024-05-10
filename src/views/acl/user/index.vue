<template>
  <el-card>
    <el-form :inline="true" class="form">
      <el-form-item label="用户名：">
        <el-input placeholder="请输入" v-model="keyword" ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="!keyword" @click="search">搜索</el-button>
        <el-button type="primary" @click=resetSeach>重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0px">
    <el-button type="primary" size="default" @click="addUser">添加用户</el-button>
    <el-button type="primary" size="default" :disabled="!selectIdArr.length" @click="deleteSelectUser">批量删除</el-button>
    <!-- table展示用户信息 -->
    <el-table @selection-change="selectChange" border style="margin: 10px 0px" :data="userArr">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="#" align="center"></el-table-column>
      <el-table-column label="id" align="center" prop="id"></el-table-column>
      <el-table-column label="用户名字" align="center" prop="name"></el-table-column>
      <el-table-column label="用户名称" align="center" prop="username"></el-table-column>
      <el-table-column label="用户角色" align="center" prop="roleName"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime"></el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime"></el-table-column>
      <el-table-column label="操作" width="280px" align="center">
        <template #="{ row, $index }">
          <el-button type="primary"icon="User" size="small" @click="setRole(row)">
            分配角色
          </el-button>       
          <el-button type="primary" icon="Edit" size="small" @click="updateUser(row)">
            编辑
          </el-button>
          <el-popconfirm @confirm="deleteUser(row.id)" width="260px" confirm-button-text="OK"
           cancel-button-text="No" :icon="InfoFilled" icon-color="#626AEF" :title="`确定要删除 ${row.username} 吗`">
            <template #reference>
              <el-button type="primary" icon="Delete" size="small"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器组件 -->
    <el-pagination
      style="margin: 10px 0px"
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[5, 7, 9, 11]"
      :background="true"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @current-change="getHasUser(pageNo)"
      @size-change="getHasUser(1)"
    />
  </el-card>

  <!--抽屉效果完成添加和更新账户-->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>{{ userParams.id ? '修改用户' : '新增用户' }}</h4>
    </template>
    <template #default>
      <el-form :model="userParams" :rules="rules" ref="formRef">
        <el-form-item label="用户姓名" prop="username">
          <el-input
            v-model="userParams.username"
            placeholder="请输入用户姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input
            v-model="userParams.name"
            placeholder="请输入用户昵称"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
          <el-input
            v-model="userParams.password"
            placeholder="请输入用户密码"
          ></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-drawer>

  <!--抽屉：用于账号职位分配-->
  <el-drawer v-model="drawer1">
    <template #header>
      <h4>分配角色</h4>
    </template>
    <template #default>
      <el-form :model="userParams" :rules="rules" ref="formRef">
        <el-form-item label="用户姓名">
          <el-input v-model="userParams.username" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
          >
            全选
          </el-checkbox>
          <!--userRole是收集的数据-->
          <el-checkbox-group
            v-model="userRole"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox
              v-for="(role, index) in allRoles"
              :key="index"
              :label="role"
              :value="role"
            >
              {{ role.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer1 = false">取消</el-button>
        <el-button type="primary" @click="confirmSetRoles">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqUserInfo,
  reqAddOrUpdateUser,
  reqAllRoleById,
  reqSetUserRole,
  reqRemoveUser,
  reqRemoveBatchUser,
} from '@/api/acl/user'
import {
  User,
  AllRole,
  AllRoleResponseData,
  SetRoleData,
} from '@/api/acl/user/type'
import { ElMessage } from 'element-plus'
import useLayOutSettingStore from '@/store/modules/setting'

let settingStore=useLayOutSettingStore()

let pageNo = ref(1)
let pageSize = ref(10)
//let userArr = ref<User[]>([])
let total = ref(0)
let userArr = ref([])
let drawer = ref(false)
let drawer1 = ref(false)
//收集用户的数据
let userParams = reactive({
  id: 0,
  username: '',
  name: '',
  password: '',
})
//抽提form
let formRef = ref()
onMounted(() => {
  getHasUser()
})

//收集复选框是否全选
let checkAll = ref(false)
//控制复选框不确定样子
let isIndeterminate = ref(true)
let allRoles = ref<AllRole>([])
let userRole = ref<AllRole>([])
let selectIdArr = ref([])
//收集响应式数据，搜索用户关键字
let keyword=ref<string>('')

const getHasUser = async (pager = 1) => {
  pageNo.value = pager
  let result = await reqUserInfo(pageNo.value, pageSize.value,keyword.value)
  if (result.code == 200) {
    total.value = result.data.total
    userArr.value = result.data.records
  }
}
const addUser = () => {
  //清空数据
  Object.assign(userParams, {
    id: '',
    username: '',
    name: '',
    password: '',
  })
  drawer.value = true
  //清除上次的错误提示信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('password')
  })
}
//row 已有的用户信息
const updateUser = (row: User) => {
  drawer.value = true
  //传入信息
  Object.assign(userParams, row)
  //清除上次的错误提示信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    //formRef.value.clearValidate('password')
  })
}

const cancel = () => {
  drawer.value = false
}
const save = async () => {
  //保存前先保证校验合格
  await formRef.value.validate()
  //可能是更新或者新增
  let result = await reqAddOrUpdateUser(userParams)
  //console.log(result)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '添加/修改成功',
    })
    drawer.value = false
    //更新清单,修改留在当前页，添加切换为第一页(和reload矛盾了，)
    //getHasUser(userParams.id ? pageNo.value : 1)
    //浏览器自动刷新一次:修改本人账号后，全局路由重新回到登录页
    window.location.reload()
  } else {
    ElMessage({
      type: 'error',
      message: '添加失败',
    })
  }
}
//校验用户的回调函数
//rule:回调规则
//value:内容
//callback:方法(放行)
const validatorUsername = (rule: any, value: any, callback: any) => {
  //用户的名字只是5位
  if (value.trim().length >= 5) {
    callback()
  } else {
    callback(new Error('长度至少五位'))
  }
}
const validatorpassword = (rule: any, value: any, callback: any) => {
  //用户的名字只是5位
  if (value.trim().length >= 6) {
    callback()
  } else {
    callback(new Error('长度至少6位'))
  }
}
//表单校验
const rules = {
  //用户名字
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  name: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  password: [{ required: true, trigger: 'blur', validator: validatorpassword }],
}

//分配角色按钮的回调
const setRole = async (row) => {
  Object.assign(userParams, row)
  let result: AllRoleResponseData = await reqAllRoleById(userParams.id)
  if (result.code == 200) {
    //存储数据
    allRoles.value = result.data.allRolesList
    userRole.value = result.data.assignRoles
    drawer1.value = true
  }
}
//全选复选框val=true:全选
const handleCheckAllChange = (val: boolean) => {
  //把allRoles赋值给userRole
  userRole.value = val ? allRoles.value : []
  //不确定样式，true为确定 全选、全不选必为确定样式
  isIndeterminate.value = false
}
//底部复选框change事件
const handleCheckedCitiesChange = (value: string) => {
  //value：已经勾选的项目长度
  const checkedCount = value.length
  //勾选和和全部相同
  checkAll.value = checkedCount === allRoles.value.length
  //顶部复选框不确定的样式,但是还是存在BUG,全部为空的情况下，一开始为不确定状态
  isIndeterminate.value = !(checkedCount === allRoles.value.length)
}
const confirmSetRoles = async () => {
  let data: SetRoleData = {
    userId: userParams.id as number,
    roleIdList: userRole.value.map((item) => item.id),
  }
  console.log(data)
  let result: any = await reqSetUserRole(data)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '分配成功',
    })
    drawer1.value = false
    //获取更新信息,留在当前页
    getHasUser(pageNo.value)
  }
}
//删除用户
const deleteUser = async (userId: number) => {
  let result = await reqRemoveUser(userId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}
//复选框批量选择
const selectChange = (data: any) => {
  selectIdArr.value = data
}
//批量删除
const deleteSelectUser=async()=>{
  //整理批量删除参数
  let idList:any=selectIdArr.value.map((item)=>item.id)
  let result = await reqRemoveBatchUser(idList)
  console.log(idList)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '批量删除成功',
    })
    getHasUser()
}
}
const search=()=>{
  getHasUser()
  //清空关键字
  keyword.value=''
}
const resetSeach=()=>{
 settingStore.refsh=!settingStore.refsh
}
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
