<template>
  <!-- 搜索部分 -->
  <el-card class="base-background">
    <el-form class="el-form-inline">
      <el-form-item style="width: 60%">
        <span class="demonstration"></span>
        <el-date-picker v-model="dateTimepickUp" type="datetimerange" :shortcuts="shortcuts" range-separator="至"
          start-placeholder="开始时间" end-placeholder="结束时间" @change="datepickup" value-format="YYYY-MM-DDTHH:mm:ss" />
      </el-form-item>

      <el-form-item style="margin-right: 22px">
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
  <el-card style="margin: 5px 0px">
    <!-- 新增优先级选择内容 -->
    <el-row :gutter="2" style="width: 70%; justify-content: left; align-items: center">
      <span style="font-size: 16px; margin-left: 6px"></span>
      <el-col v-for="(label, index) in priorityLabels" :key="index" :span="2">
        <el-button class="grid-content col-xs-6 col-sm-6 col-md-6 col-lg-6"
          :style="{ backgroundColor: priorityColors[index] }" :class="{
            'selected-button': selectedPriority === index,
            'shadow-effect': selectedPriority === index
          }" @click="() => selectPriority(index)">
          {{ label }}
        </el-button>
      </el-col>
    </el-row>
    <!--  -->
    <el-space wrap>
      <el-card v-for="(K, V) in cpResult" :key="K" class="box-card">
        <template #header>
          <div class="card-header">
            <span>{{ V }}</span>
          </div>
        </template>
        <el-space wrap style="
            display: flex;
            justify-content: flex-start;
            align-items: center;
          ">
          <p v-for="(K2, V2) in K" :key="K2" class="text item">
            <el-badge :value="K2.length - 1" :hidden="K2.length - 1 === 0" :type="priorityBadge_color">
              <el-button style="width: 75px; margin-bottom: 5px" size="big" @click="openTrace(V, V2)">
                <div class="line-item">line: {{ V2 }}</div>
              </el-button>
            </el-badge>
          </p>
        </el-space>
      </el-card>
    </el-space>
  </el-card>
</template>
<script setup lang="ts">
import type { AreaAndLineListResponseData, query, cpResult } from '@/api/changePoint/type'
import { reqGetAreaAndLine, reqGetDataByQuery } from '@/api/changePoint'
import { ref, onMounted, reactive, watch } from 'vue'
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
  priority: 3 //1级：0；2级：1；3级：2；全部：3
})
let priorityBadge_color=ref()
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
/* const GetAreaAndLine = async () => {
  try {
    const result = await reqGetAreaAndLine();
    if (result.code === 200) { // 使用严格相等
      areaNum.value = result.data.length;
      areaAndLineList.value = result.data;
    }
  } catch (error) {
    console.error("获取区域和线路数据失败:", error);
  }
}; */
const GetAreaAndLine = async () => {
  let result = await reqGetAreaAndLine()
  if (result.code == 200) {
    areaNum.value = result.data.length
    areaAndLineList.value = result.data
  }
}

//用到reqGetDataByQuery接口
/* const GetDataByQuery = async (query: query) => {
  try {
    const result = await reqGetDataByQuery(query);
    if (result.code === 200) { 
      cpResult.value = result.data; // 直接赋值
    }
  } catch (error) {
    console.error("获取数据失败:", error);
  }
}; */
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
// 分类按钮标签和颜色
const priorityLabels = ['一级', '二级', '三级', '全部']
const priorityColors = ['#f56c6c', '#e6a23c', '#67c23a', '#409eff'] // 按钮对应的颜色
const priorityBadge = ['danger', 'warning', 'success', 'primary'] // 小圆点对应的不同type
const selectedPriority = ref<number>(3) // 已选择、默认选择：‘默认全部’

const selectPriority = (index: number) => {
  try {
    selectedPriority.value = index; // 更新选中的优先级
    //根据区域和线获取数据
    query.priority=index
    GetDataByQuery(query)
    //根据优先级获取小圆点的type
    getBadgeType(index)
  } catch (error) {
    console.error("选择优先级时发生错误:", error);
  }
};

// 根据优先级获取小圆点的type
const getBadgeType = (index: number) => {
  priorityBadge_color.value = priorityBadge[index] || 'info' // 默认返回 'info'
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
</style>
