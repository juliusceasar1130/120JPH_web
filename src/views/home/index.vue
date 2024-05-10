<template>
    <div>
      <h1>我是一级路由展示登录成功以后得数据home</h1>
    </div>
  </template>
  
  <script setup lang="ts">
  //引入组合式API函数生命周期函数
  import { onMounted } from 'vue';
  import useUserStore from '@/store/modules/user'
  let userStore = useUserStore();
  onMounted(()=>{
    //首页挂载完毕，发送获取用户信息
   
    userStore.userInfo();
  })
</script>
  
  <style scoped lang="scss"></style>