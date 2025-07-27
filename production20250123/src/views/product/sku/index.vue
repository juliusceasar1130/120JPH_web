<template>
  <div>
    <el-card>
      <el-table border style="margin: 10px 0px" :data="skuArr">
        <el-table-column label="序号" type="index" width="80px" align="center"></el-table-column>
        <el-table-column label="名称" width="150px" align="center" show-overflow-tooltip prop="skuName"></el-table-column>
        <el-table-column label="描述" align="center" show-overflow-tooltip prop="skuDesc"></el-table-column>
        <el-table-column label="图片" width="150px" align="center" show-overflow-tooltip>
          <template #="{ row, $index }">
            <img :src="row.skuDefaultImg" style="width: 50px; height: 50px" />
          </template>
        </el-table-column>
        <el-table-column label="重量" width="150px" align="center" prop="weight" show-overflow-tooltip></el-table-column>
        <el-table-column label="价格" width="150px" align="center" prop="price" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="400px" align="center" show-overflow-tooltip fixed="right">
          <template #="{ row, $index }">
            <el-button type="primary" size="small" :icon="row.isSale == 1 ? 'Bottom' : 'Top'"
              @click="updateSale(row)"></el-button>
            <el-button type="primary" size="small" icon="Edit" @click="updateSku"></el-button>
            <el-button type="primary" size="small" icon="InfoFilled" @click="findSku(row)"></el-button>
            <el-popconfirm :title='`确定删除${row.skuName}?`' @confirm="removeSku(row.id)">
              <template #reference>
                <el-button type="primary" size="small" icon="Delete"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
        :background="true" layout=" prev, pager, next, jumper,->,sizes,total" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      <!--抽屉结构展示详情-->

      <el-drawer v-model="drawer" :direction="direction">
        <template #header>
          <h4>查看商品详情</h4>
        </template>
        <template #default>
          <el-row style="margin:10px;0px">
            <el-col :span="6">名称</el-col>
            <el-col :span="18">{{ skuInfo.skuName }}</el-col>
          </el-row>
          <el-row style="margin:10px;0px">
            <el-col :span="6">描述</el-col>
            <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
          </el-row>
          <el-row style="margin:10px;0px">
            <el-col :span="6">价格</el-col>
            <el-col :span="18">{{ skuInfo.price }}</el-col>
          </el-row>
          <el-row style="margin:10px;0px">
            <el-col :span="6">平台属性</el-col>
            <el-col :span="18">
              <el-tag style="margin: 0px 5px" v-for="(item, index) in skuInfo.skuAttrValueList" :key="item.attrId">
                {{ item.valueName }}
              </el-tag>
            </el-col>
          </el-row>
          <el-row style="margin:10px;0px">
            <el-col :span="6">销售属性</el-col>
            <el-col :span="18">
              <el-tag style="margin: 0px 5px" v-for="(item, index) in skuInfo.skuSaleAttrValueList" :key="item.id">
                {{ item.saleAttrValueName }}
              </el-tag>
            </el-col>
          </el-row>
          <el-row style="margin:10px;0px">
            <el-col :span="6">商品图片</el-col>
            <el-col :span="18">
              <el-carousel :interval="4000" type="card" height="200px">
                <el-carousel-item v-for="(item, index) in skuInfo.skuImageList" :key="item.id">
                  <img :src="item.imgUrl" style="width: 100%; height: 100%" />
                </el-carousel-item>
              </el-carousel>
            </el-col>
          </el-row>
        </template>
        <template #footer></template>
      </el-drawer>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  reqSkuList,
  reqCancelSku,
  reqSaleSku,
  reqSkuInfo,
  reqRemoveSku
} from '@/api/product/sku'
import type {
  SkuResponseData,
  SkuData,
  SkuInfoData,
} from '@/api/product/sku/type'
import { ElMessage } from 'element-plus'
// 分页器当前页
let pageNo = ref(1)
//每页显示条数
let pageSize = ref(10)
let total = ref(0)
let skuArr = ref<SkuData[]>([])
//控制抽取显示与隐藏
let drawer = ref(false)
let skuInfo = ref<SkuData>({})
//当组件挂载完毕发生获取数据
onMounted(() => {
  getHasSku()
})
const getHasSku = async (page = 1) => {
  pageNo.value = page
  let result: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value)
  if (result.code == 200) {
    total.value = result.data.total
    skuArr.value = result.data.records
  }
}
const handleCurrentChange = (num) => {
  getHasSku(num)
}
const handleSizeChange = (size) => {
  //pageSize.value=size
  //不需要重新传入参数，因为page-size 是双向，只需再次触发
  getHasSku()
}
const updateSale = async (row: SkuData) => {
  if (row.isSale == 1) {
    let result = await reqCancelSku(row.id)
    if (result.code == 200) {
      ElMessage({
        type: 'success',
        message: '成功',
      })
      //重新刷新
      handleCurrentChange(pageNo.value)
    }
  } else {
    let result = await reqSaleSku(row.id)
    if (result.code == 200) {
      ElMessage({
        type: 'success',
        message: '成功',
      })
      //重新刷新
      handleCurrentChange(pageNo.value)
    }
  }
}
const updateSku = () => {
  ElMessage({
    type: 'success',
    message: '程序员开发中',
  })
}
//查看SKU详情
const findSku = async (row: SkuData) => {
  drawer.value = true
  //获取详情
  let result: SkuInfoData = await reqSkuInfo(row.id as number)
  if (result.code == 200) {
    skuInfo.value = result.data
  }
}
const removeSku = async(id:number)=> {
  let result= await reqRemoveSku(id)
  if (result.code == 200) {
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
      //重新刷新
      handleCurrentChange(skuArr.value.length>1?pageNo.value:pageNo.value-1)
    }
}
</script>
<style>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
