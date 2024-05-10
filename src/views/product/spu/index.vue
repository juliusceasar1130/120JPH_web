<template>
  <div>
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0px">
      <div v-show="scene == 0">
        <el-button type="primary" icon="Plus" :disabled="!categoryStore.c3Id" @click="addSpu">
          添加SPU
        </el-button>
        <el-table style="margin: 10px 0px" border :data="records">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="SPU名称" align="center" prop="spuName"></el-table-column>
          <el-table-column label="SPU描述" show-overflow-tooltip align="center" prop="description"></el-table-column>
          <el-table-column label="操作" align="center" width="250px">
            <template #="{ row, $index }">
              <el-button type="primary" icon="Plus" size="small" title="添加SkU" @click="addSku(row)"></el-button>
              <el-button type="primary" icon="Edit" size="small" title="修改SkU" @click="() => updateSpu(row)"></el-button>
              <el-button type="primary" icon="View" size="small" title="查看SkU" @click="findSku(row)"></el-button>
              <el-popconfirm title="确定删除吗?" width="200PX" @confirm="deleteSpu(row)">
                <template #reference>
                  <el-button type="primary" icon="Delete" size="small" title="删除SkU"></el-button>
                </template>
              </el-popconfirm>

            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
          :background="true" layout=" prev, pager, next, jumper,->,sizes,total" :total="total" @size-change="changeSize"
          @current-change="getHasSpu" />
      </div>
      <div>
        <SpuForm ref="SpuFormX" v-show="scene == 1" @changeScene="changeScene"></SpuForm>
      </div>
      <div>
        <SkuForm ref="SkuFormX" v-show="scene == 2" @changeScene="changeScene"></SkuForm>
      </div>
      <!--对话框-->
      <el-dialog v-model="show" title="SKU列表">
        <el-table border :data="skuArr">
          <el-table-column label="名字" align="center" prop="skuName">
          </el-table-column>
          <el-table-column label="价格" align="center" prop="price">
          </el-table-column>
          <el-table-column label="重量" align="center" prop="weight">
          </el-table-column>
          <el-table-column label="图片" align="center">
            <template #="{ row, $index }">
              <img :src="row.skuDefaultImg" style="width:100px;height: 100px;">
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { reqHasSpu, reqSkuList, reqRemoveSpu } from '@/api/product/spu'
import useCategoryStore from '@/store/modules/category'
import { watch, onBeforeUnmount } from 'vue'
import { ref } from 'vue'
import type { HasSpuResponseData, Records, SkuData, SkuInfoData } from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'
//引入相应子组件
import SkuForm from './skuForm.vue'
import SpuForm from './spuForm.vue'

import type { SpuData } from '@/api/product/spu/type'
//import { reqRemoveS } from '@/api/product/attr'
let categoryStore = useCategoryStore()
let records = ref<Records>([])
let total = ref(0)
let scene = ref(0)
let pageNo = ref(1)
let pageSize = ref(3)
let skuArr = ref<SkuData[]>([])
//获取子组件实例
let SpuFormX = ref<any>()
let SkuFormX = ref<any>()
let show = ref(false)
watch(
  () => categoryStore.c3Id,
  async () => {
    if (!categoryStore.c3Id) return
    getHasSpu()
  },
)
const getHasSpu = async (pager = 1) => {
  pageNo.value = pager
  let result: HasSpuResponseData = await reqHasSpu(
    pageNo.value,
    pageSize.value,
    categoryStore.c3Id,
  )
  if (result.code == '200') {
    records.value = result.data.records
    total.value = result.data.total
  } else {
    ElMessage({
      type: 'error',
      message: '数据获取失败',
    })
  }
}
//分页器下啦菜单发生变化 注入的参数不使用，使用pager=1默认值（函数套函数）
const changeSize = () => {
  getHasSpu()
}

const addSpu = () => {
  //切换为场景1
  scene.value = 1
  //点击调用子组件的方法初始化数值
  SpuFormX.value.initAddSpu(categoryStore.c3Id)
}
//子组件SpuForm自定义的回调，让子组件通知父组件切换场景为0
const changeScene = async (obj: any) => {
  //子组件点击取消，父组件展示已有
  scene.value = obj.flag
  if (obj.params == 'add') {
    //回到第一页
    getHasSpu()
  } else {
    //回到当前页
    console.log('修改')
    let result: HasSpuResponseData = await reqHasSpu(
      pageNo.value,
      pageSize.value,
      categoryStore.c3Id,
    )
    if (result.code == '200') {
      records.value = result.data.records
      total.value = result.data.total
    } else {
      ElMessage({
        type: 'error',
        message: '数据获取失败',
      })
    }
  }
}
//切换至sPuform
const updateSpu = (row: SpuData) => {
  //父组件调用子组件的方法，并传入父组件中的参数
  SpuFormX.value.initHasSpuData(row)
  scene.value = 1
}
//切换值sku添加
const addSku = (row: SpuData) => {

  //点击切换
  scene.value = 2
  //调用子组件, 初始化SKU的数据
  SkuFormX.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}
//查看SKU列表
const findSku = async (row: SpuData) => {
  //查看sku列表数据
  let result: SkuInfoData = await reqSkuList((row.id) as number)
  if (result.code == 200) {
    skuArr.value = result.data
    //对话框显示出来
    show.value = true;
    console.log(skuArr.value)
  }
}
//删除Spu
const deleteSpu = async (row) => {
  let result = await reqRemoveSpu(row.id)
  if (result.code == '200') {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    //重新获取
    if (records.value.length > 1) {
      let result: HasSpuResponseData = await reqHasSpu(
        pageNo.value,
        pageSize.value,
        categoryStore.c3Id,
      )
      if (result.code == '200') {
        records.value = result.data.records
        total.value = result.data.total
      } else {
        ElMessage({
          type: 'error',
          message: '数据获取失败',
        })
      }
    } else {
      let result: HasSpuResponseData = await reqHasSpu(
        pageNo.value - 1,
        pageSize.value,
        categoryStore.c3Id,
      )
      if (result.code == '200') {
        records.value = result.data.records
        total.value = result.data.total
      } else {
        ElMessage({
          type: 'error',
          message: '数据获取失败',
        })
      }
    }

  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
//路由组件销毁前清空数据
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>
<style></style>
