<template>
  <svg :style="{ width, height }">
    // //fill填充颜色
    <use :xlink:href="prefix + name" :fill="color"></use>
  </svg>
</template>

<script setup lang="ts">
//父组件传递的参数
defineProps({
  //xlink:href的前缀
  prefix: {
    type: String,
    default: '#icon-',
  },
  //名字
  name: String,
  color: {
    type: String,
    default: '',
  },
  width: {
    type: String,
    default: '16px',
  },
  height: {
    type: String,
    default: '16px',
  }
})
</script>

<style scoped></style>
