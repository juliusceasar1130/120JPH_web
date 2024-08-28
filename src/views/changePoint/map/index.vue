<template>
  <!-- 搜索部分 -->
  <el-card class="base-background">
    <!-- 筛选部分 -->
    <el-form  class="el-form-inline">
      <el-form-item>
        <el-select v-model="areaChSelect" clearable placeholder="选择区域" style="width: 240px"
          @change="areaChSelectChange">
          <el-option v-for="item in areaChOptions" :key="item" :label="item.lable" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="lineSelect" clearable placeholder="选择条线" style="width: 240px" @change="lineSelectChange">
          <el-option v-for="item in lineOptions" :key="item" :label="item.lable" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="keyWord" style="width: 240px" placeholder="搜索关键字" />
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <!--图表部分-->
  <el-card style="margin: 5px 0px" class="base-background">
    <div style="width: 100%; height: 100%">
      <el-table border style="width: 100%; height: 100%; margin: -10px -10px; border-radius: 5px" :data="cpMapResult"
        :row-class-name="tableRowClassName" height="550" stripe :header-cell-style="headerCellStyle">
        <!-- 表头部分 -->
        <el-table-column label="ID" align="center" width="50px"  prop="id"></el-table-column>
         <!--  用户ID列 -->
         <el-table-column label="参数名" align="center"   prop="nameParameter"></el-table-column>
        <!-- 区域列 -->
        <el-table-column label="点位" align="center"  prop="ioitem"></el-table-column>
        <!-- 设备列 -->
        <el-table-column label="区域(英)" align="center" width="80px" prop="areaEn"></el-table-column>
        <!-- 条线列 -->
        <el-table-column label="区域(中)" align="center" width="100px" prop="areaCh"></el-table-column>
        <el-table-column label="线" align="center" width="100px" prop="line"></el-table-column>
       
        <!-- 旧值列 -->
        <el-table-column label="设备(英)" align="center" width="150px" prop="equipmentEn"></el-table-column>
        <!-- 新值列 -->
        <el-table-column label="设备(中)" align="center" width="150px" prop="equipmentCh"></el-table-column>
       
        
        <!-- 新增图表按钮 -->
        <el-table-column label="历史" width="100px" align="center" >
          <template #="{ row, index }">
            <el-button style="background-color: #95d475"  round @click="dialogOpen(row)">
              <div class="icon-css"></div>
            </el-button>
          </template>
        </el-table-column>
        <!--  -->
      </el-table>
      <el-pagination style="margin-top: 15px" v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 50]"
        :background="true" layout=" prev, pager, next, jumper,->,sizes,total" :total="total"
        @size-change="MapByQuery()" @current-change="MapByQuery()" />
    </div>
  </el-card>


  <el-dialog :modal-append-to-body="false" :visible.sync="dialogVisible" append-to-body v-model="dialogVisible" title=""
    width="80%" height="60%" draggable style="background-color: #e8f3ff; border-radius: 5px; opacity: 1">
    
    <div style="
        width: 100%;
        height: 100%;
        margin-left: 0px;
        background-color: #f8f9fa;
        border-radius: 5px;
        opacity: 2;
      ">
       <el-button type="danger" @click="close" style="position: absolute; top: 10px; right: 10px">
        <el-icon class="el-icon--left">
          <CircleCloseFilled />
        </el-icon>
        Close
      </el-button>
      <CheckCharts :timeList="timeList" :valueList="valueList" startTime="2023/01/01" endTime="2028/01/01"
        :nameParameter="nameParameter" :ioitem="ioitem" :nameList="nameList"></CheckCharts>
    </div>
    <!--     <div class="charts" ref="charts" style="width: 100%; height: 400px;"></div> -->
    <el-form :inline="true" size="medium" label-width="80px">
      <el-row :gutter="10"></el-row>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">

import type { mapQuery, cpMapResult,query } from '@/api/changePoint/type'
import {
  reqGetAreaAndLine,
  reqIoitemHistoryList,
  reqMapByQuery
} from '@/api/changePoint'
import { ref, onMounted, reactive, onBeforeUnmount } from 'vue'
import CheckCharts from '../echarts/index.vue'

const dialogVisible = ref(false)
let pageNo = ref<number>(1)
let pageSize = ref(10)
let total = ref<number | null>(null)
let cpMapResult = ref<cpMapResult[]>([])
let mapquery = reactive<mapQuery>({
    areaCh:'',
    line:"",
    keyWord:''
})
let query=reactive<query>({
    areaCh:'',
    line:"",
    startTime: '2020-01-01',
    endTime: '2028-01-01'   
})
let keyWord=ref('')

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

onMounted(() => {
 
  console.log(mapquery)
  GetAreaAndLine()
  MapByQuery()

})
const search = () => {
  mapquery.keyWord=keyWord.value
  MapByQuery()
}

const MapByQuery = async () => {

  const result = await reqMapByQuery(pageNo.value, pageSize.value, mapquery)
  if (result.code === 200) {
    cpMapResult.value = result.data.pageData
    total.value = result.data.totalSize
  }

}

const GetAreaAndLine = async () => {
  const result = await reqGetAreaAndLine()
  if (result.code === 200) {
    areaAndLineBackup.value = result.data
    areaChOptions.value = result.data.map((item: any) => ({
      value: item.areaCh,
      label: item.areaCh,
    }))
  }
}

const areaChSelectChange = () => {
  lineSelect.value = ''
  mapquery.areaCh = areaChSelect.value
  const selectedArea = areaAndLineBackup.value.find(
    (item) => item.areaCh === mapquery.areaCh,
  )
  if (selectedArea) {
    lineOptions.value = selectedArea.lines.map((item) => ({
      value: item,
      label: 'Line:' + item,
    }))
  }
}

const lineSelectChange = () => {
  mapquery.line = lineSelect.value
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
      console.log(valueList.value)
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
  backgroundColor: '#a0cfff',
  color: '#333',
})
</script>

<style scoped lang="scss">
.base-background {
  background-color: #f4f4f5; 
  padding: 10px;
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
.el-form-inline{
display: flex; 
flex-direction: row;
justify-content: space-between; 
height: 15px;
margin-top: -15px;
}
</style>
