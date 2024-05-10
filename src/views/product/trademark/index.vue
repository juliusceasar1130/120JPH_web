<template>
  <el-card class="box-card">
    <!--卡片Button-->
    <el-button type="primary" sieze="small" icon="Plus" @click="addTrademark" v-has='`btn.Trademark.add`'>
      添加品牌
    </el-button>
    <el-table style="margin: 10px" border :data="trademarkArr">
      <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
      <!--Ttable-column默认展示数据用得是DIV 可以自定义作用域插槽（图片需要）-->
      <el-table-column label="名称" align="center" prop="tmName">
        <!--<template #="{ row, $index }">
                    <pre style="color: blue">{{ row.tmName }}</pre>
                </template>-->
      </el-table-column>
      <el-table-column label="Logo" align="center" prop="tmName">
        <template #="{ row }">
          <img :src="row.logoUrl" alt="图片没有" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" prop="tmName">
        <template #="{ row, $index }">
          <el-button type="primary" size="small" icon="Edit" @click="() => updateTrademark(row)"></el-button>

          <el-popconfirm :title="`确定删除<${row.tmName}>吗`" width="200px" icon="delete" @confirm="removeTrademark(row.id)">
            <template #reference>
              <el-button type="danger" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-
        v-model:current-page 设置当前页码
        v-model:page-size 每页的数据条数
        layout:6个子组件 可以调整布局
        -->
    <el-pagination @size-change="sizeChange" @current-change="getHasTrademark" pager-count="4"
      v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[3, 5, 7, 9]" :small="small"
      :background="true" layout="prev, pager, next, jumper,->, sizes,total " :total="total" />
    <!--卡片表格-->
  </el-card>
  <!--对话框组件，在添加修改时
  v-model:用于控制对话框的显示隐藏
  title：设置左上角主题-->
  <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id ? '修改品牌' : '添加品牌'" width="500">
    <el-form style="width: 80%" :model="trademarkParams" :rules="rules" ref="formRef">
      <el-form-item label="品牌名称" label-width="80px" prop="tmName">
        <el-input placeholder="请您输入" v-model="trademarkParams.tmName"></el-input>
      </el-form-item>
      <el-form-item label="品牌Logo" label-width="80px" prop="logoUrl">
        <!--Action上传图片，需要增加/api,否则代理服务器不发送-->
        <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" :show-file-list="true"
          :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar"
            style="width: 100px; height: 100px" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <!--具名插槽 footer-->
    <template #footer>
      <el-button type="default" size="default" @click="cancel">取消</el-button>
      <el-button type="primary" size="default" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
//组合式API函数
import { ref, reactive, nextTick } from 'vue'
import { onMounted } from 'vue'

import {
  reqHasTrademark,
  reqAddOrUpdateTrademark,
  reqDeleteTrademark,
} from '@/api/product/trademark'
import { ElMessage, type UploadProps } from 'element-plus'
import type {
  TradeMarkResponseData,
  Records,
  TradeMark,
} from '@/api/product/trademark/type'
let pageNo = ref<number>(1)
let limit = ref<number>(3)
//存储已有数据的总量
let total = ref<number>(0)
//存储已有品牌数组
let trademarkArr = ref<Records>([])
//控制对话框的显示隐藏
let dialogFormVisible = ref<boolean>(false)
//定义收集品牌的数值
let trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: '',
})
//获取form组件实例
let formRef = ref()

//获取接口封装函数
//Pagination组件将回调注入pager，初始化为1
const getHasTrademark = async (pager = 1) => {
  pageNo.value = pager
  let result: TradeMarkResponseData = await reqHasTrademark(
    pageNo.value,
    limit.value,
  )
  if (result.code == 200) {
    total.value = result.data.total
    trademarkArr.value = result.data.records
  }
}
//组件挂载的狗子
onMounted(() => {
  getHasTrademark()
})
//分页器页面发生变化触发
//对于当前页码发生变化自定义事件，组件pagination父组件回传了数据（当前页码）
//const changePageNo=()=>{
//getHasTrademark()
//}
//显示每页数量调整
const sizeChange = () => {
  //当每页显示数量发生变化时，回到第一页,也可以用回调特性
  //pageNo.value=1;
  getHasTrademark()
}
//添加品牌按钮的回调
const addTrademark = () => {
  //对话框显示
  dialogFormVisible.value = true
  //首先清空对话框数据
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  trademarkParams.id = undefined
  //第一种写法:组件存在与否TS的？
  // formRef.value?.clearValidate('tmName')
  // formRef.value?.clearValidate('logoUrl')
  //第二种写法
  nextTick(() => {
    formRef.value?.clearValidate('tmName')
    formRef.value?.clearValidate('logoUrl')
  })
}
//修改品牌按钮回调
//row回调回来的数据
const updateTrademark = (row: TradeMark) => {
  nextTick(() => {
    formRef.value?.clearValidate('tmName')
    formRef.value?.clearValidate('logoUrl')
  })
  //对话框显示
  dialogFormVisible.value = true
  //展示数据,可以使用合并对象
  // trademarkParams.tmName = row.tmName;
  // trademarkParams.logoUrl = row.logoUrl;
  // trademarkParams.id=row.id
  Object.assign(trademarkParams, row)
}
//对话框取消
const cancel = () => {
  dialogFormVisible.value = false
}
//对话框确定
const confirm = async () => {
  //在发请求之前，对整个表单进行校验 validate返回时promise,成功再完成后面代码
  await formRef.value.validate()
  dialogFormVisible.value = false
  let result: any = await reqAddOrUpdateTrademark(trademarkParams)
  if (result.code == 200) {
    //成功：对话框关闭、消息、重新加载列表
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改成功' : '添加成功',
    })
    getHasTrademark(trademarkParams.id ? pageNo.value : 1)
  } else {
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '修改失败' : '添加失败',
    })
    //失败
  }
}
//图片上传之前的限制，钩子在图片上传之前
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  //要求：png|jpg|gif 4M
  if (
    rawFile.type == 'image/png' ||
    rawFile.type == 'image/jpeg' ||
    rawFile.type == 'image/gif'
  ) {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传的文件大小应该小于4M',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传的文件格式不正确',
    })
    return false
  }
}
//图片上传成功的钩子回调
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile,
) => {
  //response:成功后post请求返回的函数
  //uploadFile:
  //收集上传服务器图片存储地址，将来添加时带给服务器
  trademarkParams.logoUrl = response.data
  //图片上传成功应该清除掉Validate
  formRef.value.clearValidate('logoUrl')
}
//品牌自定义校验规则的方法
const validatorTmName = (rule: any, value: any, callback: any) => {
  //blue时触发，callback()放行函数
  //自定义的校验规则
  if (value.trim().length >= 2) {
    callback()
  } else {
    //校验未通过
    callback(new Error('品牌名称大于等于两位'))
  }
}
const validatorLogoUrl = (rule: any, value: any, callback: any) => {
  //如果图片上传
  if (value) {
    callback()
  } else {
    callback(new Error('logo图片务必上传'))
  }
}

//表单校验规则对象
const rules = {
  tmName: [
    {
      //表单required出现五角星,trigger触发时机,自定义
      required: true,
      trigger: 'blur',
      validator: validatorTmName,
    },
  ],
  logoUrl: [
    {
      required: true,
      //图片没有trigger
      validator: validatorLogoUrl,
    },
  ],
}
//气泡确认框确定按钮的回调
const removeTrademark = async (id: number) => {
  getHasTrademark(
    trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1,
  )
  //返回不是promise对象是空？？？？以下await没有用 :定义箭头函数中需要return或者取消{}

  let result = await reqDeleteTrademark(id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功！',
    })
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
