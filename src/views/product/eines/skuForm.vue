<template>
  <el-form label-width="100px">
    <el-form-item label="SKU名称">
      <el-input placeholder="Sku名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格（元）">
      <el-input placeholder="价格（元）" type="number" v-model="skuParams.price"></el-input>
    </el-form-item>
    <el-form-item label="重量(克)">
      <el-input placeholder="重量(克)" v-model="skuParams.weight"></el-input>
    </el-form-item>
    <el-form-item label="描述">
      <el-input type="textarea" placeholder="sku描述" v-model="skuParams.skuDesc"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form inline label-width="100px">
        <el-form-item v-for="(item, index) in attrArr" :key="item.id" :label="item.attrName">
          <el-select v-model="item.attrIdAndValueId" style="width:150px;">
            <el-option :value="`${item.id}:${attrValue.id}`" v-for="(attrValue, index) in item.attrValueList"
              :key="attrValue.id" :label="attrValue.valueName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form inline>
        <el-form-item v-for="(item, index) in saleArr" :key="item.id" :label="item.saleAttrName">
          <el-select v-model="item.saleIdAndValueId" style="width:200px;">
            <el-option :value="`${item.id}:${saleAttrValue.id}`"
              v-for="(saleAttrValue, index) in item.spuSaleAttrValueList" :key="saleAttrValue.id"
              :label="saleAttrValue.saleAttrValueName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border :data="imgArr" ref="table">
        <el-table-column type="selection" width="80px" align="center"></el-table-column>
        <el-table-column label="图片" align="center">
          <template #="{ row, $index }">
            <img :src="row.imgUrl" alt="" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="名称" align="center" prop="imgName"></el-table-column>
        <el-table-column label="操作" align="center">
          <template #="{ row, $index }">
            <el-button type="primary" @click="handler(row)">设置默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button type="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import { reqAttr } from '@/api/product/attr'
import { reqSpuImageList } from '@/api/product/spu'
import { reqSpuHasSaleAttr, reqAddSku } from '@/api/product/spu'
import { ref, reactive } from 'vue'
import type { SkuData } from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'
let $emit = defineEmits(['changeScene'])
//平台属性
let attrArr = ref([]);
//销售属性
let saleArr = ref([])
//照片数据
let imgArr = ref([])
//获取Table组价实例
let table = ref()
//收集SKU的参数
let skuParams = reactive<SkuData>({
  //父组件传递
  category3Id: "",
  spuId: "",
  tmId: "",
  //v-model收集
  skuName: "",
  price: "",
  weight: "",
  skuDesc: "",
  skuAttrValueList: [{
    attrId: "",
    valueId: "",
  }],
  skuSaleAttrValueList: [{
    saleAttrId: "",
    saleAttrValueId: "",
  }],
  skuDefaultImg: "",
})


const cancel = () => {
  $emit('changeScene', { flag: 0, params: '' })
}
//当前子组件的方法对外暴露
const initSkuData = async (
  c1Id: number | string,
  c2Id: number | string,
  spu: any,
) => {
  //收集数据
  skuParams.category3Id = spu.category3Id
  skuParams.spuId = spu.id
  skuParams.tmId = spu.tmId

  //引入请求的API
  let result = await reqAttr(c1Id, c2Id, spu.category3Id)
  //平台属性
  attrArr.value = result.data
  let result1 = await reqSpuHasSaleAttr(spu.id)
  //销售属性
  saleArr.value = result1.data
  let result2 = await reqSpuImageList(spu.id)
  imgArr.value = result2.data
}

//选择图片行
const handler = (row: any) => {
  //点击时，先保证全部不勾选
  imgArr.value.forEach((item) => {
    table.value.toggleRowSelection(item, false)
  })
  //再选择当前行
  table.value.toggleRowSelection(row, true)
  skuParams.skuDefaultImg = row.imgUrl
  console.log(skuParams.skuDefaultImg)
}

const save = async () => {
  //整理参数
  //1平台属性
  skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
    if (next.attrIdAndValueId) {
      let [attrId, valueId] = next.attrIdAndValueId.split(':');
      prev.push({ attrId, valueId })
    } return prev;
  }, []);
  //2销售属性
  skuParams.skuSaleAttrValueList = saleArr.value.reduce((prev: any, next: any) => {
    if (next.saleIdAndValueId) {
      let [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':');
      prev.push({ saleAttrId, saleAttrValueId })
    } return prev;
  }, []);
  //3 添加请求
  let result = await reqAddSku(skuParams)
  console.log(result)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '添加SKu成功'
    })
    //返回父子件
    $emit('changeScene', { flag: 0, params: '' })
  } else {
    ElMessage({
      type: 'error',
      message: '添加失败'
    })
  }
}
//对外暴露
defineExpose({ initSkuData })
</script>
<style></style>
