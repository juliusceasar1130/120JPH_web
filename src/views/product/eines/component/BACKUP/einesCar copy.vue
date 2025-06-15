<template>
  <el-card style="margin: 0px 0px">
    <el-row style="width: 100%">
      <div style="margin-top: 0px">
        <el-radio-group v-model="lineSelect" size="large" @change="changeLine">
          <el-radio
            v-for="(line, index) in Lines"
            :key="index"
            :value="index"
            size="large"
            border
          >
            {{ line[1] }}
          </el-radio>
        </el-radio-group>

        <el-radio-group v-model="radio">
          <el-radio :value="3">Option A</el-radio>
          <el-radio :value="6">Option B</el-radio>
          <el-radio :value="9">Option C</el-radio>
        </el-radio-group>
      </div>
    </el-row>
    <el-row style="width: 100%">
      <el-col :span="6">
        <div style="background-color: blanchedalmond">
          <div>
            <el-tag>{{ positionLast1?.serialNumber }}</el-tag>
            <el-tag>{{ positionLast1?.colorCode }}</el-tag>
            <el-tag>{{ positionLast1?.dateTime }}</el-tag>
            <el-tag>{{ positionLast1?.defectCount }}</el-tag>
          </div>
        </div>
      </el-col>
      <el-col :span="6" style="background-color: blue">
        <div>
          <el-tag>{{ positionLast2?.serialNumber }}</el-tag>
          <el-tag>{{ positionLast2?.colorCode }}</el-tag>
          <el-tag>{{ positionLast2?.dateTime }}</el-tag>
          <el-tag>{{ positionLast2?.defectCount }}</el-tag>
        </div>
      </el-col>
      <el-col :span="6" style="background-color: blanchedalmond">
        <div>
          <el-tag>{{ positionLast3?.serialNumber }}</el-tag>
          <el-tag>{{ positionLast3?.colorCode }}</el-tag>
          <el-tag>{{ positionLast3?.dateTime }}</el-tag>
          <el-tag>{{ positionLast3?.defectCount }}</el-tag>
        </div>
      </el-col>
      <el-col :span="6" style="background-color: blue">
        <div>
          <el-tag>{{ positionLast4?.serialNumber }}</el-tag>
          <el-tag>{{ positionLast4?.colorCode }}</el-tag>
          <el-tag>{{ positionLast4?.dateTime }}</el-tag>
          <el-tag>{{ positionLast4?.defectCount }}</el-tag>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { reqEineshistoryVoLastN } from '@/api/eines/index'
import type { HistoryVo } from '@/api/eines/type'
let recordsLastN = ref<HistoryVo[]>([])
let lineSelect = ref<string>('A')
const radio = ref(3)
//最近第一辆车、第二辆车...
let positionLast1 = ref<HistoryVo>()
let positionLast2 = ref<HistoryVo>()
let positionLast3 = ref<HistoryVo>()
let positionLast4 = ref<HistoryVo>()

//定时器-》刷新
const changeLine = (value: any) => {
  console.log(value)
  //lastRecord(4, n)
}
// 获取最新2条记录
onMounted(() => {
  lastRecord(4, 1)
})
const lastRecord = async (num: number, line: number) => {
  let result = await reqEineshistoryVoLastN(num, line)
  if (result.code == 200) {
    recordsLastN.value = result.data
    positionLast1.value = recordsLastN.value[0]
    positionLast2.value = recordsLastN.value[1]
    positionLast3.value = recordsLastN.value[2]
    positionLast4.value = recordsLastN.value[3]
  }
}
//配置线
let Lines = [
  [1, '1线'],
  [2, '2线'],
  [3, '3线'],
]
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

.carimg {
  height: 100px;
  width: 100px;
  background: url('./image/汽车2.png') no-repeat center;
  background-size: cover;
}
</style>
