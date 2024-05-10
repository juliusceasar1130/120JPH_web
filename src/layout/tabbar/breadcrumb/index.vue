<template>
  <!--顶部左侧图标-->

  <el-icon style="margin-right: 10px" @click="changeIcon">
    <component :is="LayOutSettingStore.fold ? 'Fold' : 'Expand'"></component>
  </el-icon>
  <!--左侧面包屑-->
  <el-breadcrumb separator-icon="ArrowRight">
    <!--由路由动态生成-->
    <el-breadcrumb-item
      v-for="(item, index) in $router.matched"
      :key="index"
      v-show="item.meta.title"
      :to="item.path"
    >
      <!--图标-->
      <el-icon style="margin: 0px 3px">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <!--展示匹配的路由标题-->
      <span>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script setup lang="ts">
import useLayOutSettingStore from '@/store/modules/setting'
import { useRoute } from 'vue-router'
let $router = useRoute()
//获取Layout相关的配置仓库
let LayOutSettingStore = useLayOutSettingStore()
//定义响应式数据，控制响应式图标切换
// let fold= ref(false)//控制菜单折叠还是打开
//点击图标的方法
const changeIcon = () => {
  LayOutSettingStore.fold = !LayOutSettingStore.fold
}
</script>
<script lang="ts">
//给组件取名字
export default {
  name: 'Breadcrumb',
}
</script>
<style scoped></style>
