<template>
  <!-- 搜索部分 -->
  <el-card class="base-background">
    <el-form   class="el-form-inline"  >
      <!-- 筛选部分 -->
      <el-form-item  >
        <el-select v-model="areaChSelect" clearable placeholder="选择区域" @change="areaChSelectChange" style="width: 100px;margin-right: 10px;">
          <el-option v-for="item in areaChOptions" :key="item" :label="item.lable" :value="item.value" />
        </el-select>
        <el-select v-model="lineSelect" clearable placeholder="选择条线" @change="lineSelectChange" style="width: 100px;">
          <el-option v-for="item in lineOptions" :key="item" :label="item.lable" :value="item.value" />
        </el-select>
      </el-form-item>
      <!-- 时间 -->
      <el-form-item>
          <!-- <span class="demonstration"></span> -->
          <el-date-picker v-model="dateTimepickUp" type="datetimerange" :shortcuts="shortcuts" range-separator="至"
            start-placeholder="开始时间" end-placeholder="结束时间" @change="datepickup" value-format="YYYY-MM-DDTHH:mm:ss" style="width: 400px;" />
      </el-form-item>
      <!-- 按钮 -->
      <el-form-item  style="margin-right:0px ;">
          <el-button type="primary" icon="Search" @click="search"></el-button>
          <el-button type="primary" icon="Refresh" @click="reset"></el-button>
          <el-button type="primary" icon="" @click="todaySearch">今天</el-button>
      </el-form-item>
    </el-form>

  </el-card>

  <!--图表部分-->
  <el-card style="margin: 5px 0px" class="base-background">
    <div style="width: 102%; height: 100%">
      <el-table border 
        style="width: 100%; height: 100%; margin-top: -13px;margin-left: -13px;
        margin-right: -10px;padding: 10px;; border-radius: 5px" :data="cpResult"
        :row-class-name="tableRowClassName" 
        height="450" 
        stripe 
        :header-cell-style="headerCellStyle" 
        @sort-change="sortChange" size="small">
        <!-- 表头部分 -->
        <el-table-column label="Nr" align="center" width="45px" type="index"></el-table-column>
        <!-- 时间列 -->
        <el-table-column label="时间" align="center" prop="localDts" sortable="custom" width="155px">
          <template #="{ row, index }">
            <p>{{ dateConvert(row.localDts) }}</p>
          </template>
        </el-table-column>
        <!-- 区域列 -->
        <el-table-column label="区域" align="center" width="68px" prop="areaCh"></el-table-column>
        <!-- 设备列 -->
        <!-- <el-table-column label="设备" align="center" width="90px" prop="equipmentCh"></el-table-column> -->
        <!-- 条线列 -->
        <!-- <el-table-column label="条线" align="center" width="100px" prop="lineCh"></el-table-column> -->
        <!-- 名称列 -->
        <el-table-column label="名称" align="center" prop="nameParameter" ></el-table-column>
        <!-- 类型列 -->
        <el-table-column label="点位" align="center"  prop="ioitem" fit></el-table-column>
        <!-- 旧值列 -->
        <el-table-column label="旧值" align="center" width="55x" prop="oldValue"></el-table-column>
        <!-- 新值列 -->
        <el-table-column label="新值" align="center" width="60px" prop="newValue"></el-table-column>
        <!--  用户ID列 -->
        <el-table-column label="修改者" align="center" width="100px"  prop="userId" fit></el-table-column>
        <!-- 新增图表按钮 -->
        <el-table-column label="历史" min-width="30px" max-width="50px" align="center"  fixed="right">
          <template #="{ row, index }">
            <el-button style="background-color: #95d475" circle @click="dialogOpen(row)">
              <div class="icon-css"></div>
            </el-button>
          </template>
        </el-table-column>
        <!--  -->
      </el-table>
      <el-pagination style="margin-top: 10px;" v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 50]"
        :background="true" layout=" prev, pager, next, jumper,->,sizes,total" :total="total"
        @size-change="CPDataVoByQuery()" @current-change="CPDataVoByQuery()" />
    </div>
  </el-card>

  <el-dialog 
    :modal-append-to-body="false" 
    :visible.sync="dialogVisible" 
    append-to-body 
    v-model="dialogVisible" 
    title=""
    width="80%" 
    height="45%" 
    draggable 
    style="background-color: #e8f3ff; border-radius: 5px; opacity: 1">
    <div style="width: 100%;height: 100%;background-color: #f8f9fa;border-radius: 5px;opacity: 2;">
      <el-button type="danger" @click="close" style="position: absolute; top: 10px; right: 16px">
        <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>Close
      </el-button>
      <CheckCharts :timeList="timeList" :valueList="valueList" :startTime="query.startTime" :endTime="query.endTime"
        :nameParameter="nameParameter" :ioitem="ioitem" :nameList="nameList"></CheckCharts>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import type { query, cpResult } from '@/api/changePoint/type'
import {
  reqCPDataVoByQuery,
  reqGetAreaAndLine,
  reqIoitemHistoryList,
} from '@/api/changePoint'
import { ref, onMounted, reactive, onBeforeUnmount, watch } from 'vue'
import moment from 'moment'
import useTraceStore from '@/views/changePoint/store/trace.ts'
import CheckCharts from '../echarts/index.vue'



let dialogVisible = ref(false)
const traceStore = useTraceStore()
let dateTimepickUp = ref<string[]>([])
let pageNo = ref<number>(1)
let pageSize = ref(10)
let total = ref<number | null>(null)
let cpResult = ref<cpResult[]>([])
let query = reactive<query>({
  areaCh: '',
  line: '',
  startTime: '',
  endTime: '',
})

let areaChSelect = ref('')
let areaChOptions = ref<{ value: string; label: string }[]>([])
let lineSelect = ref('')
let lineOptions = ref<{ value: string; label: string }[]>([])
let areaAndLineBackup = ref<Array<{ areaCh: string; lines: string[] }>>([])
let timeList = ref<string[]>([])
let valueList = ref<number[]>([])
let nameParameter = ref()
let ioitem = ref()
let nameList=ref()

const close = () => {
  dialogVisible.value = false // 关闭弹窗
}
const shortcuts = [
  {
    text: '昨天',
    value: () => [moment().subtract(1, 'day').toDate(), new Date()],
  },
  {
    text: '上周',
    value: () => [moment().subtract(7, 'days').toDate(), new Date()],
  },
  {
    text: '上月',
    value: () => [moment().subtract(30, 'days').toDate(), new Date()],
  },
  {
    text: '上3个月',
    value: () => [moment().subtract(90, 'days').toDate(), new Date()],
  },
]

onMounted(() => {
  GetAreaAndLine()
  if (traceStore.query.areaCh) {
    Object.assign(query, traceStore.query)
    areaChSelect.value = traceStore.query.areaCh
    lineSelect.value = traceStore.query.line
    dateTimepickUp.value = [query.startTime, query.endTime]
    CPDataVoByQuery()
  } else {
    const [start, end] = shortcuts[0].value()
    query.startTime = moment(start).format('YYYY-MM-DDTHH:mm:ss')
    query.endTime = moment(end).format('YYYY-MM-DDTHH:mm:ss')
    dateTimepickUp.value = [query.startTime, query.endTime]
    CPDataVoByQuery()
  }
})

const CPDataVoByQuery = async () => {
  try {
    const result = await reqCPDataVoByQuery(pageNo.value, pageSize.value, query)
    if (result.code === 200) {
      cpResult.value = result.data.pageData
      total.value = result.data.totalSize
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const dateConvert = (data: string) =>
  new Date(data).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })

const datepickup = (value: string[]) => {
  query.startTime = value[0]
  query.endTime = value[1]
}

const search = CPDataVoByQuery

const reset = () => {
  Object.assign(query, { areaCh: '', line: '', startTime: '', endTime: '' })
  const [start, end] = shortcuts[0].value()
  query.startTime = moment(start).format('YYYY-MM-DDTHH:mm:ss')
  query.endTime = moment(end).format('YYYY-MM-DDTHH:mm:ss')
  dateTimepickUp.value = [query.startTime, query.endTime]
  CPDataVoByQuery()
}

const todaySearch = () => {
  const [start, end] = shortcuts[0].value()
  query.startTime = moment(start).format('YYYY-MM-DDTHH:mm:ss')
  query.endTime = moment(end).format('YYYY-MM-DDTHH:mm:ss')
  dateTimepickUp.value = [query.startTime, query.endTime]
  CPDataVoByQuery()
}

onBeforeUnmount(() => {
  if (traceStore && typeof traceStore.query === 'object') {
    traceStore.query = { areaCh: '', line: '', startTime: '', endTime: '' }
  }
})

const GetAreaAndLine = async () => {
  try {
    const result = await reqGetAreaAndLine()
    if (result.code === 200) {
      areaAndLineBackup.value = result.data
      areaChOptions.value = result.data.map((item: any) => ({
        value: item.areaCh,
        label: item.areaCh,
      }))
    }
  } catch (error) {
    console.error('Error fetching area and line data:', error)
  }
}

const areaChSelectChange = () => {
  lineSelect.value = ''
  query.areaCh = areaChSelect.value
  query.line = lineSelect.value
  const selectedArea = areaAndLineBackup.value.find(
    (item) => item.areaCh === query.areaCh,
  )
  if (selectedArea) {
    lineOptions.value = selectedArea.lines.map((item) => ({
      value: item,
      label: 'Line:' + item,
    }))
  }
}

const lineSelectChange = () => {
  query.line = lineSelect.value
}

const dialogOpen = async (row: any) => {
  //传递点位信息
  nameParameter.value = row.nameParameter
  ioitem.value = row.ioitem
  try {
    const result = await reqIoitemHistoryList(row.ioitem, query)
    if (result.code === 200) {
      valueList.value = result.data.setPointList
      timeList.value = result.data.timeList
      nameList.value=result.data.nameList
      dialogVisible.value = true
    }
  } catch (error) {
    console.error('Error fetching history list:', error)
  }
}

const tableRowClassName = ({ rowIndex }: { rowIndex: number }) => {
  return rowIndex % 2 === 0 ? 'even-row' : 'odd-row'
}

const headerCellStyle = () => ({
  backgroundColor: '#e8f3ff',
  color: '#333',
})
</script>

<style scoped lang="scss">
.base-background {
  background-color: #f4f4f5;
  padding: 15px;
}

.el-form-inline{
display: flex; 
flex-direction: row;
justify-content: space-between; 
height: 15px;
margin-top: -15px;
}

.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}

.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}

.even-row {
  background-color: #f0f0f0;
  /* 偶数行背景色 */
}

.odd-row {
  background-color: #ffffff;
  /* 奇数行背景色 */
}

.icon-css {
  background-image: url('@/assets/icons/chart-line.svg');
  background-size: contain;
  background-repeat: no-repeat;
  width: 20px;
  height: 20px;
}
</style>
