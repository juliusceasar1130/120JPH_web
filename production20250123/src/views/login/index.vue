<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-left">
        <div class="brand-info">
          <div class="logo-container">
            <i class="el-icon-monitor"></i>
          </div>
          <h1 class="system-name">智能车间管理系统</h1>
          <div class="slogan">
            <p>数字化转型 · 智能制造 · 高效生产</p>
          </div>
        </div>
      </div>
      <div class="login-right">
        <div class="login-form-container">
          <h2 class="welcome-title">欢迎登录</h2>
          <p class="welcome-subtitle">请使用您的账号密码登录系统</p>
          
          <el-form class="login-form" :model="loginForm" :rules="rules" ref="loginForms">
            <el-form-item prop="username">
              <el-input 
                :prefix-icon="User" 
                v-model="loginForm.username" 
                placeholder="请输入用户名"
                size="large">
              </el-input>
            </el-form-item>
            
            <el-form-item prop="password">
              <el-input 
                type="password" 
                :prefix-icon="Lock" 
                show-password 
                v-model="loginForm.password" 
                placeholder="请输入密码"
                size="large">
              </el-input>
            </el-form-item>
            
            <div class="login-options">
              <el-checkbox v-model="rememberMe">记住我</el-checkbox>
              <a href="javascript:void(0)" class="forgot-password">忘记密码?</a>
            </div>
            
            <el-form-item>
              <el-button 
                :loading="loading" 
                class="login-btn" 
                type="primary" 
                size="large" 
                @click="login">
                登录系统
              </el-button>
            </el-form-item>
          </el-form>
          
          <div class="login-footer">
            <p>智能车间管理系统 &copy; 2025</p>
          </div>
        </div>
      </div>
    </div>
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
//记住我选项
let rememberMe = ref(false)
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
      message: '欢迎回到智能车间管理系统',
      title: `您好，${getTime()}好`,
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
.login-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat center center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
}

.login-box {
  position: relative;
  z-index: 10;
  display: flex;
  width: 80%;
  max-width: 1100px;
  min-height: 600px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  
  @media screen and (max-width: 992px) {
    width: 90%;
    flex-direction: column;
    min-height: auto;
  }
}

.login-left {
  width: 45%;
  background: linear-gradient(135deg, #1976d2, #0d47a1);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  
  @media screen and (max-width: 992px) {
    width: 100%;
    padding: 40px 20px;
  }
  
  @media screen and (max-width: 768px) {
    padding: 30px 20px;
  }
}

.brand-info {
  text-align: center;
  color: white;
  
  .logo-container {
    margin-bottom: 20px;
    
    i {
      font-size: 60px;
      
      @media screen and (max-width: 992px) {
        font-size: 50px;
      }
    }
  }
  
  .system-name {
    font-size: 32px;
    font-weight: 600;
    margin-bottom: 20px;
    
    @media screen and (max-width: 992px) {
      font-size: 28px;
    }
  }
  
  .slogan {
    p {
      font-size: 16px;
      opacity: 0.9;
      line-height: 1.6;
      
      @media screen and (max-width: 992px) {
        font-size: 14px;
      }
    }
  }
}

.login-right {
  width: 55%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  
  @media screen and (max-width: 992px) {
    width: 100%;
    padding: 40px 20px;
  }
}

.login-form-container {
  width: 100%;
  max-width: 400px;
  
  .welcome-title {
    font-size: 28px;
    color: #333;
    margin-bottom: 10px;
    font-weight: 600;
    text-align: center;
  }
  
  .welcome-subtitle {
    font-size: 16px;
    color: #666;
    margin-bottom: 30px;
    text-align: center;
  }
}

.login-form {
  .el-form-item {
    margin-bottom: 25px;
  }
  
  .login-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    
    .forgot-password {
      color: #1976d2;
      text-decoration: none;
      font-size: 14px;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
  
  .login-btn {
    width: 100%;
    height: 50px;
    font-size: 16px;
    background: linear-gradient(to right, #1976d2, #0d47a1);
    border: none;
    
    &:hover {
      background: linear-gradient(to right, #1565c0, #0a3d8f);
    }
  }
}

.login-footer {
  margin-top: 40px;
  text-align: center;
  
  p {
    color: #999;
    font-size: 14px;
  }
}
</style>
