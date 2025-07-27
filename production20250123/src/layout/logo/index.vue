<template>
  <div class="logo" v-if="setting.logoHidden">
    <img :src="setting.logo" alt="" />
    <p>{{ setting.title }}</p>
  </div>
</template>
<script setup lang="ts">
//引入logo配置文件
import setting from '@/setting'
</script>

<script lang="ts">
//给组件取名字
export default {
  name: 'Logo',
}
</script>
<style scoped lang="scss">
.logo {
  width: $base-menu-logo-width;
  height: $base-menu-logo-height;
  color: rgb(255, 255, 255);
  display: flex;
  align-items: center;
  padding: 10px;
  img {
    width: 30px;
    height: 30px;
  }
  p {
    font-size: $base-logo-title-fontSize;
    margin-left: 10px;
  }
}
</style>
