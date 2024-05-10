<template>
  <div class="box5">
    <div class="title">
      <p>未来某数据的统计</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <div class="charts" ref="line"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
//获取图形图表的DOM的节点
let line = ref()
onMounted(() => {
  let mycharts = echarts.init(line.value)
  //设置配置项
  mycharts.setOption({
    //标题组件
    title: {
      text: '产量趋势图',
    },
    //X|Y轴
    xAxis: {
      type: 'category', //在X轴上均匀分布
      boundaryGap: false, //坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样。
      splitLine: {
        //是否显示分隔线。默认数值轴显示，类目轴不显示。
        show: false,
      },
      data:['周一','周二','周三','周四','周五','周六','周日']
    },
    yAxis: {
      splitLine: {
        //是否显示分隔线。默认数值轴显示，类目轴不显示。
        show: false,
      },
      //轴的设置
      axisLine:{
        show:true,
      },
      //刻度
      axisTick:{
        show:true,

      }
    },
    //布局
    grid: {
      left: 40,
      top: 0,
      right: 20,
      bottom: 20,
    },
    //系列
    series: [
      {
        type: 'line', //折线图
        data: [120, 240, 45, 90, 123, 345, 90],
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
                color: 'cyan', // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'yellowgreen', // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
      },
    ],
  })
})
</script>

<style scoped lang="scss">
.box5 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 0px 20px;
  .title {
    margin-left: 10px;

    p {
      color: white;
      font-size: 20px;
    }
  }
  .charts {
    height: calc(100% - 40px);
    
  }
}
</style>
