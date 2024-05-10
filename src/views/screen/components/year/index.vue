<template>
  <div class="box7">
    <div class="title">
      <p>年度产量对比</p>
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
  //设置配置项
  mycharts.setOption({
    title: {
      text: '散点图',
      left: '40%',
      textStyle: {
        color: 'yellow',
      },
    },
    xAxis: {
      type: 'category',
      show: true,
    },
    yAxis: {
      show: false,
    },
    grid: {
      left: 20,
      right: 0,
      top: 20,
      bottom: 20,
    },
    series: {
      type: 'scatter',
      data: [20, 30, 45, 90, 342, 45, 23, 90, 56, 45, 32, 78, 342, 60],

      //标记的图形。
      symbol: 'arrow',
      symbolSize: 10,
      //图文标签
      label: {
        show: true,
        position: 'top',
        color: 'red',
      },
      //散点图标记的颜色
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'red', // 0% 处的颜色
            },
            {
              offset: 1,
              color: 'blue', // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
      },
    },
  })
})
</script>

<style scoped lang="scss">
.box7 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 20px 0;
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
