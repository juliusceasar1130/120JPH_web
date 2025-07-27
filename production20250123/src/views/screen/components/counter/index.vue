<template>
  <div class="box8">
    <div class="title">
      <p>数据统计</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
//引入图形图表
import * as echarts from 'echarts'
//获取图形图表的DOM节点
let charts = ref()
onMounted(() => {
  //初始化echarts实例
  let mycharts = echarts.init(charts.value)
  let option = {
   title: {
      text: '车辆统计',
      textStyle:{
        color:'white'

      }
   },
   tooltip: {},

  /*  legend: {

      data: ['第一标准', '第二标准', '第三标准'],
      x: "center",
      y: 'bottom',
      textStyle: {
         color: "#333"
      }
   }, */
   color: ['#4c95d9', '#f6731b', '#8cd43f'],
   radar: {
      name: {
         textStyle: {
            //设置颜色
            color: '#fff'
         }
      },
      indicator: [
         { name: 'A7l', max: 6500 },
         { name: 'Tiguan-L', max: 16000 },
         { name: 'ID3', max: 30000 },
         { name: 'ID4', max: 38000 },
         { name: 'ID6', max: 52000 },
         { name: 'Q5', max: 25000 },
         { name: 'TiguanX', max: 12345 }
      ],
      center: ['50%', '50%'],
      radius: "58%"
   },
   series: [{
      name: '',
      type: 'radar',
      itemStyle: {
         normal: {
            splitLine: {
               lineStyle: {

               }
            },
            label: {
               show: false,
               textStyle: {
               },
               formatter: function (params) {
                  return params.value;
               }
            },
         }
      },
      data: [
         {
            value: [2400, 10000, 28000, 35000, 50000, 19000],
            name: '第一标准'
         },
         {
            value: [5000, 14000, 28000, 31000, 42000, 21000],
            name: '第二标准'
         },
         {
            value: [6000, 14000, 18000, 21000, 32000, 11000],
            name: '第三标准'
         }
      ]
   }]
};
  //设置配置项
  mycharts.setOption(option)
})
</script>

<style scoped lang="scss">
.box8 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 20px ;
  .title {
    p {
      color: white;
      font-size: 18px;
    }
  }
  .charts {
    height: calc(100% - 30px);
  }
}
</style>
