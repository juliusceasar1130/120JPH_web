<template>
  <div class="box2">
    <div class="title">
      <p>车辆比例</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <!-- 放置图形图表的容器 -->
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
//引入echarts图形图表
import * as echarts from 'echarts'
let charts = ref()
//组件挂载完毕初始化图形图表
onMounted(() => {
  let mychart = echarts.init(charts.value)
  //设置配置项
  let option = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      
      right: 30,
      top: 40,
      orient: 'vertical', //图例组件方向的设置
      textStyle:{
        color:'white',
        fontSize:14,
      }
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          position: 'inside',
          color:'white',
        },
       /* 此为放大的效果
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold',
          },
        }, */
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: 'TiguanL' },
          { value: 735, name: 'ID3' },
          { value: 580, name: 'ID4' },
          { value: 484, name: 'Q5' },
          { value: 300, name: 'A7L' },
        ],
      },
    ],
    //调整图形图表的位置
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  }
  mychart.setOption(option)
})
</script>

<style scoped lang="scss">
.box2 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;

  .title {
    margin-left: 20px;
    p {
      color: white;
      font-size: 20px;
    }
  }
  .charts {
    height: 200px;
  }
}
</style>
