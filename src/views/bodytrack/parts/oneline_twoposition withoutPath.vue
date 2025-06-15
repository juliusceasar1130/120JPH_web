<template>
  <el-col :span="24">
    <el-card  ><p v-show="!P_out">line{{line}}</p>
      <el-row>
        <el-col :span="12"  >
          <!-- 出口左侧-->
          <el-card v-show="P_out" class='linebackground container'>
            <el-tag effect="dark" size="large" round v-for="(item, index) in P_out" :key="index" type="primary">
              {{ item.sq }}
            </el-tag>
            <el-tag effect="dark" v-for="(item, index) in P_out" :key="index" type="success">
              {{ item.dateTime }}
            </el-tag>
          </el-card>
        </el-col>
        <el-col :span="12">
          <!-- 入口右侧-->
          <el-card v-show="P_in" class='linebackground container'>
            <el-tag effect="dark" size="large" round v-for="(item, index) in P_in" :key="index" type="primary">
              {{ item.sq }}
            </el-tag>
            <el-tag effect="dark" v-for="(item, index) in P_in" :key="index" type="success">
              {{ item.dateTime }}
            </el-tag>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </el-col>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
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
})
</script>

<style scoped lang="scss">
.linebackground{
background-color:aliceblue
}
.container {
    display: flex;
    flex-direction: column; /* 设置为列方向布局 */
    /* 根据需要选择以下对齐方式之一 */
    align-items: stretch; /* 上对齐（默认） */
    /* align-items: flex-end; /* 下对齐 */
    /* align-items: center; /* 居中对齐 */
    /* align-items: baseline; /* 基线对齐，基于元素的基线进行对齐 */
    /* align-items:stretch; /* 拉伸对齐，元素会被拉伸以适应容器的高度（默认，但仅在flex-direction为column时有用，因为默认是row） */
    
    /* 如果容器的高度不固定，但您仍然想要垂直居中，可以结合使用justify-content和height属性 */
    /* justify-content: center; 与align-items: center; 一起使用可以实现完全居中 */
    /* height: 100vh; 或其他您想要的高度值 */
}
      
</style>
 