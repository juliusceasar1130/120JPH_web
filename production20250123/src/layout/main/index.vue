<template>
  <div>
    <!--路由组件出口的位置-->
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <!--渲染一级路由的子路由-->
        <component :is="Component" v-if="flag"/>
      </transition>
    </router-view>
  </div>
</template>
<script setup lang="ts">
import { watch,ref,nextTick } from 'vue';
import useLayOutSettingStore from '@/store/modules/setting'
let LayOutSettingStore = useLayOutSettingStore()
//控制组件是否销毁创建
let flag=ref(true);

//监听仓库数据是否发生变化
watch(()=>LayOutSettingStore.refsh,()=>{
  //点击刷新销毁
  flag.value=false;
  nextTick(()=>{
    flag.value=true
  })
})
</script>

<script lang="ts">
export default {
  name: 'Main',
}
</script>

<style scoped>
.fade-enter-from {
  opacity: 0;
}
.fade-enter-active {
  transition: all 0.5s;
}
.fade-enter-to {
  opacity: 1;
}
</style>
