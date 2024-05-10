<template>
  <el-collapse v-model="activeNames" @change="handleChange">
    <el-collapse-item name="1">
      <template #title>
        <el-icon class="header-icon">
          <LocationFilled />
        </el-icon>
        最新检测任务
      </template>
      <!--可视化部分-->
      <div class="time">当前时间：{{ time }}</div>
      <carlayout />
    </el-collapse-item>
    <el-collapse-item name="2">
      <template #title>
        <el-icon class="header-icon">
          <HelpFilled />
        </el-icon>
        历史检测任务
      </template>
      <!--搜索部分-->
      <el-card>
        <el-form inline>
          <el-form-item style="width: 20%">
            <span class="demonstration"></span>
            <el-date-picker v-model="dateTimepickUp" type="datetimerange" :shortcuts="shortcuts" range-separator="至"
              start-placeholder="开始时间" end-placeholder="结束时间" @change="datepickup" value-format="YYYY-MM-DDTHH:mm:ss" />
          </el-form-item>
          <el-form-item label="雪橇号">
            <el-input v-model="query.skidNumber" placeholder="请输入雪橇号"></el-input>
          </el-form-item>
          <el-form-item label="车型">
            <el-input v-model="query.carType" placeholder="请输入车型"></el-input>
          </el-form-item>
          <el-form-item label="车号">
            <el-input v-model="query.carNumber" placeholder="请输入车号"></el-input>
          </el-form-item>
          <br>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="search"></el-button>
            <el-button type="primary" icon="Refresh" @click="reset"></el-button>
            <!--
            <el-button
              type="primary"
              icon="Share"
              @click="exportData"
            ></el-button>
            <el-button
              type="primary"
              icon="UploadFilled"
              @click="importData"
            ></el-button>
-->
          </el-form-item>
        </el-form>
      </el-card>
      <!--图表部分-->
      <el-card style="margin: 5px 0px">
        <el-table border style="margin: 10px 0px" :data="pageData" :row-class-name="tableRowClassName" height="550"
          @sort-change="sortChange">
          <el-table-column label="序号" align="center" width="80px" prop="Nr"></el-table-column>
          <el-table-column label="Date" align="center" prop="Date" sortable="custom"></el-table-column>
          <el-table-column label="SkidNumber" align="center" prop="SkidNumber"></el-table-column>
          <el-table-column label="CarType" align="center" prop="CarType"></el-table-column>
          <el-table-column label="CarNumber" align="center" prop="CarNumber"></el-table-column>
          <el-table-column label="Pos" align="center" width="80px" prop="Pos"></el-table-column>
          <el-table-column label="Avg" align="center" prop="Avg"></el-table-column>
          <el-table-column label="Eva" align="center">
            <template #="{ row, index }">
              <div class="imgcontainer">
                <img src="@/assets/images/OK.png" v-show="row.Eva == 'good'" style="width: 30px; height: 30px" />
                <img src="@/assets/images/NOK.png" v-show="row.Eva == 'bad'" style="width: 30px; height: 30px" />
                <img src="@/assets/images/警告.png" v-show="row.Eva == 'warning'" style="width: 30px; height: 30px" />
              </div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="120px">
            <template #="{ row, index }">
              <el-button type="primary" @click="openDia(row)">...</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 50]"
          :background="true" layout=" prev, pager, next, jumper,->,sizes,total" :total="total"
          @size-change="getLine1ListByPage(1)" @current-change="getLine1ListByPage" />
      </el-card>
    </el-collapse-item>
    <el-collapse-item name="3">
      <template #title>
        <el-icon class="header-icon">
          <HelpFilled />
        </el-icon>
        统计图表
        <!--图表部分-->
      </template>
      <chartLine></chartLine>
    </el-collapse-item>
  </el-collapse>

  <!--弹出图片部分-->
  <el-dialog v-model="visible" draggable="true" class="dialog-box" style="width: 1300px; height: 700px">
    <template #header="{ close, titleId, titleClass }" class="dialog-box1">
      <div class="my-header">
        <h4 :id="titleId" :class="titleClass">
          <el-tag style="margin: 5px 5px">序号：{{ dialogInfo.Nr }}</el-tag>
          <el-tag style="margin: 5px 5px">
            雪橇号：{{ dialogInfo.SkidNumber }}
          </el-tag>
          <el-tag style="margin: 5px 5px">
            车身号：{{ dialogInfo.CarNumber }}
          </el-tag>
        </h4>
        <!--   <el-button type="danger" @click="close">
          <el-icon class="el-icon--left">
            <CircleCloseFilled />
          </el-icon>
          Close
        </el-button> -->
      </div>
    </template>

    <el-div class="dialog-box2" style="width: 1200px; height: 700px">
      <el-carousel class="dialog-box3" indicator-position="outside" arrow="always" style="width: 1250px; height: 600px">
        <el-carousel-item v-for="item in dialogInfo.imgList" :key="item.name" style="width: 1290px; height: 600px">
          <h3 text="2xl" justify="center">{{ item.name }}</h3>
          <hr />

          <div class="demo-image__preview">
            <el-image style="width: 600px; height: 400px" fit="cover" :src="item.url" :preview-src-list="[item.url]"
              :initial-index="4" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" />
          </div>

          <div>点击图片预览</div>
        </el-carousel-item>
      </el-carousel>
    </el-div>
  </el-dialog>

  <!--导入数据弹框-->
  <el-dialog v-model="dialogImportVisible" title="导入" width="30%">
    <el-form label-width="120px">
      <el-form-item label="门槛数据">
        <el-upload class="upload-demo" :action="setting.RP2_importData_path" :on-success="onUploadSuccess">
          <el-button type="primary">上传</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import chartLine from './component/chartLine.vue'
import {
  reqLine1ResultByPage,
  reqLine1ImageListById,
  reqRp2ExcelDataExport,
} from '@/api/rockpanel'
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import {
  rockPanelDto,
  ImageListResponseData,
  dialogInfoType,
} from '@/api/rockpanel/type'
import { ElMessage } from 'element-plus'
import carlayout from './component/carlayout.vue'
import setting from '@/setting'
//@ts-ignore
import moment from 'moment'
let pageNo = ref(1)
let pageSize = ref(10)
let query = reactive<rockPanelDto>({
  skidNumber: '',
  carType: '',
  carNumber: '',
  eva: '',
  startTime: '',
  endTime: '',
  orderBy: { prop: '', order: '' },
})
let pageData = ref([])
let total = ref()
//时间选择参数
let dateTimepickUp = ref('')
let visible = ref(false)
let dialogInfo = ref<dialogInfoType>({
  Nr: 0,
  SkidNumber: '',
  CarNumber: '',
  imgList: [],
})
let dialogImportVisible = ref()
//存储当前时间
let time = ref(moment().format('YYYY年MM月DD日 hh:mm:ss'))
let timer = ref(0)

onMounted(() => {
  getLine1ListByPage()
  timer.value = setInterval(() => {
    time.value = moment().format('YYYY年MM月DD日 hh:mm:ss')
  }, 1000)
})

// 销毁定时器
onBeforeUnmount(() => {
  clearInterval(timer.value)
})

const getLine1ListByPage = async (page = 1) => {
  pageNo.value = page
  let result = await reqLine1ResultByPage(pageNo.value, pageSize.value, query)
  console.log('返回' + result)
  if (result.code == 200) {
    pageData.value = result.data.pageData
    total.value = result.data.totalSize
  }
  console.log(result)
}
const search = () => {
  getLine1ListByPage()
}

const reset = () => {
  Object.assign(query, {
    skidNumber: '',
    carType: '',
    carNumber: '',
    eva: '',
    startTime: '',
    endTime: '',
    orderBy: { prop: '', order: '' },
  })
  //清空时间pickup
  dateTimepickUp.value = ''
  getLine1ListByPage()
}
//表格配色
const tableRowClassName = ({ row, rowIndex }) => {
  if (row.Eva == 'warning') {
    return 'warning-row'
  } else if (row.Eva == 'bad') {
    return 'danger-row'
  }
  return ''
}
//时间选择器
const shortcuts = [
  {
    text: '上周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '上月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '上3个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]
//点击时间选择器确定后传送参数至Query
const datepickup = (value: any) => {
  ; (query.startTime = value[0]), (query.endTime = value[1]), console.log(query)
}
//打开图片对话框
const openDia = async (row: any) => {
  //清空原先残留数据，此次两个S\C首字母大写，因为JSON返回是大写
  Object.assign(dialogInfo.value, {
    Nr: 0,
    SkidNumber: '',
    CarNumber: '',
    imgList: [],
  })
  //获取该行的数据
  dialogInfo.value = { ...row }  
  //该接口获取图片集（Java已经按[{name:xx,url:xx}]）
  let result: ImageListResponseData = await reqLine1ImageListById(row.Nr)
  if (result.code == 200) {
    dialogInfo.value.imgList = result.data
    visible.value = true
  } else {
    ElMessage({
      type: 'error',
      message: '获取图片失败',
    })
  }
}
//
const sortChange = (data: any) => {
  console.log(data)
  query.orderBy.order = data.order == 'ascending' ? 'ASC' : 'DESC'
  query.orderBy.prop = data.prop
  getLine1ListByPage()
}
const exportData = () => {
  console.log('导出数据')
  reqRp2ExcelDataExport().then((res) => {
    const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = '门槛2站导出数据.xls'
    link.click()
  })
}
//导入按钮
const importData = () => {
  dialogImportVisible.value = true
}

// 导入数据成功以后要执行方法
const onUploadSuccess = async (response, file) => {
  ElMessage.success('导入成功')
  dialogImportVisible.value = false
  //重新获取数据
  getLine1ListByPage()
}
</script>

<style scoped lang="scss">
.my-header {
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
}

.time {
  position: relative;
  top: 40px;
  display: flex;
  z-index: 99;
  justify-content: right;
  margin-right: 20px;
}

.imgcontainer {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
