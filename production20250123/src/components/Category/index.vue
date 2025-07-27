<template>
  <div>
    <el-card>
      <el-form :inline="true">
        <el-form-item label="一级分类">
          <!---->
          <el-select :disabled='scene==0?false:true' size="default" style="width: 240px" v-model="categoryStore.c1Id" @change="handler">
            <el-option
              v-for="(item, index) in categoryStore.c1Arr"
              :index="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select :disabled='scene==0?false:true' style="width: 240px" v-model="categoryStore.c2Id" @change="handler1">
            <el-option
              v-for="(item, index) in categoryStore.c2Arr"
              :index="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类" >
          <el-select :disabled='scene==0?false:true' style="width: 240px" v-model="categoryStore.c3Id">
            <el-option
              v-for="(item, index) in categoryStore.c3Arr"
              :index="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script setup lang="ts">
//引入分类方法

import { onMounted, ref } from 'vue'
import useCategoryStore from '@/store/modules/category'
defineProps(['scene'])
let categoryStore = useCategoryStore()
onMounted(() => {
  categoryStore.getC1()
})
//此方法即为一级下拉的数值改变触发方法，保证ID有了
const handler=()=>{
//通知二级分类方法
//需要清空2级三级数据
categoryStore.c2Id=''
categoryStore.c3Id=''
categoryStore.c2Arr=[],
categoryStore.c3Arr=[],
categoryStore.getC2()

}
////此方法即为二级下拉的数值改变触发方法，保证ID有了
const handler1=()=>{
//通知二级分类方法
categoryStore.c3Id=''
categoryStore.c3Arr=[]
categoryStore.getC3()
}

</script>
<style scoped></style>
