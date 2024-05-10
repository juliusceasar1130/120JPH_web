<template>
  <div>
    <!--三级分类全局组件-->
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0px">
      <div v-show="scene == 0">
        <el-button @click="addAttr" type="primary" size="default" icon="Plus" :disabled="!categoryStore.c3Id">
          添加属性
        </el-button>
        <el-table border style="margin: 10px 0px" :data="attrArr">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="属性名称" align="center" width="120px" prop="attrName"></el-table-column>
          <el-table-column label="属性值名称" align="left">
            <template #="{ row, $index }">
              <el-tag style="margin: 5px" v-for="(item, index) in row.attrValueList" :key="item.id">
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="300px" prop="attrName">
            <!--row代表以后得属性对象-->
            <template #="{ row, $index }">
              <el-button type="primary" @click="updateAttr(row)">
                编辑
              </el-button>
              <el-popconfirm :title="`确定删除<${row.attrName}>吗`" width="200px" icon="delete" @confirm="removeAttr(row)">
                <template #reference>
                  <el-button type="danger" size="small" icon="Delete"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene == 1">
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input placeholder="请输入" v-model="attrParams.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button :disabled="!attrParams.attrName" @click="addAttrValue" type="primary" size="default" icon="Plus">
          添加属性值
        </el-button>
        <el-button @click="cancel" size="default">取消</el-button>
        <el-table border style="margin: 10px;0px;" :data="attrParams.attrValueList">
          <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
          <el-table-column label="属性值名称" align="center">
            <template #="{ row, $index }">
              <el-input :ref="(vc: any) => (inputArr[$index] = vc)" v-if="row.flag" @blur="toLook(row, $index)"
                placeholder="请输入" v-model="row.valueName"></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作" width="200px" align="center">
            <template #="{ row, $index }">
              <el-button @click="deleteV($index)" type="danger" size="small">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button @click="save" type="primary" size="default" :disabled="attrParams.attrValueList.length == 0">
          保存
        </el-button>
        <el-button @click="cancel" size="default">取消</el-button>
      </div>
    </el-card>
  </div>
</template>
<script setup lang="ts">
//引入监听功能
import { watch, ref, reactive, nextTick,onBeforeUnmount } from 'vue'
import useCatrgoryStore from '@/store/modules/category'
import { reqAttr, reqAddOrUpdateAttr, reqRemoveAttr } from '@/api/product/attr'
import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type'
import { ElMessage } from 'element-plus'
let categoryStore = useCatrgoryStore()
//存储获得属性数值
let attrArr = ref<Attr[]>([])
//定义卡片组件切换
let scene = ref<number>(0)
//收集新增的属性对象
let attrParams = reactive<Attr>({
  attrName: '',
  attrValueList: [], //属性值
  categoryId: '', //3级分类ID
  categoryLevel: 3, //3级分类
})
//准备一个数值，将来存储对应的组件实例el-input
let inputArr = ref<any>([])
//监听仓库三级分类 保证三级分类有数值
watch(
  () => categoryStore.c3Id,
  async () => {
    //f发生变化先清空上一次数据
    attrArr.value = []
    //保证三级分类有数值 否则不去获取数据
    if (!categoryStore.c3Id) return
    let result: AttrResponseData = await reqAttr(
      categoryStore.c1Id,
      categoryStore.c2Id,
      categoryStore.c3Id,
    )
    if (result.code == 200) {
      attrArr.value = result.data
    }
  },
)
const addAttr = () => {
  //先清空数据在收集数据
  Object.assign(attrParams, {
    attrName: '',
    attrValueList: [], //属性值
    categoryId: '', //3级分类ID
    categoryLevel: 3, //3级分类
  })
  scene.value = 1
  //收集三级分类ID
  attrParams.categoryId = categoryStore.c3Id
}
//
const updateAttr = (row: Attr) => {
  scene.value = 1

  //里面存在浅拷贝，需要用到Json
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}
const cancel = () => {
  scene.value = 0
}
const addAttrValue = () => {
  attrParams.attrValueList.push({
    valueName: '',
    //控制每个属性值的编辑、查看模式
    flag: true,
  })
  //聚焦最后行，也就是最新的
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}
const save = async () => {
  //收集参数
  //发起请求
  let result = await reqAddOrUpdateAttr(attrParams)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '添加成功',
    })
    //重新获取属性数据
    let result: AttrResponseData = await reqAttr(
      categoryStore.c1Id,
      categoryStore.c2Id,
      categoryStore.c3Id,
    )
    if (result.code == 200) {
      attrArr.value = result.data
    }
    scene.value = 0
  } else {
    ElMessage({
      type: 'error',
      message: '添加失败',
    })
  }
}
//失去焦点的事件回调
const toLook = (row: AttrValue, $index: number) => {
  //非法清空的判断1
  if (row.valueName.trim() == '') {
    //删除该为空行
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '数据不能为空',
    })

    return
  }
  //非法情况2
  let repeat = attrParams.attrValueList.find((item) => {
    //除了当前自己行
    if (item != row) {
      return item.valueName == row.valueName
    }
  })
  if (repeat) {
    //删除重复数据
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '数据不能重复',
    })
    return
  }
  row.flag = false
}
const toEdit = (row: AttrValue, $index: number) => {
  row.flag = true
  //响应式数据发生变化后 获取更新后的DOM或者组件实例
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}
const deleteV = ($index: number) => {
  attrParams.attrValueList.splice($index, 1)
}
const removeAttr = async (row: Attr) => {
  console.log(row)
  let result = await reqRemoveAttr(row.id)
  if (result.code == 200) {
    //f发生变化先清空上一次数据
    attrArr.value = []
    //保证三级分类有数值 否则不去获取数据
    if (!categoryStore.c3Id) return
    let result: AttrResponseData = await reqAttr(
      categoryStore.c1Id,
      categoryStore.c2Id,
      categoryStore.c3Id,
    )
    if (result.code == 200) {
      attrArr.value = result.data
    }

    ElMessage({
      type: 'success',
      message: '删除成功',
    })
  }
}
//路由组件销毁前，删除仓库数据
onBeforeUnmount(()=>
  categoryStore.$reset()
)
</script>
<style></style>
