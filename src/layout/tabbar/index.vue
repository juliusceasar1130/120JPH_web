<!--
最后修改时间->2025-03-22 14:04
-->
<template>
  <div class="tabbar">
    <div class="tabbar_left">
        <Breadcrumb></Breadcrumb>
    </div>
    <div class="tabbar_right">
        <Setting></Setting>
    </div>
  </div>
</template>
<script setup lang="ts">
import Breadcrumb from './breadcrumb/index.vue'
import Setting from './setting/index.vue'
</script>
<script lang="ts">
//给组件取名字
export default {
  name: 'Tabbar',
}
</script>
<style scoped lang="scss">
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  // 使用带有一丝蓝色调的低饱和度渐变背景
  background-image: linear-gradient(to right, #f5f7fa, #e8f0f7, #e9eef4, #e8f0f7, #f5f7fa);
  border-bottom: 1px solid #dce4ec;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  
  .tabbar_left {
    display: flex;
    align-items: center;
    margin: 20px;
  }
  .tabbar_right {
    display: flex;
    align-items: center;
    margin: 20px;
  }
}
</style>
