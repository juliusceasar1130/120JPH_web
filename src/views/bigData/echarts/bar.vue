<template>
  <div  class="box5">
    <!-- 图表内容 -->
    <div class="charts" ref="chartRef"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, reactive } from 'vue'
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
  valueList1: {
    type: Array as () => number[],
    required: false,
  },
  valueList2: {
    type: Array as () => number[],
    required: false,
  },
  valueList3: {
    type: Array as () => string[],
    required: false,
  },
  valueList4: {
    type: Array as () => string[],
    required: false,
  },
  startTime: {
    type: String as () => string,
    required: false,
  },
  endTime: {
    type: String as () => string,
    required: false,
  },
  ioitem: {
    type: String as () => string,
    required: false,
  },
  nameParameter: {
    type: String as () => string,
    required: false,
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
let valueList1 = ref()
let valueList2 = ref()
let valueList3 = ref()
let valueList4 = ref()
let maxValue = ref()
let valueListZip = ref()
let valueListZip2 = ref()

function zip(a: any, b: any) {
  return a.map((item: any, index: any) => [item, b[index]])
}

//监听props变化
watch(
  //选择点位变化后，更新参数
  () => props.timeList,
  () => {
    //更新数值
    timeList.value = props.timeList
    valueList1.value = props.valueList1
    valueList2.value = props.valueList2
    valueList3.value = props.valueList3
    valueList4.value = props.valueList4
    console.log('------------------')
    console.log(valueList1.value)
    console.log(valueList2.value)
    console.log('------------------')
    //因为ECHCART的时间连续设置需[[time,120],[]...]格式
    valueListZip.value = zip(timeList.value, valueList1.value)
    valueListZip2.value = zip(timeList.value, valueList2.value)
    updateChart()
    //
    dateTimepickUp.value = [props.startTime, props.endTime]
  },
)
//  computed(() => {
//   maxValue.value = Math.max(...valueList1.value) * 1.2
//   console.log('最大值更新。。。。。。。。。。'+maxValue.value)
// }
// )

onMounted(() => {
  // dateTimepickUp.value = [props.startTime, props.endTime]
  // query.startTime, (query.endTime = props.startTime), props.endTime
  //初始化图标数值
  timeList.value = props.timeList
  valueList1.value = props.valueList1
  //nameList.value = props.nameList
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
        props.nameParameter 
        ,
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
      name: '', //X轴名称
      type: 'time', //category在X轴上均匀分布
      interval: 'auto',
      boundaryGap: false, //坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样。
      splitLine: {
        //是否显示分隔线。默认数值轴显示，类目轴不显示。
        show: false,
      },
      //data: timeList.value, X轴'time'格式下，不需要data,系列里设置数据var data = [[new Date('2023-01-01').getTime(), 120],]
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
      left: 30,
      top: 30,
      right: 30,//  这个参数有点问题
      bottom: 60,
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
        type: 'bar', // 缺陷
        data: valueListZip.value,
        barWidth:'50%',
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
      {
        type: 'bar', //时刻
        data: valueListZip2.value,
        barWidth:'100%',
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
      trigger: 'item',
      backgroundColor: 'rgba(255,255,255,0.8)',
      borderColor: '#ccc',
      borderWidth: 1,
      padding: 10,
      textStyle: {
        color: '#333',
      },
      formatter: (params: any) => {
        let result = '<div style="font-size: 14px;">'
        result += `<div style="margin-bottom: 5px;">                 
                <span>缺陷值: ${params[0].value[1]}</span>                            
               </div>`       
        result += `<div style="margin-bottom: 5px;">                
               <span>车号: ${valueList3.value[params[0].dataIndex]}</span>                
               </div>`
        result += `<div style="margin-bottom: 5px;">                
               <span>雪橇: ${valueList4.value[params[0].dataIndex]}</span>                
               </div>` 
        result += `<div style="margin-bottom: 5px;">          
               <span>${params[0].value[0]}</span>                
               </div>`      
      
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
    valueList1.value = result.data.setPointList
    nameList.value = result.data.nameList    
    timeList.value = result.data.timeList
    maxValue.value = Math.max(...valueList1.value) * 1.2
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
    width: 100%;
    height: 100%;
  }
}
</style>
