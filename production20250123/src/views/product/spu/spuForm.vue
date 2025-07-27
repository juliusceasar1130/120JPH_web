<template>
  <el-form label-width="100px">
    <el-form-item label="spu名称">
      <el-input v-model="SpuParams.spuName" placeholder="请你输入"></el-input>
    </el-form-item>
    <el-form-item label="spu品牌">
      <el-select placeholder="请你选择" v-model="SpuParams.tmId">
        <el-option v-for="(item, index) in AllTradeMark" :key="item.id" :label="item.tmName" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="spu描述">
      <el-input v-model="SpuParams.description" type="textarea" placeholder="请你输入"></el-input>
    </el-form-item>
    <el-form-item label="spu图片">
      <!--v-model:file-list用于展示图片 需要name和URL
        action: 上传图片的接口地址-->
      <el-upload v-model:file-list="imgList" action="/api/admin/product/fileUpload" list-type="picture-card"
        :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :before-upload="handlerUpload">
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="spu销售属性">
      <el-select :placeholder="`还剩${unSelectSaleAttr.length}属性`" style="width: 200px" v-model="saleAttrIdAndValueName">
        <el-option v-for="(item, index) in unSelectSaleAttr" :key="item.id" :label="item.name"
          :value="`${item.id}:${item.name}`"></el-option>
      </el-select>
      <el-button :disabled="!saleAttrIdAndValueName" icon="Plus" type="primary" style="margin: 10px 10px"
        @click="addSaleAttr">
        添加属性
      </el-button>
      <el-table border style="margin: 10px 0px" :data="saleAttr">
        <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
        <el-table-column label="属性名" align="center" width="80px" prop="saleAttrName"></el-table-column>
        <el-table-column label="属性值" align="center">
          <template #="{ row, $index }">
            <el-tag v-for="(item, index) in row.spuSaleAttrValueList" @close="row.spuSaleAttrValueList.splice($index, 1)"
              :key="row.id" class="mx-1" closable>
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input @blur="toLook(row)" :ref="(vc: any) => (inputArr[$index] = vc)" v-model="row.saleAttrValue"
              v-if="row.flag == true" placeholder="请输入属性值" style="width: 100px; margin: 0px 5px" size="small"></el-input>
            <el-button v-else @click="toEdit(row, $index)" size="small" icon="Plus" type="primary"
              style="margin: 0px 10px"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="80px">
          <template #="{ row, $index }">
            <el-button size="small" icon="Delete" type="danger" style="margin: 0px 10px"
              @click="saleAttr.splice($index, 1)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button :disabled="saleAttr.length == 0" type="primary" @click="save">
        保存
      </el-button>
      <el-button type="primary" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import { SpuData } from '@/api/product/spu/type'
import {
  reqAllTradeMark,
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAllSaleAttr,
  reqAddOrUpdateSpu,
} from '@/api/product/spu/index'
import type {
  TradeMark,
  SpuImg,
  SaleAttr,
  HasSaleAttr,
  AllTradeMark,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
  SaleAttrValue,
} from '@/api/product/spu/type'

import { ref, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'

let $emit = defineEmits(['changeScene'])
const cancel = () => {
  $emit('changeScene',{'flag':0,'params':SpuParams.value.id?'update':'add'} )
  console.log(SpuParams.value.id)
}
////存储数据到SPU
let AllTradeMark = ref<TradeMark[]>([])
////商品图片
let imgList = ref<SpuImg[]>([])

////以后得SPU销售属性
let saleAttr = ref<SaleAttr[]>([])
////全部销售属性
let allSaleAttr = ref<HasSaleAttr[]>([])
//存储SPU对象
let SpuParams = ref<SpuData>({
  category3Id: '',
  spuName: '',
  description: '',
  tmId: '', //品牌ID
  spuSaleAttrList: [], //销售属性
  spuImageList: [], //图片
})
//收集还未选择的销售的属性的ID和属性名字
let saleAttrIdAndValueName = ref<string>('')
//控制diag对话框是否显示
let dialogVisible = ref<boolean>(false)
//照片墙回传的对象图片地址
let dialogImageUrl = ref()
//准备一个数值，将来存储对应的组件实例el-input
let inputArr = ref<any>([])
const initHasSpuData = async (spu: SpuData) => {
  //存储已有的spu
  SpuParams.value = spu
  //spu为父组件船进入的数据，不完整
  //获取全部品牌数据
  let result: AllTradeMark = await reqAllTradeMark()
  console.log(result)
  //获取某个品牌的图片集
  let result1: SpuHasImg = await reqSpuImageList(spu.id as number)
  console.log(result1)
  let result2: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number)
  console.log(result2)
  let result3: HasSaleAttrResponseData = await reqAllSaleAttr()
  AllTradeMark.value = result.data
  //申请服务器照片，照片墙需要【{}，{}】
  imgList.value = result1.data.map((item) => {
    return { name: item.imgName, url: item.imgUrl }
  })
  saleAttr.value = result2.data
  allSaleAttr.value = result3.data
}
//照片墙点击预览后的钩子
const handlePictureCardPreview = (picObj: any) => {
  dialogVisible.value = true
  dialogImageUrl.value = picObj.url
}
//照片墙上传前钩子，验证文件类型
const handlerUpload = (picObj: any) => {
  if (
    picObj.type == 'image/png' ||
    picObj.type == 'image/jpeg' ||
    picObj.type == 'image/gif'
  ) {
    return true
  } else {
    ElMessage({
      type: 'error',
      message: '不是图片类型',
    })
    return false
  }
}
//计算出SPU还缺的销售属性
let unSelectSaleAttr = computed(() => {
  let unSelectArr = allSaleAttr.value.filter((item) => {
    //过滤出true
    return saleAttr.value.every((item1) => {
      //每一个都不等于返回true
      return item1.saleAttrName != item.name
    })
  })
  return unSelectArr
})
//添加销售属性的方法
const addSaleAttr = () => {
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
  //新增对象 加入saleAttr数值中
  let newSaleAttr: SaleAttr = {
    baseSaleAttrId: baseSaleAttrId,
    saleAttrName: saleAttrName,
    spuSaleAttrValueList: [],
  }
  //追加到数组中
  saleAttr.value.push(newSaleAttr)
  //清空选中的数值
  saleAttrIdAndValueName.value = ''
}
//属性值按钮的点击事件
const toEdit = (row: SaleAttr, $index) => {
  //console.log(row)
  //传入是对象引用，不是复制
  row.flag = true
  //收集属性值
  //聚焦
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}
//表单数据失去焦点的回调
const toLook = (row: SaleAttr) => {
  const { baseSaleAttrId, saleAttrValue } = row
  let newSaleAttrValue: SaleAttrValue = {
    baseSaleAttrId: baseSaleAttrId,
    saleAttrValueName: saleAttrValue as string,
  }
  //非法判断
  if (saleAttrValue.trim() == '') {
    ElMessage({
      type: 'error',
      message: '属性值不能为空',
    })
    return
  }
  //非法判断
  if (
    row.spuSaleAttrValueList.find(
      (item) => item.saleAttrValueName == saleAttrValue,
    )
  ) {
    ElMessage({
      type: 'error',
      message: '属性值不能重复',
    })
    return
  }

  //追加新的属性值
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  //清空为下次准备
  row.saleAttrValue = ''
  //切换为BUTTON
  row.flag = false
}
//保存回调
const save = async () => {
  //整理收集参数
  //1、照片墙数据(服务存储格式和照片墙格式不一致，需要转换；新增的图片是本地地址，需要上传反馈的地址)
  SpuParams.value.spuImageList = imgList.value.map((item) => {
    if (item.response) {
      //新的图片，需要服务器反馈的地址,而不是本地地址
      return {
        imgName: item.name, //图片名字
        imgUrl: item.response.data,
      }
    } else {
      return { imgName: item.name, imgUrl: item.url }
    }
  })
  //2、整理销售属性的值
  SpuParams.value.spuSaleAttrList = saleAttr.value
  let result = await reqAddOrUpdateSpu(SpuParams.value)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '修改成功',
    })
  }
  $emit('changeScene',{'flag':0,'params':SpuParams.value.id?'update':'add'} )
}
//添加一个新的SPU初始化请求方法
const initAddSpu = async (c3Id: number | string) => {
  //清空数据
  Object.assign(SpuParams.value, {
    id:'',
    category3Id: '',
    spuName: '',
    description: '',
    tmId: '', //品牌ID
    spuSaleAttrList: [], //销售属性
    spuImageList: [], //图片
  })
  //清空照片墙
  imgList.value = []
  //清空销售属性
  saleAttr.value = []
  //清空收集
  saleAttrIdAndValueName.value=''
  //获取全部品牌数据
  let result: AllTradeMark = await reqAllTradeMark()
  //获取所用属性值
  let result1: HasSaleAttrResponseData = await reqAllSaleAttr()
  //存储数值
  AllTradeMark.value = result.data
  allSaleAttr.value = result1.data
  //存储3级分类ID
  SpuParams.value.category3Id = c3Id
}
//对外暴露
defineExpose({ initHasSpuData, initAddSpu })
</script>
<style></style>
