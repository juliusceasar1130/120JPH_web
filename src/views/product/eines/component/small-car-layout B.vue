<template>
  <div class="box">
    <div class="chT_box">
      <img
        src="./carlayout/right.png"
        style="width: 70%; height: 100%;margin-left: 2vw;"
        alt=""
      />
    </div>
    <div class="chB_box">
      <div class="ch2_box">
        <img
        src="./carlayout/tailgate.png"
        style="width: 70%; height: 100%;margin-right: -6vw;"
        alt=""
      />
      </div>
      <div class="ch2_box">
        <img
        src="./carlayout/roof.png"
        style="width: 70%; height: 70%;margin-top: 2vh;"
        alt=""
      />
      </div>
      <div class="ch2_box">
        <img
        src="./carlayout/hood.png"
        style="width: 50%; height: 100%;margin-left:-4vw ;"
        alt=""
      />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
  border: 1.5px solid #b3b3f9;
  display: flex;
  flex-direction: column; /*不写这个也是默认水平*/
  .chT_box {
  text-align: center;

  margin: 1px 1px;

  width:100%;
  height: 15vh;

  background: $base-defect-color;

  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4vh;
  flex-direction: center;
  line-height: 1.9vh;

  
  //font-weight: bold;
  //border-radius: 10px;
}
.chB_box {
  text-align: center;

  margin: 1px 1px;

  width:100%;
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
  
  text-align: center;
  background:$base-defect-color;
  margin: 1px 1px;
  justify-content: space-between;
}
}
}


</style>
