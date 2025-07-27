<template>
    <div class="box">
        <div class="top">
            <p class="title">实时车量数统计</p>
            <p class="bg"></p>
            <p class="right">
                可查看总量
                <span>999</span>
                辆
            </p>
        </div>
        <div class="number">
            <span v-for="(item, index) in people" :key="index">{{ item }}</span>
        </div>
        <!-- 盒子将来 echarts 展示图形图标的节点 -->
        <div class="charts" ref="charts">123</div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
let people = ref('216908人')
//引入echarts
import * as echarts from 'echarts'
//水球图拓展插件
import 'echarts-liquidfill'

//组件挂载完毕要获取ref节点  先let charts=ref()
let charts = ref()
onMounted(() => {
    //获取echarts类的实例
    let mycharts = echarts.init(charts.value)
    //设置实例的配置项
    mycharts.setOption({
        //标题组件
        title: {
            text: '水球图',
        },
        //x,y轴组件
        xAxis: {},
        yAxis: {},
        //系列：决定展示什么样的图形图标
        series: {
            type: 'liquidFill', //系列
            data: [0.8, 0.4, 0.2], //展示的数据
            waveAnimation: true, //动画
            animationDuration: 3, //
            animationDurationUpdate: 0,
            radius: '100%',//半径
            outline: {
                show: true,
                borderDistance: 8,
                itemStyle: {
                    color: 'cyan',
                    borderColor: '#294D99',
                    borderWidth: 8,
                    shadowBlur: 20,
                    shadowColor: 'rgba(0, 0, 0, 0.25)',
                },
            },
            /* type:'bar',
        data:[10,20,30,40,50]  柱状图*/
            /* type:'pie',
        data:[10,20,30,40,50]饼图
       */
            /*  type: 'line',
            data: [10, 20, 30, 40, 50] 折线图, */
        },
        //使用布局组件
        grid: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
        },
    })
})
</script>

<style scoped lang="scss">
.box {
    background: url(../../images/dataScreen-main-lb.png) no-repeat;
    background-size: 100% 100%;
    margin-top: 10px;
    .top {
        margin-left: 20px;
        .title {
            color: white;
            font: size 20px;
            left: 20px;
        }
        .bg {
            width: 68px;
            height: 7px;
            background: url(../../images/dataScreen-title.png) no-repeat;
            background-size: 100% 100%;
            margin-top: 10px;
        }
        .right {
            float: right;
            color: white;
            font: size 20px;
            span {
                color: yellowgreen;
            }
        }
    }
    .number {
        margin-top: 30px;
        padding: 10px;
        display: flex;

        span {
            flex: 1;
            height: 40px;
            text-align: center;
            line-height: 40px;
            background: url(../../images/total.png) no-repeat;
            background-size: 100% 100%;
            color: #29fcff;
        }
    }
    .charts {
        width: 100%;
        height: 260px;
    }
}
</style>
