<template>
  <div class="box7">
    <div class="title">
      <p>处理信息</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

import * as echarts from 'echarts'

let charts = ref()

var colors = [
  {
    type: 'linear',
    x: 0,
    x2: 1,
    y: 0,
    y2: 0,
    colorStops: [
      {
        offset: 0,
        color: 'rgba(0, 74, 121, 1)',
      },
      {
        offset: 0.5,
        color: 'rgba(0, 74, 121, 1)',
      },
      {
        offset: 0.5,
        color: 'rgba(0, 104, 171, 1)',
      },
      {
        offset: 1,
        color: 'rgba(0, 104, 171, 1)',
      },
    ],
  },
  {
    type: 'linear',
    x: 0,
    x2: 1,
    y: 0,
    y2: 0,
    colorStops: [
      {
        offset: 0,
        color: 'rgba(114, 213, 222, 1)',
      },
      {
        offset: 0.5,
        color: 'rgba(114, 213, 222, 1)',
      },
      {
        offset: 0.5,

        color: 'rgba(78, 169, 177, 1)',
      },
      {
        offset: 1,
        color: 'rgba(78, 169, 177, 1)',
      },
    ],
  },
  {
    type: 'linear',
    x: 0,
    x2: 1,
    y: 0,
    y2: 0,
    colorStops: [
      {
        offset: 0,
        color: 'rgba(125, 97, 163, 1)',
      },
      {
        offset: 0.5,
        color: 'rgba(125, 97, 163, 1)',
      },
      {
        offset: 0.5,

        color: 'rgba(156, 136, 184, 1)',
      },
      {
        offset: 1,
        color: 'rgba(156, 136, 184, 1)',
      },
    ],
  },
]
var renderItem = function (params, api) {
  var yValue = api.value(1)
  var start = api.coord([api.value(0), yValue])
  var size = api.size([api.value(1) - api.value(0), yValue])
  var style = api.style()

  var width = size[0] * 0.8
  var x = start[0] - width / 2
  var y = start[1]

  var bottomHeight = 20

  var points = [[x + width / 2, y]]

  points.push([x, size[1] + y])

  points.push([x + width / 2, size[1] + y + bottomHeight])

  points.push([x + width, size[1] + y])

  var group = {
    type: 'group',
    children: [
      {
        z2: 3,
        type: 'polygon',
        shape: {
          points: points,
        },
        style: style,
      },
    ],
  }

  return group
}

onMounted(() => {
  let mycharts = echarts.init(charts.value)

  mycharts.setOption({
    backgroundColor: '#020F37',
    xAxis: {
      data: ['已处理', '处理中', '未处理'],
      offset: 80,
      axisLabel: {
        color: '#ffffff',
        fontSize: 24,
      },
      splitLine: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: [
      {
        show: false,
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },

        axisLabel: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
    ],
    grid: {
      left: '10%',
      right: '10%',
      bottom: '30%',
      top: '35%',
      containLabel: true,
    },
    series: [
      {
        type: 'custom',
        itemStyle: {
          color: function (params) {
            return colors[params.dataIndex]
          },
        },

        label: {
          show: true,
          position: 'top',
          color: '#ffffff',
          fontSize: 36,
          fontWeight: 'bold',
        },
        data: [15, 8, 12],
        renderItem: renderItem,
      },
    ],
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
