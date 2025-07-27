<template>
  <div class="box">
    <div class="chT_box">
      <el-text class="mx-1" style="margin-left: 0.5vw;" v-if="title[0]>0">左{{ '\u0020' }} {{ title[0] }}</el-text>
      <img
        src="./carlayout/right.png"
        style="width: 70%; height: 100%; margin-left: 2vw"
        alt=""
      />
      <el-text class="mx-1" style="margin-right: 0.5vw;" v-if="title[1]>0">右{{ title[1] }}</el-text>
    </div>
    <div class="chB_box">
      <div class="ch2_box">
        <el-text class="mx-1" v-if="title[2]>0">{{ title[2] }}</el-text>
        <img
          src="./carlayout/tailgate.png"
          style="width: 70%; height: 100%; margin-right: -3vw"
          alt=""
        />
      </div>

      <div class="ch1_box">
        <el-text class="mx-1" style='position:relative;top: 4.1vh' v-if="title[3]>0">{{ title[3] }}</el-text>
        <img
          src="./carlayout/roof.png"
          style="width: 100%; height: 76%;margin-left: 0.4vw;margin-top: -4vh"
          alt=""
        />
      </div>
      <div class="ch2_box">
        <img
          src="./carlayout/hood.png"
          style="width: 50%; height: 100%; margin-left: 0vw"
          alt=""
        />
        <el-text class="mx-1" v-if="title[4]>0">{{ title[4] }}</el-text>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps(['title'])
</script>
<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
  //border: 1.5px solid #2626ea;
  //border-radius: 5px;
  display: flex;
  flex-direction: column; /*不写这个也是默认水平*/
  .chT_box {
    text-align: center;

    margin: 1px;

    width: 99.8%;
    height: 15vh;

    background: rgb(164, 220, 241);

    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4vh;
    flex-direction: center;
    line-height: 1.9vh;
    border-radius: 5px;
    //font-weight: bold;
    //border-radius: 10px;
  }
  .chB_box {
    text-align: center;

    margin: 1px 1px;

    width: 100%;
    height: 15vh;

    //background: $base-defect-color;

    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4vh;
    flex-direction: center;
    line-height: 1.9vh;
    justify-content: space-between;

    //font-weight: bold;
    //border-radius: 10px;
    .ch2_box {
      width: 100%;
      height: 100%;
      display: flex;
      text-align: center;
      background-color:rgb(164, 220, 241);//$base-defect-color;
      margin: 1px 1px;
      justify-content: center;
      border-radius: 5px;
    }
    .ch1_box {
      width: 100%;
      height: 100%;
      display: flex;
      text-align: center;
      background: rgb(164, 220, 241);
      margin: 1px 1px;
      justify-content: center;
      flex-direction: column;
      justify-content: center;
      border-radius: 5px;
    }
  }
}
.mx-1 {
  width: 3vw;

  font-size: 4vh;
  line-height: 5vh;
  color: #079bf0;
  //border: 1px solid blue;
  background-color: rgb(247, 250, 242,0.2);
  border-radius: 5px;
  font-weight: bold;
  text-align: center;
  position: relative;
  font-family: Arial, sans-serif;
}
.mx-2 {
  size: 'small';
  font-size: 1.4vh;
  line-height: 1.9vh;
}
.mx-3 {
  size: 'small';
  font-size: 1.4vh;
  line-height: 1.9vh;
}
</style>
