<template>
  <el-col :span="24">
    <el-card class="lineBackground">
      <p v-show="!P_out">line{{ line }}</p>
      <el-row>
        <el-col :span="12">
          <!-- 出口左侧-->
          <el-card v-show="P_out" class="linebackground container">
            <el-tag  :ref="(vc: any) => (elements[item.sq] = vc)" effect="dark" size="large" round
              v-for="(item, index) in P_out" :key="index" type="primary" :class="{ firstpointStyle: item.sq==pointFirst,lastpointStyle: item.sq==pointLast}">
              {{ item.sq }}
            </el-tag>
            <el-tag effect="dark" v-for="(item, index) in P_out" :key="index" type="success">
              {{ item.dateTime }}
            </el-tag>
          </el-card>
        </el-col>
        <el-col :span="12">
          <!-- 入口右侧-->
          <el-card v-show="P_in" class="linebackground container">
            <el-tag    :ref="(vc: any) => (elements[item.sq] = vc)" effect="dark" size="large" round
              v-for="(item, index) in P_in" :key="index" type="primary" :class="{ firstpointStyle: item.sq==pointFirst,lastpointStyle: item.sq==pointLast}">
              {{ item.sq }}
            </el-tag>
            <el-tag  effect="dark" v-for="(item, index) in P_in" :key="index" type="success">
              {{ item.dateTime }}
            </el-tag>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </el-col>
</template>

<script setup lang="ts">

import { defineProps, ref, onMounted, onBeforeUnmount, nextTick,watch } from 'vue'
// 定义 ref 引用
let elements = ref<any>({})

//父传子参数
const props = defineProps({
  line: {
    type: String as () => String,
    required: false,
  },
  P_out: {
    type: Array as () => string[],
    required: false,
  },
  P_in: {
    type: Array as () => number[],
    required: false,
  },
  pointFirst: {
    type: String as () => String,
    required: false,
  },
  pointLast: {
    type: String as () => String,
    required: false,
  },
})

// 定义事件
const emit = defineEmits<{
  (e: 'positions', positions:any ): void
 
}>()


// 监听窗口 resize 事件
onMounted(() => { 
  //当<el_tag>产生时应该发生定位数据给父组件，为了简化，由父组件调用getPositions()方法

  // 监听窗口大小变化
  window.addEventListener('resize', getPositions)
})

// 移除事件监听器
onBeforeUnmount(() => {
  window.removeEventListener('resize', getPositions)
})

// 获取子组件中所有绑定 ref 的元素的位置信息
const getPositions = async () => {
  // 定义一个对象来存储位置信息
  const positions: Record<
    string,
    { top: number; left: number; width: number; height: number }
  > = {}
  
  // 使用 nextTick 确保 DOM 更新
  await nextTick() // 确保 DOM 更新完成后再获取元素位置

  // 使用 Object.entries()
  Object.entries(elements.value).forEach(([key, value]) => {
    //$el: 获取组件的根元素
       if (value) {      
      const rect = value.$el.getBoundingClientRect()
      //模板字符串:`My name is ${name} and I am ${age} years old.`
      positions[key] = {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      }
    }
  }); 

  // 将位置信息通过事件传递给父组件
  emit('positions',positions)

}
// 确保方法被暴露
defineExpose({
  getPositions,
})
</script>

<style scoped lang="scss">
.linebackground {
  background-color: aliceblue;
}

.container {
  display: flex;
  flex-direction: column; /* 按列排列 */
  gap: 8px; /* 标签之间的间距 */
}
.lineBackground{
  background-color: rgb(239, 243, 248);
}
.firstpointStyle{
  background-color: green;
}
.lastpointStyle{
  background-color: rgb(221, 45, 53);
}
</style>
