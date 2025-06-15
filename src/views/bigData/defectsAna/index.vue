<template>
<el-row style="width: 100%">
      <div style="margin-top: -10px;">
        <el-radio-group v-model="lineSelect" size="large" @change="changeLine">
          <el-radio v-for="(line, index) in transformedLines" :key="index" :label="index" size="large" border>
            {{ line.label }}
          </el-radio>
        </el-radio-group>
      </div>
</el-row>
<line1 v-if="show1" style="margin-top: 10px;"></line1>
<line2 v-if="show2" style="margin-top: 10px;"></line2>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import line1 from './indexLine1.vue'
import line2 from './indexLine2.vue'
let lineSelect = ref(0)
let show1 = ref(0)
let show2 = ref(0)
let show3 = ref(0)
const Lines = [
  [0, 'Line 1'],
  [1, 'Line 2'],
  [2, 'Line 3'],
  // ... 更多选项
]
// 转换 Lines 数组为 el-radio 所需要的数据结构
const transformedLines = computed(() => {
  return Lines.map((line) => ({ value: line[0], label: line[1] }))  
})
const changeLine=(line:any)=>{
  if(line==0){
    show1.value=1
    show2.value=0
    show3.value=0
  }else if(line==1){
    show1.value=0
    show2.value=1
    show3.value=0
  }else{
    show1.value=0
    show2.value=0
    show3.value=1
  }
  

}
</script>
<style scoped>
</style>
