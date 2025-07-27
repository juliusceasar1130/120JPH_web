<template>
  <div class="container">
    <div class="h1">
      <h1 class="title">面漆一线缺陷检测图示</h1>
    </div>

    <div class="container1" ref="screen">
      <div class="left">
        <div class="left1"></div>
      </div>
      <div class="middle">
        <div class="top">top</div>
        <div class="middle1">middle1</div>
        <div class="bottom">bottom</div>
      </div>
      <div class="right">right</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
//获取数据大屏展示内容盒子的DOM元素
let screen = ref()
onMounted(() => {
  screen.value.style.transform = `scale(${getScale()}) translate(0%,0%)` //画面一挂载就缩放画面
})
//定义大屏缩放的比例
function getScale(w = 1920, h = 1080) {
  const ww = window.innerWidth / w
  const wh = window.innerHeight / h
  return ww < wh ? ww : wh
}
//监听视口的变化
window.onresize = () => {
  screen.value.style.transform = `scale(${getScale()}) translate(0%,0%)`
}
</script>

<style scoped lang="scss">
.container {
  //position: fixed;
  position: absolute;
  //   top: 0px;
  //   left: 0px;
  //width: calc(100% - $base-menu-width);
  width: 100%;
  height: 100%;
  //height: calc(100% - $base-tabbar-height);
  background: rgb(248, 205, 205);
  flex-direction: column;

  //background-size: cover;
  //   display: flex;
  .h1 {
    width: 100%;
    height: calc((100% - $base-tabbar-height) / 8);
    .title {
      color: rgb(255, 255, 255);
      font-size: 60px;
    }
  }

  .container1 {
    position: absolute;
    display: flex;
    width: 100%;
    height: 100%;
    background: rgb(184, 166, 238);
    //background-size: 100% 100%;
    //overflow: hidden;
    margin: 10px 10px;
    background-size: contain;
    //position: absolute;
    // left: 50%;
    //top: 50%;
    //transform: translate(100%, 100%);
    // width: 1735px;
    // height: 1030px;
    // left: 50%;
    // top: 50%;
    transform-origin: left top;
    .left {
      flex: 1;
      width: 100%;
      height: 100%;

      .left1 {
        width: 100%;
        height: 100%;
        background: url(./carlayout/left.bmp) no-repeat;
        //background-size: 100% 100%;
        background-size: contain;
        align-items: center; /* 垂直居中 */
        // justify-content: center; /* 水平居中 */
      }
      //margin: 50px 50px;
      //padding: 100px 100px;
    }
    .middle {
      display: flex; //开启弹性格
      flex-direction: column; //竖着排列
      flex: 1.1;
      background: rgb(161, 137, 137);
      background-size: cover;

      .top {
        flex: 1.1;
        justify-content: center; /* 水平居中 */
        background: rgb(104, 190, 168);

        background: url(./carlayout/hood.bmp) no-repeat;
        background-size: 100% 100%;
        background-size: contain;
      }
      .middle1 {
        flex: 1.1;
        background: rgb(183, 106, 161);
        background: url(./carlayout/roof.bmp) no-repeat;
        background-size: 100% 100%;
        background-size: contain;
        justify-content: center; /* 水平居中 */
      }
      .bottom {
        flex: 1.7;
        background: rgb(123, 164, 146);
        background: url(./carlayout/tailgate.bmp) no-repeat;
        background-size: 100% 100%;
        background-size: contain;
        justify-content: center; /* 水平居中 */
      }
    }
    .right {
      flex: 1.3;
      background: rgb(217, 212, 157);
      background: url(./carlayout/right.bmp) no-repeat;
      background-size: 100% 100%;
      background-size: contain;
      justify-content: center; /* 水平居中 */
    }
  }
}
</style>
