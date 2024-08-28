<template>
  <!-- 搜索部分 -->
  <el-card class="base-background">
    <el-form class="el-form-inline">
      <el-form-item style="width: 60%">
        <span class="demonstration"></span>
        <el-date-picker  v-model="dateTimepickUp" type="datetimerange" :shortcuts="shortcuts" range-separator="至"
          start-placeholder="开始时间" end-placeholder="结束时间" @change="datepickup" value-format="YYYY-MM-DDTHH:mm:ss" />
      </el-form-item>

      <el-form-item style="margin-right: 22px;">
        <el-button type="primary" icon="Search" @click="search"></el-button>
        <el-button type="primary" icon="Refresh" @click="reset"></el-button>
        <el-button type="primary" icon="" @click="todaySearch">今天</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <!-- K V 含义对换了 
K:值
V:键
-->
  <el-card style="margin: 5px 0px" >
    <el-space wrap  >
      <el-card v-for="(K, V) in cpResult" :key="K" class="box-card" >
        <template #header  >
          <div class="card-header ">
            <span>{{ V }}</span>
          </div>
        </template>
        <el-space wrap style="display: flex; justify-content: flex-start;">
          <p v-for="(K2, V2) in K" :key="K2" class="text item" >
            <el-badge :value="K2.length-1 " class="item" :hidden="K2.length - 1 == 0" >
              <el-button style="width: 80px;margin-bottom: 5px;" size="big" @click="openTrace(V, V2)">
                <div class="line-item">
                  line: {{ V2 }}
                </div>
              </el-button>
            </el-badge>
          </p>
        </el-space>
      </el-card>
    </el-space>
  </el-card>
</template>
<script setup lang="ts">
import type { AreaAndLineListResponseData, query, cpResult } from './type'
import { reqGetAreaAndLine, reqGetDataByQuery } from '@/api/changePoint'
import { ref, onMounted, reactive, watch,} from 'vue'
import moment from 'moment'
import useTraceStore from '@/views/changePoint/store/trace.ts'
//import router from "./router"
//获取路由对象
import { useRouter } from 'vue-router'
let $router = useRouter()
//引入仓库
let traceStore = useTraceStore()
let areaNum = ref()
let areaAndLineList = ref<AreaAndLineListResponseData>()
let cpResult = ref<any>({})
let dateTimepickUp = ref()
//初始化查询
let query = reactive<query>({
  areaCh: '',
  line: '',
  startTime: '',
  endTime: '',
})
onMounted(() => {
  query.startTime = moment(shortcuts[0].value()[0]).format(
    'YYYY-MM-DDTHH:mm:ss',
  )
  query.endTime = moment(shortcuts[0].value()[1]).format('YYYY-MM-DDTHH:mm:ss')
  dateTimepickUp.value = [query.startTime, query.endTime]
  //获取区域和线路
  GetAreaAndLine()
  //根据区域和线获取数据
  GetDataByQuery(query)
})
//没有用到
const GetAreaAndLine = async () => {
  let result = await reqGetAreaAndLine()
  if (result.code == 200) {
    areaNum.value = result.data.length
    areaAndLineList.value = result.data
  }
}
//用到reqGetDataByQuery接口
const GetDataByQuery = async (query: query) => {
  let result = await reqGetDataByQuery(query)
  if (result.code == 200) {
    //必须定义对象
    cpResult.value = result.data
    //reactive中用于复制对象
    //Object.assign(cpResult, result.data)
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
  ; (query.startTime = value[0]), (query.endTime = value[1]), console.log(query)
}
const search = () => {
  GetDataByQuery(query)
}
const reset = () => {
  //清空Query
  Object.assign(query, {
    areaCh: '',
    line: '',
    startTime: '',
    endTime: '',
  })
  //重新获取数据，上周
  query.startTime = moment(shortcuts[0].value()[0]).format(
    'YYYY-MM-DDTHH:mm:ss',
  )
  query.endTime = moment(shortcuts[0].value()[1]).format('YYYY-MM-DDTHH:mm:ss')
  dateTimepickUp.value = [query.startTime, query.endTime]
  GetDataByQuery(query)
}
const todaySearch = () => {
  //今天
  query.startTime = moment(shortcuts[0].value()[0]).format(
    'YYYY-MM-DDTHH:mm:ss',
  )
  query.endTime = moment(shortcuts[0].value()[1]).format('YYYY-MM-DDTHH:mm:ss')
  dateTimepickUp.value = [query.startTime, query.endTime]
  GetDataByQuery(query)
}
//监视查询Query,复制给仓库的查询条件 开启深度监视
watch(
  () => query,
  () => {
    traceStore.query = query
  },
  { deep: true },
)
const openTrace = (area: any, line: any) => {
  query.areaCh = area
  query.line = line
  $router.push('/cp/trace')
}
/*  */

</script>
<style scoped>
.base-background {
  background-color: #f4f4f5;/* #f4f4f5 */
  padding: 15px;
}
.el-form-inline{
display: flex; 
flex-direction: row;
justify-content: space-between; 
height: 15px;
margin-top: -15px;
}
.box-card {
  background-color: #bae0f0b5;/* #227ba2b5 #1b6585b5  #227ba2 */
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(216, 132, 132, 0.1);/* old    rgba(247, 246, 246, 0.1) */
  margin-top: 0px;
  width: 350px; 
  height: 250px;
}
.item {
  margin-top: 10px;
  margin-right: 30px;
}
.card-header {
  font-size: 24px;
  color: #fff;
  /* text-align: center; */
  /* font-family: Arial, Helvetica, sans-serif; */
  background-color: #227ba2;
  padding:22px 22px ;
  margin:-18px -20px;
/*   padding-top:22px;
  padding-bottom:22px;
  padding-left:22px;
  padding-right:22px; */
 
/*   margin-top: -18px;
  margin-bottom: -18px;
  margin-left: -20px;
  margin-right: -20px; */

}
  .line-item{
    font-size: 16px;
    text-align: center;
    font-family: Arial, Helvetica, sans-serif;
  }
</style>

