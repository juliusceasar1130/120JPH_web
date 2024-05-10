<template>
  <div>
    <template v-for="(item, index) in menulist" :key="item.path">
      <!--没有子路由-->
      <template v-if="!item.children">
        <el-menu-item :index="item.path" v-if="!item.meta.hidden" @click="goRoute">
          <!--插槽外面，折叠以后图标不消失-->
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          <template #title>
            <span>{{ item.meta.title }}</span>
          </template>
        </el-menu-item>
      </template>

      <!--有子路由但有1个-->
      <template v-if="item.children && item.children.length == 1">
        <el-menu-item :index="item.children[0].path" v-if="!item.children[0].meta.hidden" @click="goRoute">
          <!--插槽外面，折叠以后图标不消失-->
          <el-icon>
            <component :is="item.children[0].meta.icon"></component>
          </el-icon>
          <template #title>
            <span>{{ item.children[0].meta.title }}</span>
          </template>
        </el-menu-item>
      </template>

      <!--有子路由且个数大于1个-->
      <el-sub-menu 
        :index="item.path"
        v-if="item.children && item.children.length > 1"
      >
        <template #title>
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          <span>{{ item.meta.title }}</span>
        </template>
        <!--递归调用组件-->
        <Menu :menulist="item.children"></Menu>
      </el-sub-menu>
    </template>
  </div>
</template>
<script setup lang="ts">
//获取父组件传递过来的全部数据(路由)
defineProps(['menulist'])
//获取路由对象
import { useRouter } from 'vue-router'
let $router = useRouter()
//点击菜单的回调
const goRoute = (vc) => {
  console.log(vc.index)
  $router.push(vc.index)
}
</script>


<script lang="ts">
//给组件起名字(递归组件一定要有名字)
export default {
  name: 'Menu',
}
</script>

<style scoped></style>
