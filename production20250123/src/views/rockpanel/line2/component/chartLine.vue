<template>
  <el-card style="margin: 5px 0px">
    <!--搜索部分-->
    <el-card>
      <el-form inline>
        <el-form-item style="width: 70%">
          <span class="demonstration"></span>
          <el-date-picker
            v-model="dateTimepickUp"
            type="datetimerange"
            :shortcuts="shortcuts"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @change="datepickup"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="search"></el-button>
          <el-button type="primary" icon="Refresh" @click="reset"></el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <div class="box2">
        <!-- 放置图形图表的容器 -->
        <div class="chartsL" ref="lineLeft"></div>
        <div class="chartsR" ref="lineRight"></div>
      </div>
    </el-card>
  </el-card>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { reqLine2AvgValueHour } from '@/api/rockpanel'
import * as echarts from 'echarts'
import { rockPanelDto } from '@/api/rockpanel/type'
import { ElMessage } from 'element-plus'
import moment from 'moment'

//获取图形图表的DOM的节点
let lineLeft = ref()
let lineRight = ref()
let dateTimepickUp = ref()
let query = reactive<rockPanelDto>({
  skidNumber: '',
  carType: '',
  carNumber: '',
  eva: '',
  startTime: '',
  endTime: '',
  //orderBy: { prop: '', order: '' },
})

//测试数据
// let usechartDataL = chartDataL
// let usechartDataR = chartDataR
//console.log(usechartData)

onMounted(async () => {
  query.startTime = moment(shortcuts[2].value()[0]).format('YYYY-MM-DD')
  query.endTime = moment(shortcuts[2].value()[1]).format('YYYY-MM-DD')
  dateTimepickUp.value = [query.startTime, query.endTime]
  //左侧图标
  leftLineChart()
  //右侧趋势图
  rightLineChart()
})

const leftLineChart = async () => {
  let resultLeft = await reqLine2AvgValueHour('L2L', query)
  chart(resultLeft, lineLeft.value, '左侧分布')
}
const rightLineChart = async () => {
  let resultRingt = await reqLine2AvgValueHour('L2R', query)
  chart(resultRingt, lineRight.value, '右侧分布')
}

const chart = (result: any, chart: any, title: string) => {
  if (result.code === 200) {
    console.log('----------------------///')
    const xValues = result.data.x
    const yValues = result.data.series
    let mycharts = echarts.init(chart)
    let option = {
      //标题组件
      title: {
        text: title,
        top: '10',
        left: 'center',
      },
      legend: {
        show: true,
        left: 30,
        right: 0,
        bottom: 35,
        //orient: 'horizontal',

        align: 'auto',
        // padding: 5,
        // itemGap: 10,
        // itemWidth: 20,
        // itemHeight: 10,

        data: Object.keys(result.data.series),
      },
      //X|Y轴
      xAxis: {
        type: 'category', //在X轴上均匀分布
        boundaryGap: false, //坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样。
        name: '（时间）',
        splitLine: {
          //是否显示分隔线。默认数值轴显示，类目轴不显示。
          show: true,
        },
        data: xValues,
        
        
      },
      yAxis: {
        splitLine: {
          //是否显示分隔线。默认数值轴显示，类目轴不显示。
          show: true,
        },
        name: '（厘米）',
        //轴的设置
        axisLine: {
          show: true,
        },
        //刻度
        axisTick: {
          show: 1,
        },
        data: ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19'],
      },
      //布局
      grid: {
        left: 40,
        top: 60,
        right: 20,
        bottom: 90,
        height: 250,
        width: 400,
        containLabel: true, //grid 区域是否包含坐标轴的刻度标签。
      },
      //系列
      series: [
        {
          name: '5点-7点',
          type: 'line', //折线图
          data: yValues['5点-7点'], // 使用随机数据
          //平滑曲线的设置
          smooth: false,
        },
        {
          name: '7点-9点',
          type: 'line', //折线图
          data: yValues['7点-9点'], // 使用随机数据
          //平滑曲线的设置
          smooth: false,
        },
        {
          name: '9点-11点',
          type: 'line', //折线图
          data: yValues['9点-11点'], // 使用随机数据
          //平滑曲线的设置
          smooth: false,
        },
        {
          name: '11点-13点',
          type: 'line', //折线图
          data: yValues['11点-13点'], // 使用随机数据
          //平滑曲线的设置
          smooth: false,
        },
        {
          name: '13点-15点',
          type: 'line', //折线图
          data: yValues['13点-15点'], // 使用随机数据
          //平滑曲线的设置
          smooth: false,
        },
        {
          name: '15点-17点',
          type: 'line', //折线图
          data: yValues['15点-17点'], // 使用随机数据
          //平滑曲线的设置
          smooth: false,
        },
      ],
      tooltip: {
        //提示框
        backgroundColor: 'rgba(50,50,50,0.9)',
      },
    }
    //设置配置项
    mycharts.setOption(option)
  } else {
    ElMessage.error('获取数据失败')
  }
}
const search = async () => {
  //左侧图标
  leftLineChart()
  //右侧趋势图
  rightLineChart()
}
const reset = () => {
  Object.assign(query, {
    skidNumber: '',
    carType: '',
    carNumber: '',
    eva: '',
    startTime: '',
    endTime: '',
    //orderBy: { prop: '', order: '' },不用
  })
  //清空时间pickup
  query.startTime = moment(shortcuts[2].value()[0]).format('YYYY-MM-DD')
  query.endTime = moment(shortcuts[2].value()[1]).format('YYYY-MM-DD')
  dateTimepickUp.value = [query.startTime, query.endTime] 
  //左侧图标
  leftLineChart()
  //右侧趋势图
  rightLineChart()
}
//时间选择器
const shortcuts = [
  {
    text: '今天',
    value: () => {
      const end = new Date()
      const start = new Date()
      end.setTime(start.getTime() + 3600 * 1000 * 24 * 1)
      return [start, end]
    },
  },
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
  ;(query.startTime = value[0]), (query.endTime = value[1]), console.log(value)
}


</script>
<style scoped lang="scss">
.box2 {
  //width: 100%;
  //height: 100%;
  border-radius: 10px;
  display: flex;
  height: 50%;
  width: 100%;
  //background: hwb(124 81% 3%);
  //justify-content: left; /* 水平居中 */
  background-size: cover;
  justify-content: center;

  //align-items: center;
  //justify: 'space-around';
  .chartsL {
    flex: 1;
    /* 使得三个div均等分，占据相同的宽度 */
    margin-left: 20px;
    margin-top: 30px;
    margin-right: 50px;
   // border: 1px solid #02268a;
    border-radius: 10px;
    float: left;
    width: 33vw;
    height: 57vh;
    //left: 5px;
    background: rgb(234, 250, 230);
    background-size: cover;
  }

  .chartsR {
    flex: 1;
    /* 使得三个div均等分，占据相同的宽度 */
    margin-left: 20px;
    margin-top: 30px;
    margin-right: 50px;
   // border: 1px solid #02268a;
    border-radius: 10px;
    float: left;
    width: 33vw;
    height: 57vh;
    //left: 5px;
    background: rgb(242, 253, 239);
    background-size: cover;
  }

  .charts {
    width: 400px;
    height: 400px;
  }
}
</style>
