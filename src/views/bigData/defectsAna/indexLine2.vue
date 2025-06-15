<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <!-- 搜索部分 -->
        <el-card class="base-background">
          <el-form class="el-form-inline">
            <el-form-item style="width: 60%">
              <span class="demonstration"></span>
              <el-date-picker
                v-model="dateTimepickUp"
                type="datetimerange"
                :shortcuts="shortcuts"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                @change="datepickup"
                value-format="YYYY-MM-DDTHH:mm:ss"
              />
            </el-form-item>

            <el-form-item style="margin-right: 22px">
              <el-button
                type="primary"
                icon="Search"
                @click="search"
              ></el-button>
              <el-button
                type="primary"
                icon="Refresh"
                @click="reset"
              ></el-button>
              <el-button type="primary" icon="" @click="todaySearch">
                今天
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-header>

      <el-container>
        <el-aside
          width="30%"
          style="margin-top: 20px; margin-left: 20px; margin-right: -10px"
        >
          <!--时刻表--timeline 行回调有点问题，所以不-->
          <el-card>
            <!-- <el-timeline style="max-width: 600px">
              <el-timeline-item
                v-for="(activity, index) in carsDefectsAndCars2"
                :key="index"
                :timestamp="activity.index"
                placement="top"                
                icon="Timer"
                type="warning"
              >
              <template default="scope">
                <el-tag type="primary" style="margin-right:20px ;"> {{ activity.Defect_Count }}</el-tag>
              <el-tag type="primary" style="margin-right:20px ;"> {{ activity.cars }}</el-tag>
              <el-button icon="ArrowRightBold" type="small" @click="ff(scope)"></el-button>
              </template>           
                             
                
              </el-timeline-item>
            </el-timeline> -->
            <el-table v-loading="loadingTabelLine2" :data="carsDefectsAndCars2" @row-click="handleCurrentChange">
              <el-table-column label="序" type="index"  >              
              </el-table-column>
              <el-table-column label="时刻" prop="index" width="180px">              
              </el-table-column>
              <el-table-column label="缺陷数" prop="Defect_Count">              
              </el-table-column>
              <el-table-column label="过车数" prop="cars">              
              </el-table-column> 
              <el-table-column label="返工车数" prop="second_flag"></el-table-column>          
            </el-table>
          </el-card>
        </el-aside>
        <el-main width="70%">
          <!---图表-->
          <el-card>
            <barCharts
              style="height: 35vh"
              v-loading="loadingLine2"
              :timeList="timeListLine2"
              :valueList1="valueList1Line2"
              :valueList2="valueList2Line2"
              :valueList3="valueList3Line2"
              :valueList4="valueList4Line2"
              startTime="2023/01/01"
              endTime="2028/01/01"
              :nameParameter="'2线' + '过车及缺陷数'"
            ></barCharts>
          </el-card>
          <!---图表-->
          <el-card>  <barCharts
              style="height: 35vh"
              v-loading="loadingLineRework2"
              :timeList="timeListLineRework2"
              :valueList1="valueList1LineRework2"
              :valueList2="valueList2LineRework2"
              :valueList3="valueList3LineRework2"
              :valueList4="valueList4LineRework2"
              startTime="2023/01/01"
              endTime="2028/01/01"
              :nameParameter="'2线' + '生产返工'"
            ></barCharts></el-card>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import {
  reqcleanSchedule,
  reqcarsDefectsAndLabel,
  reqcarsDefectsAndCounts,
  reqcarsDefectsAndLabelRework
} from '@/api/dataAna'
import { ref, onMounted, reactive, watch } from 'vue'
import moment from 'moment'
import barCharts from '../echarts/bar.vue'
let dateTimepickUp = ref()
let cleanSchedule = ref()
let carsDefectsAndLabel = ref()
let carsDefectsAndLabelRework = ref()
let query = reactive({
  startTime: '',
  endTime: '',
  //line: 2,
})
let currentRow = ref()
//1线参数
let timeListLine2 = ref<string[]>([])
let valueList1Line2 = ref<number[]>([])
let valueList2Line2 = ref<number[]>([])
let valueList3Line2 = ref<string[]>([]) //carvin
let valueList4Line2 = ref<string[]>([]) //skid
let loadingLine2 = ref(true)
let loadingTabelLine2 = ref<boolean>(true)//表格
let carsDefectsAndCars2 = ref()
let loadingLineRework2 = ref(true)


let timeListLineRework2 = ref<string[]>([])
let valueList1LineRework2 = ref<number[]>([])
let valueList2LineRework2 = ref<number[]>([])
let valueList3LineRework2 = ref<string[]>([]) //carvin
let valueList4LineRework2 = ref<string[]>([]) //skid

//2线参数

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

  GetreqcarsDefectsAndLabel2(2, query.startTime, query.endTime)
  GetreqcarsDefectsAndCounts2(2, query.startTime, query.endTime)
  GetreqcarsDefectsAndLabelRework2(2, query.startTime, query.endTime)
})

const GetreqcleanSchedule = async (line: any) => {
  let result = await reqcleanSchedule(line)
  if (result.code == 200) {
    //必须定义对象
    cleanSchedule.value = result.data
    // console.log(cleanSchedule.value)
    // console.log(cleanSchedule.value.dateTime)
    // console.log(cleanSchedule.value.defects)
    //reactive中用于复制对象
    //Object.assign(cpResult, result.data)
  }
}
const GetreqcarsDefectsAndLabel2 = async (
  line: any,
  time_begin: any,
  time_end: any,
) => {
  loadingLine2.value = true
  let result = await reqcarsDefectsAndLabel(line, time_begin, time_end)
  if (result.code == 200) {
    //必须定义对象
    //carsDefectsAndLabel.value = result.data
    ;(timeListLine2.value = result.data.index),
      (valueList1Line2.value = result.data.defects),
      (valueList2Line2.value = result.data.schedule),
      (valueList3Line2.value = result.data.car),
      (valueList4Line2.value = result.data.skid),
      (loadingLine2.value = false)
  }
}
const GetreqcarsDefectsAndCounts2 = async (
  line: any,
  time_begin: any,
  time_end: any,
) => {
  loadingTabelLine2.value = true
  let result = await reqcarsDefectsAndCounts(line, time_begin, time_end)
  if (result.code == 200) {
    //必须定义对象
    carsDefectsAndCars2.value = result.data.data
    loadingTabelLine2.value = false
  }
}
const GetreqcarsDefectsAndLabelRework2 = async (
  line: any,
  time_begin: any,
  time_end: any,
) => {
  loadingLineRework2.value = true
  let result = await reqcarsDefectsAndLabelRework(line, time_begin, time_end)
  if (result.code == 200) {
    (timeListLineRework2.value = result.data.index),
      (valueList1LineRework2.value = result.data.defects),
      (valueList2LineRework2.value = result.data.schedule),
      (valueList3LineRework2.value = result.data.car),
      (valueList4LineRework2.value = result.data.skid),
      (loadingLineRework2.value = false)
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
  ;(query.startTime = value[0]), (query.endTime = value[1])
}

const search = () => {
  // loading.value = true
  // loadingTabel.value = true
  console.log('=========================')
  console.log(query.startTime)
  GetreqcarsDefectsAndLabel2(2, query.startTime, query.endTime)
  GetreqcarsDefectsAndCounts2(2, query.startTime, query.endTime)
  GetreqcarsDefectsAndLabelRework2(2, query.startTime, query.endTime)
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
  GetreqcarsDefectsAndLabel2(2, query.startTime, query.endTime)
  GetreqcarsDefectsAndCounts2(2, query.startTime, query.endTime)
  GetreqcarsDefectsAndLabelRework2(2, query.startTime, query.endTime)
}
const todaySearch = () => {
  //今天
  query.startTime = moment(shortcuts[0].value()[0]).format(
    'YYYY-MM-DDTHH:mm:ss',
  )
  query.endTime = moment(shortcuts[0].value()[1]).format('YYYY-MM-DDTHH:mm:ss')
  dateTimepickUp.value = [query.startTime, query.endTime]
  GetreqcarsDefectsAndLabel2(2, query.startTime, query.endTime)
  GetreqcarsDefectsAndCounts2(2, query.startTime, query.endTime)
  GetreqcarsDefectsAndLabelRework2(2, query.startTime, query.endTime)
}
const tableRowClassName = ({ rowIndex }: { rowIndex: number }) => {
  return rowIndex % 2 === 0 ? 'even-row' : 'odd-row'
}
const headerCellStyle = () => ({
  backgroundColor: '#e8f3ff',
  color: '#333',
})
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
    GetreqcarsDefectsAndLabel2(2, query.startTime, query.endTime)
    GetreqcarsDefectsAndLabelRework2(2, query.startTime, query.endTime)
  }
}
//用于timeline格式
// const handleCurrentChange = (val: any) => {
//   currentRow.value = val
//   //el_tabel的handleCurrentChange存在bug,会数据变化时激活，因此需要判断是否为空
//   if (currentRow.value) {
//     query.startTime = currentRow.value.index.split(',')[0].substr(1, 19)
//     query.endTime = currentRow.value.index.split(',')[1].substr(1, 19)
//     let t1 = new Date(query.startTime)
//     let t2 = new Date(query.endTime)
//     query.startTime = moment(t1).format('YYYY-MM-DDTHH:mm:ss')
//     query.endTime = moment(t2).format('YYYY-MM-DDTHH:mm:ss')
//     GetreqcarsDefectsAndLabel2(2, query.startTime, query.endTime)
//   }
// }

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
