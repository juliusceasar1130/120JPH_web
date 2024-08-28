<template>
  <div class="box5">
    <!-- {{ maxValue }} -->
    <el-card class="box5-card">
      <!-- 筛选部分 -->
      <el-form class="el-form-inline">
        <el-form-item style="margin-top:-15px;margin-left:-15px;">
          <!-- <span class="demonstration"></span> -->
          <el-date-picker v-model="dateTimepickUp" type="datetimerange" :shortcuts="shortcuts" range-separator="至"
            start-placeholder="开始时间" end-placeholder="结束时间" @change="datepickup" value-format="YYYY-MM-DDTHH:mm:ss" />
        </el-form-item>
        <!--  按钮 -->
        <el-form-item style="margin-top:-15px">
          <el-button type="primary" icon="Search" @click="search" style="position: absolute;  right: 20px"></el-button>
          <!-- <el-button type="primary" icon="Refresh" @click="reset"></el-button> -->
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 图表内容 -->
    <div class="charts" ref="chartRef"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, reactive, computed } from 'vue'
import * as echarts from 'echarts'
import { defineProps } from 'vue'
import type { query } from '@/api/changePoint/type'
import { reqIoitemHistoryList } from '@/api/changePoint'
//获取图形图表的DOM的节点
const chartRef = ref(null)
let chartInstance: any = null
//父传子参数
const props = defineProps({
  timeList: {
    type: Array as () => string[],
    required: false,
  },
  valueList: {
    type: Array as () => number[],
    required: false,
  },
  startTime: {
    type: String as () => string,
    required: true,
  },
  endTime: {
    type: String as () => string,
    required: true,
  },
  ioitem: {
    type: String as () => string,
    required: true,
  },
  nameParameter: {
    type: String as () => string,
    required: true,
  },
  nameList: {
    type: String as () => string,
    required: false,
  },
})
let dateTimepickUp = ref<[]>([])
let query = reactive<query>({
  areaCh: '', //不用
  line: '', //不用
  startTime: '',
  endTime: '',
})
let timeList = ref()
let nameList = ref([])
let valueList = ref()
let maxValue = ref()

//监听props变化
watch(
  //选择点位变化后，更新参数
  () => props.ioitem,
  () => {
    //更新数值
    reqDataAndChart()
    //
    dateTimepickUp.value = [props.startTime, props.endTime]

  },
)
//  computed(() => {
//   maxValue.value = Math.max(...valueList.value) * 1.2
//   console.log('最大值更新。。。。。。。。。。'+maxValue.value)
// }
// )

onMounted(() => {
  dateTimepickUp.value = [props.startTime, props.endTime]
  query.startTime, (query.endTime = props.startTime), props.endTime
  //初始化图标数值
  timeList.value = props.timeList
  valueList.value = props.valueList
  nameList.value = props.nameList
  chartInstance = echarts.init(chartRef.value)

  //更新图表
  updateChart()
  //监听窗口大小变化
  window.addEventListener('resize', resizeChart)
})
//销毁
onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart)
  if (chartInstance) {
    chartInstance.dispose()
  }
})
//窗口大小变化
const resizeChart = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}
//更新图表
const updateChart = () => {
  //
  //图标参数
  const Option = {
    //标题组件
    title: {
      text: [
        '{nameParameter|' + props.nameParameter + '}\n\n{ioitem|' + props.ioitem + '}',
      ],
      left: 'center',
      textStyle: {
        // color: 'rgba(204, 9, 230, 1)',
        // fontSize: 20,
        // fontWeight: 'normal',
        // fontStyle: 'normal',
        //fontFamily: 'arial',
        rich: {
          nameParameter: {
            color: 'black',
            fontSize: 22,
            fontWeight: 'normal',
            fontStyle: 'normal',
            fontFamily: 'arial',
          },
          ioitem: {
            color: 'black',
            fontSize: 12,
            fontWeight: 'normal',
            fontStyle: 'normal',
            fontFamily: 'arial',
          },
        },
      },
    },
    //X|Y轴
    xAxis: {
      name: '(时间)', //X轴名称
      type: 'category', //在X轴上均匀分布
      boundaryGap: false, //坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样。
      splitLine: {
        //是否显示分隔线。默认数值轴显示，类目轴不显示。
        show: false,
      },
      data: timeList.value,
      axisLabel: {
        formatter: function (value: string) {
          // 假设 timeList 中的数据是 ISO 日期字符串
          const date = new Date(value)
          return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
        },
      },
      //轴的设置
      axisLine: {
        show: true,
        lineStyle: {
          //color: '#333', // 轴线颜色
          // width: 2, // 轴线宽度
          type: 'solid', // 轴线类型
          opacity: 1, // 轴线透明度
          cap: 'round', // 线帽样式
        },
      },
      //刻度
      axisPointer: {
        show: true,
        lineStyle: {
          color: '#333', // 指示线颜色
          width: 2, // 指示线宽度
          type: 'solid', // 指示线类型
        },
        label: {
          show: false, // 不显示标签
        },
      },
    },
    yAxis: {
      //name: '风机频率(Hz)', //Y轴名称
      type: 'value', //数值轴
      //min: 0, //最小值
      max: maxValue.value, //最大值
      interval: 50, //刻度间隔
      axisLabel: {
        formatter: '{value}', //标签显示格式
        color: '#333', // 标签颜色
      },
      splitLine: {
        //是否显示分隔线。默认数值轴显示，类目轴不显示。
        show: true,
        lineStyle: {
          color: ['#ddd'], // 分隔线颜色
        },
      },
      //轴的设置
      axisLine: {
        show: true,
        lineStyle: {
          color: '#333', // 轴线颜色
        },
      },
      //刻度
      axisTick: {
        show: true,
        lineStyle: {
          color: '#333', // 刻度颜色
        },
      },
    },
    //布局
    grid: {
      left: 80,
      top: 70,
      right: 95,
      bottom: 75,
    },

    //小工具箱
    toolbox: {
      show: true,
      feature: {
        dataZoom: { yAxisIndex: 'none' },
        dataView: { readOnly: false },
        magicType: { type: ['line', 'bar'] },
        //restore: {},
        saveAsImage: {},
      },
    },
    //系列
    series: [
      {
        type: 'line', //折线图
        data: valueList.value,
        //平滑曲线的设置
        smooth: true,
        // 区域填充样式。设置后显示成区域面积图。
        areaStyle: {
          //填充颜色为线性渐变
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#c2ddff', // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#c2ddff', // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
          /*   color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'cyan', // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'yellowgreen', // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          }, */
          //是否显示阴影
        },
      },
    ],
    //提示框
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.8)',
      borderColor: '#ccc',
      borderWidth: 1,
      padding: 5,
      textStyle: {
        color: '#333',
      },
      formatter: (params: any) => {
        let result = '<div style="font-size: 14px;">'
        params.forEach((param: any) => {
          result += `<div style="margin-bottom: 5px;">
                 <span style="color: ${param.color};">●</span>
                 <span>当前值: ${param.value}</span>
               </div>`
          // 新增数据项
          if (param.dataIndex !== undefined) {
            const time = timeList.value[param.dataIndex]
            const name = nameList.value[param.dataIndex]
            const formattedTime = new Date(time).toLocaleString()
            result += `<div>修改者：${name}<\div>
                       时间: ${formattedTime} `
          }
        })
        result += '</>'
        return result
      },
    },
    //数据缩放
    dataZoom: [
      {
        type: 'slider',
        show: true,
        xAxisIndex: [0],
        start: 0,
        end: 200,
      },
      /*    {
           type: 'slider',
           show: true,
           yAxisIndex: [0],
           left: '94%',
           start: 1,
           end: 500,
         }, */
      {
        type: 'inside',
        xAxisIndex: [0],
        start: 0,
        end: 200,
      },
      /*     {
            type: 'inside',
            yAxisIndex: [0],
            start: 29,
            end: 36,
          }, */
    ],
  }
  chartInstance.setOption(Option)
}

//选取时间
const datepickup = (value: string[]) => {
  query.startTime = value[0]
  query.endTime = value[1]
}
//
const search = () => {
  reqDataAndChart()

}

const reqDataAndChart = async () => {
  const result = await reqIoitemHistoryList(props.ioitem, query)
  if (result.code === 200) {
    valueList.value = result.data.setPointList
    nameList.value=result.data.nameList
    console.log("------------------------------")
    console.log(result.data.nameList)
    timeList.value = result.data.timeList
    maxValue.value = Math.max(...valueList.value) * 1.2
    updateChart()
  }
}
</script>

<style scoped lang="scss">
.box5 {
  width: 100%;
  height: 100%;

  background-size: 100% 100%;


  .box5-card {
    width: 100%;
    background-color: #f4f4f5;
    margin-top: 10px;
    margin-bottom: 15px;
    height: 45px;

  }

  .el-form-inline {
    display: flex;
    flex-direction: row;
    justify-content: space-between;


  }

  .title {
    margin-left: 0px;
    margin-top: 0px;
    display: flex;
    justify-content: right;

    .title1 {
      margin-right: 5px;
    }

    p {
      color: white;
      font-size: 20px;
    }
  }

  .charts {
    width: 75vw;
    height: 65vh;
  }
}
</style>
