<template>
  <div class="box4" ref="map">我是地图组件</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
//引入中国地图的josn数据
import chinaJSON from './china.json'
import { reduce } from 'lodash'
//获取dom 元素
let map = ref()
//注册中国地图
echarts.registerMap('china', chinaJSON as any)

onMounted(() => {
  //初始化
  let mychart = echarts.init(map.value)
  //设置配置项
  mychart.setOption({
    //地图的组件
    geo: {
      map: 'china', //中国地图
      roam: true, //鼠标缩放的功能效果
      //地图的位置调试
      left: 50,
      right: 50,
      top: 100,
      bottom: 50,
      //地图上的文字的设置
      label: {
        show: true, //文字显示出来
        color: 'white',
        fontSize: 12,
      },

      itemStyle: {
        //每一个多边形的样式
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
              color: 'blue', // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
        opacity: 0.9,
      },
      //地图高亮的效果
      emphasis: {
        itemStyle: {
          color: 'red',
        },
        label: {
          fontSize: 30,
        },
      },
    },

    //布局位置
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
    //添加新的系列
   
  })
})
</script>

<style scoped lang="scss"></style>


