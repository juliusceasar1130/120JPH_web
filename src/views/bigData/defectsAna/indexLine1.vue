<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <!-- 搜索部分 -->
        <el-card class="base-background">
          <el-form class="el-form-inline">
            <el-form-item style="width: 60%">
              <span class="demonstration"></span>
              <el-date-picker v-model="dateTimepickUp" type="datetimerange" :shortcuts="shortcuts" range-separator="至"
                start-placeholder="开始时间" end-placeholder="结束时间" @change="datepickup"
                value-format="YYYY-MM-DDTHH:mm:ss" />
            </el-form-item>

            <el-form-item style="margin-right: 22px">
              <el-button type="primary" icon="Search" @click="search"></el-button>
              <el-button type="primary" icon="Refresh" @click="reset"></el-button>
              <el-button type="primary" icon="" @click="todaySearch">
                今天
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-header>

      <el-container>
        <el-aside width="30%" style="margin-top: 20px; margin-left: 20px; margin-right: -10px">
          <!--时刻表--timeline 行回调有点问题，所以不-->
          <el-card>
            <el-table v-loading="loadingTabelLine1" :data="carsDefectsAndCars1" @row-click="handleCurrentChange">
              <el-table-column label="序" type="index"></el-table-column>
              <el-table-column label="时刻" prop="index" width="180px"></el-table-column>
              <el-table-column label="缺陷数" prop="Defect_Count"></el-table-column>
              <el-table-column label="过车数" prop="cars"></el-table-column>
              <el-table-column label="返工车数" prop="second_flag"></el-table-column>
            </el-table>
          </el-card>
        </el-aside>
        <el-main width="70%">
          <!---图表-->
          <el-card>
            <barCharts style="height: 35vh" v-loading="loadingLine1" :timeList="timeListLine1"
              :valueList1="valueList1Line1" :valueList2="valueList2Line1" :valueList3="valueList3Line1"
              :valueList4="valueList4Line1" startTime="2023/01/01" endTime="2028/01/01"
              :nameParameter="'1线' + '过车及缺陷数'"></barCharts>
          </el-card>
          <!---图表-->
          <el-card>
            <barCharts style="height: 35vh" v-loading="loadingLineRework1" :timeList="timeListLineRework1"
              :valueList1="valueList1LineRework1" :valueList2="valueList2LineRework1"
              :valueList3="valueList3LineRework1" :valueList4="valueList4LineRework1" startTime="2023/01/01"
              endTime="2028/01/01" :nameParameter="'1线' + '生产返工'">
            </barCharts>
          </el-card>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import {  
  reqcarsDefectsAndLabel,
  reqcarsDefectsAndCounts,
  reqcarsDefectsAndLabelRework,
} from '@/api/dataAna'
import { ref, onMounted, reactive, watch } from 'vue'
import moment from 'moment'
import barCharts from '../echarts/bar.vue'
let dateTimepickUp = ref()
let query = reactive({
  startTime: '',
  endTime: '',  
})
let currentRow = ref()
//1线参数
let timeListLine1 = ref<string[]>([])
let valueList1Line1 = ref<number[]>([])
let valueList2Line1 = ref<number[]>([])
let valueList3Line1 = ref<string[]>([]) //carvin
let valueList4Line1 = ref<string[]>([]) //skid
let loadingLine1 = ref(true)
let loadingTabelLine1 = ref<boolean>(true) //表格
let carsDefectsAndCars1 = ref()
let loadingLineRework1 = ref(true)

let timeListLineRework1 = ref<string[]>([])
let valueList1LineRework1 = ref<number[]>([])
let valueList2LineRework1 = ref<number[]>([])
let valueList3LineRework1 = ref<string[]>([]) //carvin
let valueList4LineRework1 = ref<string[]>([]) //skid

//监视时间筛选变化
watch(
  //选择点位变化后，更新参数
  () => query.startTime,
  () => {
    dateTimepickUp.value = [query.startTime, query.endTime]
  },
)
//初始化查询
onMounted(() => {
  query.startTime = moment(shortcuts[0].value()[0]).format(
    'YYYY-MM-DDTHH:mm:ss',
  )
  query.endTime = moment(shortcuts[0].value()[1]).format('YYYY-MM-DDTHH:mm:ss')

  //获取区域和线路
  //GetreqcleanSchedule(query.line)

  GetreqcarsDefectsAndLabel1(1, query.startTime, query.endTime)
  GetreqcarsDefectsAndCounts1(1, query.startTime, query.endTime)
  GetreqcarsDefectsAndLabelRework1(1, query.startTime, query.endTime)
})

const GetreqcarsDefectsAndLabel1 = async (
  line: any,
  time_begin: any,
  time_end: any,
) => {
  loadingLine1.value = true
  let result = await reqcarsDefectsAndLabel(line, time_begin, time_end)
  if (result.code == 200) {
    //必须定义对象
    //carsDefectsAndLabel.value = result.data
    ; (timeListLine1.value = result.data.index),
      (valueList1Line1.value = result.data.defects),
      (valueList2Line1.value = result.data.schedule),
      (valueList3Line1.value = result.data.car),
      (valueList4Line1.value = result.data.skid),
      (loadingLine1.value = false)
  }
}
const GetreqcarsDefectsAndCounts1 = async (
  line: any,
  time_begin: any,
  time_end: any,
) => {
  loadingTabelLine1.value = true
  let result = await reqcarsDefectsAndCounts(line, time_begin, time_end)
  if (result.code == 200) {
    //必须定义对象
    carsDefectsAndCars1.value = result.data.data
    loadingTabelLine1.value = false
  }
}
const GetreqcarsDefectsAndLabelRework1 = async (
  line: any,
  time_begin: any,
  time_end: any,
) => {
  loadingLineRework1.value = true
  let result = await reqcarsDefectsAndLabelRework(line, time_begin, time_end)
  if (result.code == 200) {
    ; (timeListLineRework1.value = result.data.index),
      (valueList1LineRework1.value = result.data.defects),
      (valueList2LineRework1.value = result.data.schedule),
      (valueList3LineRework1.value = result.data.car),
      (valueList4LineRework1.value = result.data.skid),
      (loadingLineRework1.value = false)
  }
}
//时间选择器
const shortcuts = [
  {
    text: '昨天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
      return [start, end]
    },
  },
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
  ; (query.startTime = value[0]), (query.endTime = value[1])
}

const search = () => {
  // loading.value = true
  // loadingTabel.value = true
  console.log('=========================')
  console.log(query.startTime)
  GetreqcarsDefectsAndLabel1(1, query.startTime, query.endTime)
  GetreqcarsDefectsAndCounts1(1, query.startTime, query.endTime)
  GetreqcarsDefectsAndLabelRework1(1, query.startTime, query.endTime)
}
const reset = () => {
  //清空Query
  Object.assign(query, {
    //line: '',
    startTime: '',
    endTime: '',
  })
  //重新获取数据，上周
  query.startTime = moment(shortcuts[0].value()[0]).format(
    'YYYY-MM-DDTHH:mm:ss',
  )
  query.endTime = moment(shortcuts[0].value()[1]).format('YYYY-MM-DDTHH:mm:ss')
  dateTimepickUp.value = [query.startTime, query.endTime]
  GetreqcarsDefectsAndLabel1(1, query.startTime, query.endTime)
  GetreqcarsDefectsAndCounts1(1, query.startTime, query.endTime)
  GetreqcarsDefectsAndLabelRework1(1, query.startTime, query.endTime)
}
const todaySearch = () => {
  //今天
  query.startTime = moment(shortcuts[0].value()[0]).format(
    'YYYY-MM-DDTHH:mm:ss',
  )
  query.endTime = moment(shortcuts[0].value()[1]).format('YYYY-MM-DDTHH:mm:ss')
  dateTimepickUp.value = [query.startTime, query.endTime]
  GetreqcarsDefectsAndLabel1(1, query.startTime, query.endTime)
  GetreqcarsDefectsAndCounts1(1, query.startTime, query.endTime)
  GetreqcarsDefectsAndLabelRework1(1, query.startTime, query.endTime)
}

//用于表格格式
const handleCurrentChange = (val: any) => {
  currentRow.value = val
  //el_tabel的handleCurrentChange存在bug,会数据变化时激活，因此需要判断是否为空
  if (currentRow.value) {
    query.startTime = currentRow.value.index.split(',')[0].substr(1, 19)
    query.endTime = currentRow.value.index.split(',')[1].substr(1, 19)
    let t1 = new Date(query.startTime)
    let t2 = new Date(query.endTime)
    query.startTime = moment(t1).format('YYYY-MM-DDTHH:mm:ss')
    query.endTime = moment(t2).format('YYYY-MM-DDTHH:mm:ss')
    GetreqcarsDefectsAndLabel1(1, query.startTime, query.endTime)
    GetreqcarsDefectsAndLabelRework1(1, query.startTime, query.endTime)
  }
}

</script>
<style scoped>
.base-background {
  background-color: #f4f4f5;
  /* #f4f4f5 */
  padding: 15px;
}

.el-form-inline {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 15px;
  margin-top: -15px;
}

.box-card {
  background-color: #bae0f0b5;
  /* #227ba2b5 #1b6585b5  #227ba2 */
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(216, 132, 132, 0.1);
  /* old    rgba(247, 246, 246, 0.1) */
  margin-top: 0px;
  width: 23vw;
  height: 32vh;
  justify-content: center;
}

.item {
  margin-top: 1px;
  margin-right: 0px;
}

.card-header {
  font-size: 24px;
  color: #fff;
  background-color: #227ba2;
  padding: 22px 22px;
  margin: -18px -20px;
}

.line-item {
  font-size: 16px;
  text-align: center;
  font-family: Arial, Helvetica, sans-serif;
}

.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 15px;
  min-height: 25px;
  line-height: 25px;
  text-align: center;
  font-size: 15px;
  color: #000000;

  padding: 10px;
}

/* 选中按钮的阴影效果 */
.shadow-effect {
  box-shadow: -6px 6px 3px 1px rgba(2, 0, 9, 0.3);
  /* 添加阴影效果 */
  transition: box-shadow 0.3s ease;
  /* 添加过渡效果 */
}

.even-row {
  background-color: #f0f0f0;
  /* 偶数行背景色 */
}

.odd-row {
  background-color: #ffffff;
  /* 奇数行背景色 */
}
</style>
