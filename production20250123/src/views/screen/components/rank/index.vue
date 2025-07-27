<template>
  <div class="box6">
    <div class="title">
      <p>车型产量排行</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <!-- 图形图表容器 -->
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import useCategoryStore from '@/store/modules/category'
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
//获取DOM节点
let charts = ref()
//组件挂载完毕，初始化
onMounted(() => {
  //一个容器可以展示多种类型的图形图表
  let mycharts = echarts.init(charts.value)
  //设置配置项
  mycharts.setOption({
    //标题组件
    title: {
      //主标题
      text: '车辆比例排行',
      link: 'http://www.baidu.com',
      //标题的位置
      left: '40%',
      //主标题文字样式
      textStyle: {
        color: 'yellowgreen',
        frontSize: 20,
      },
      //子标题
      subtext: '各车辆的排行',
      //子标题的样式
      subtextStyle: {
        color: 'yellowgreen',
        fontStyle: 16,
      },
    },
    //X|Y轴组件
    xAxis: {
      type: 'category', //x轴上均匀分布
    },
    yAxis: {},
    grid: {
      left: 20,
      bottom: 20,
      right: 20,
    },
    //系列：决定图形图表是哪一种的
    series: [
      {
        type: 'bar',
       
        data: [10, 20, 50, 30, 10, 90, 50],
        //柱状图的：图形上的文本标签
        label: {
          show: true,
          //文字的位置
          position: 'insideTop',
          //文字的颜色
          color: 'yellowgreen',
        },
        //是否显示柱条的背景色。通过 backgroundStyle 配置背景样式。
        showBackground: true,
        backgroundStyle: {
          //底部背景的颜色
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'black', // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'blue', // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
          //柱条的样式
         
        },
        itemStyle:{
            borderRadius: [10, 10, 0, 0],
            //柱条颜色
            //color:'cyan',
            color:function(data:any){
              //给每一个柱条设置背景颜色
              let arr=['red','orange','yellowgreen','green','cyan','blue','purple',]
              //返回颜色
              return arr[data.dataIndex]
            }
          }
      },
      {
        type:'line',
        data:[10,30,40,24,78,89,90],
        smooth:true,//平滑曲线
      }
    ],
    tooltip:{            //提示框
      backgroundColor:'rgba(50,50,50,0.9)'

    }
  })
})
</script>

<style scoped lang="scss">
.box6 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 20px 0px;
  .title {
    margin-left: 20px;

    p {
      color: white;
      font-size: 20px;
    }
  }
  .charts {
    height: calc(100% - 30px);
  }
}
</style>
