<template>
  <el-card style="margin: 5px 0px">
    <el-row>
      <el-col :span="4">
        <!--车辆信息-->
        <div class="carinfo">
          <div>
            <el-tag size="large" effect="dark" round>
              日期：{{ dateTimeString }}
            </el-tag>
          </div>
          <div>
            <el-tag size="large" effect="dark" round>
              车号：{{ lefcarinfo?.carnumber }}
            </el-tag>
          </div>
          <div>
            <el-tag size="large" effect="dark" round>
              雪橇号：{{ lefcarinfo?.skidnumber }}
            </el-tag>
          </div>
        </div>
      </el-col>
      <el-col :span="16">
        <!--图片布局-->
        <div class="carlayout">
          <!--上部区域-->
          <div class="top">
            <el-result
              :icon="rightrecord == 'good' ? 'success' : 'error'"
            ></el-result>
          </div>
          <!--图片区域-->
          <div class="img"></div>
          <!--下部区域-->
          <div class="bottom">
            <el-result
              :icon="leftrecord == 'good' ? 'success' : 'error'"
            ></el-result>
          </div>
        </div>
      </el-col>
      <el-col :span="4"></el-col>
    </el-row>
  </el-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { reqLine1LastRecord } from '@/api/rockpanel'
import type { lefcarinfo, rightcarinfo } from '@/api/rockpanel/type'
import moment from 'moment'
let leftrecord = ref()
let rightrecord = ref()
let lefcarinfo = ref<lefcarinfo>()
let rightcarinfo = ref<rightcarinfo>()
  let dateTimeString = ref<string>('')
// 获取最新2条记录
onMounted(() => {
  leftrecord.value = ''
  rightrecord.value = ''
  getlastRecord()
})
//分配最新记录
const getlastRecord = async () => {
  const res = await reqLine1LastRecord()
  res.data.forEach((item: any) => {
    if (item.pos === 'L2L') {
      leftrecord.value = item.eva
      lefcarinfo.value = item
      dateTimeString.value = moment(lefcarinfo.value?.date).format(
        'YYYY-MM-DD HH:mm:ss',
      )
    } else if (item.pos === 'L2R') {
      rightrecord.value = item.eva
      rightcarinfo.value = item
    }
  })
}
</script>
<style lang="scss" scoped>
.carlayout {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;

  .img {
    width: 80%;
    height: 300px;
    background: url('../../image/汽车2.png') no-repeat center center;
    background-size: contain;
  }

  .top {
    margin: -40px 0px;
  }

  .bottom {
    margin: -40px 0px;
  }
}

.carinfo {
  position: absolute;
  top: 20px;
  left: 20px;
  display: grid;
  grid-gap: 10px;
  justify-items: start;
}
</style>
