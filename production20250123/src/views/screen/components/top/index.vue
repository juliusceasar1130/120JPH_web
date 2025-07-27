<template>
    <div class="top">
        <div class="left">
            <span class="lbtn" @click="goHome">首页</span>
        </div>
        <div class="center">
            <div class="title">120油漆可视化数据平台</div>
        </div>
        <div class="right">
            <span class="rbtn">统计报告</span>
            <span class="time">当前时间:{{ time }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
//引入时间moment
import moment from 'moment'
//点击首页按钮回到首页
import { useRouter } from 'vue-router'
import { RefSymbol } from '@vue/reactivity';
//获取路由器对象
let $router = useRouter()
//存储当前时间
let time = ref(moment().format('YYYY年MM月DD日 hh:mm:ss'))
let timer = ref('number')
//按钮的点击的回调
const goHome = () => {
    $router.push('./home')
}
//组件挂载完毕后，实时更新当前时间
onMounted(() => {
    timer.value = setInterval(() => {
        time.value = moment().format('YYYY年MM月DD日 hh:mm:ss')
    }, 1000)
})
onBeforeUnmount(() => {
    clearInterval(timer.value)
})
</script>

<style scoped lang="scss">
.top {
    width: 100%;
    height: 40px;
    display: flex;
    .left {
        flex: 1.5;
        background: url(../../images/dataScreen-header-left-bg.png) no-repeat;
        background-size: cover;
        .lbtn {
            width: 150px;
            height: 40px;
            float: right; /* 浮动到右面 */
            background: url(../../images/dataScreen-header-btn-bg-l.png)
                no-repeat;
            background-size: 100% 100%;
            text-align: center;
            line-height: 40px;
            color: #29fcff;
            font-size: 20px;
        }
    }
    .center {
        flex: 2;

        .title {
            width: 100%;
            height: 74px;
            float: left;
            background: url(../../images/dataScreen-header-center-bg.png)
                no-repeat;
            background-size: 100% 100%;
            text-align: center;
            line-height: 74px;
            color: #29fcff;
            font-size: 30px;
        }
    }
    .right {
        flex: 1.5;
        background: url(../../images/dataScreen-header-left-bg.png) no-repeat;
        background-size: cover;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .rbtn {
            width: 150px;
            height: 40px;
            float: left; /* 浮动到右面 */
            background: url(../../images/dataScreen-header-btn-bg-r.png)
                no-repeat;
            background-size: 100% 100%;
            text-align: center;
            line-height: 40px;
            color: #29fcff;
            font-size: 20px;
        }
        .time {
            color: #29fcff;
            margin-right: 0px;
            font-size: 20px;
        }
    }
}
</style>
