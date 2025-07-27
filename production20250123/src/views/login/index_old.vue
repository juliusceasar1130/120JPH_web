<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginForms">
          <h1>Hello</h1>
          <h2>欢迎来到门槛质量管理系统</h2>

          <el-form-item prop="username">
            <el-input :prefix-icon="User" v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" :prefix-icon="Lock" show-password v-model="loginForm.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" class="login_btn" type="primary" size="default" @click="login">
              登录按钮
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { ElNotification } from 'element-plus'
import { getTime } from '@/utils/time'
//引入用户相关的小仓库
import useUserStore from '@/store/modules/user'
let useStore = useUserStore()
//获取el-form组件
let loginForms = ref()
//获取路由器
let $router = useRouter()
let $route = useRoute()
//定义变量控制按钮加载
let loading = ref(false)
//收集账号和密码
let loginForm = reactive({ username: 'admin', password: '123456' })
const login = async () => {
  //返回成功的promise对象 则继续运行
  await loginForms.value.validate()
  //开始加载显示效果
  loading.value = true
  //点击登录
  //通知仓库发登录请求
  //请求成功->首页展示数据
  //请求失败->弹出登录失败信息
  try {
    //也可以使用.then()
    await useStore.userLogin(loginForm)
    console.log('login success')
    //编程式导航跳转数据首页
    //判断登录路由是否包含query参数，如果有向query跳
    let redirect: any = $route.query.redirect
    $router.push({ path: redirect || '/' })
    //登录成功的提示信息
    loading.value = false
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `hi,${getTime()}`,
    })
  } catch (error) {
    loading.value = false
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
  }
}
//自定义校验规则需要的函数
const validatorUserName = (rule: any, value: any, callback: any) => {
  //rule:校验规则对象
  //value:表单元素本文内容
  //函数：如果符合条件callback放行通过，如果不符callback,注入错误信息
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('账号信息至少5位'))
  }
}
const validatorPassword = (rule: any, value: any, callback: any) => {
  //rule:校验规则对象
  //value:表单元素本文内容
  //函数：如果符合条件callback放行通过，如果不符callback,注入错误信息
  if (value.length >= 6) {
    callback()
  } else {
    callback(new Error('密码至少6位'))
  }
}
//定义表单校验规则对象
const rules = {
  //规则对象属性required代表这个字段务必要检验的
  //min:最少6位
  //max：最大10位
  //message：错误的提示信息
  //trigger:触发校验表单的时机 change/blur
  username: [
    // {
    //   required: true,
    //   min: 5,
    //   max: 10,
    //   message: '长度至少6位',
    //   trigger: 'change',
    // }
    { tigger: 'change', validator: validatorUserName },
  ],
  password: [
    {
      tigger: 'change',
      validator: validatorPassword,
    },
  ],
}
</script>

<style scoped lang="scss">
.login_container {
  //需要增加，否则会有空白边
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh; //视口高度
  //align-items: center;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
}

.login_form {
  position: relative;
  width: 80%;
  top: 30vh;
  background: url('@/assets/images/login_form.png') no-repeat;
  background-size: cover;
  padding: 40px;

  h1 {
    color: white;
    font-size: 40px;
  }

  h2 {
    color: white;
    font-size: 20px;
    margin: 20px 0px;
  }

  .login_btn {
    width: 100%;
  }
}
</style>
