<template>
  <el-card style="margin: 0px 0px">
    <el-row style="width: 100%">
      <div
        style="margin-top: 0px; display: flex; justify-content: space-between"
      >
        <el-radio-group v-model="lineSelect" size="large" @change="changeLine">
          <el-radio
            v-for="(line, index) in transformedLines"
            :key="index"
            :label="index"
            size="large"
            border
          >
            {{ line.label }}
          </el-radio>
        </el-radio-group>
        <div class="time">当前时间：{{ time }}</div>
      </div>
    </el-row>
    <!-- ***4******
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
    </el-row>***********
   -->
    <!--     <el-row style="width: 100%">
      <el-col :span="6">
        <div style="background-color: blanchedalmond">
          <div>
            <div>
              <img
                src="./汽车2.png"
                alt=""
                style="display: absolute; width: 21vw; height: auto"
              />
            </div>
            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                margin-left: 5vw;
              "
            >
              <el-tag>车身号：{{ 78123456784356 }}</el-tag>
              <el-tag>颜色： {{ '0Q0Q' }}</el-tag>
              <el-tag>时间：{{ '2024/05/11  12:12:12' }}</el-tag>
              <el-tag style="font-size: 0.8vw; color: red">
                缺陷数量:{{ 10 }} 个
              </el-tag>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6" style="background-color: blue">
        <div>
          <div>
            <img
              src="./汽车2.png"
              alt=""
              style="display: absolute; width: 21vw; height: auto"
            />
          </div>
          <div
            style="
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              margin-left: 5vw;
            "
          >
            <el-tag>车身号：{{ 78123456784356 }}</el-tag>
            <el-tag>颜色： {{ '0Q0Q' }}</el-tag>
            <el-tag>时间：{{ '2024/05/11  12:12:12' }}</el-tag>
            <el-tag style="font-size: 0.8vw; color: red">
              缺陷数量:{{ 10 }} 个
            </el-tag>
          </div>
        </div>
      </el-col>
      <el-col :span="6" style="background-color: blanchedalmond">
        <div>
          <div>
            <img
              src="./汽车2.png"
              alt=""
              style="display: absolute; width: 21vw; height: auto"
            />
          </div>
          <div
            style="
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              margin-left: 5vw;
            "
          >
            <el-tag>车身号：{{ 78123456784356 }}</el-tag>
            <el-tag>颜色： {{ '0Q0Q' }}</el-tag>
            <el-tag>时间：{{ '2024/05/11  12:12:12' }}</el-tag>
            <el-tag style="font-size: 0.8vw; color: red">
              缺陷数量:{{ 10 }} 个
            </el-tag>
          </div>
        </div>
      </el-col>
      <el-col :span="6" style="background-color: blue">
        <div>
          <div>
            <img
              src="./汽车2.png"
              alt=""
              style="display: absolute; width: 21vw; height: auto"
            />
          </div>
          <div
            style="
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              margin-left: 5vw;
            "
          >
            <el-tag>车身号：{{ 78123456784356 }}</el-tag>
            <el-tag>颜色： {{ '0Q0Q' }}</el-tag>
            <el-tag>时间：{{ '2024/05/11  12:12:12' }}</el-tag>
            <el-tag style="font-size: 0.8vw; color: red">
              缺陷数量:{{ 10 }} 个
            </el-tag>
          </div>
        </div>
      </el-col>
    </el-row> -->

    <!-- 3 -->
    <!--   <el-row style="width: 100%; align-content: space-between">
      <el-col :span="8">
        <div style="background-color: blanchedalmond; height: 29vh">
          <div
            style="display: flex; flex-direction: column; align-items: center"
          >
            <img
              src="./汽车2.png"
              alt=""
              style="
                display: absolute;
                width: 29.5vw;
                height: auto;
                margin-left: -0.5vw;
              "
            />
            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                margin-left: 4vw;
                margin-top: -21vh;
                background-size: cover;
              "
            >
              <el-tag>车身号：{{ 78123456784356 }}</el-tag>
              <el-tag>颜色： {{ '0Q0Q' }}</el-tag>
              <el-tag>时间：{{ '2024/05/11  12:12:12' }}</el-tag>
              <el-tag style="font-size: 0.8vw; color: red">
                缺陷数量:{{ 10 }} 个
              </el-tag>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8" style="background-color: blue">
        <div>
          <div>
            <img
              src="./汽车2.png"
              alt=""
              style="
                display: absolute;
                width: 29.5vw;
                height: auto;
                margin-left: -0.5vw;
              "
            />
          </div>
          <div
            style="
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              margin-left: 11vw;
              margin-top: -21vh;
            "
          >
            <el-tag>车身号：{{ 78123456784356 }}</el-tag>
            <el-tag>颜色： {{ '0Q0Q' }}</el-tag>
            <el-tag>时间：{{ '2024/05/11  12:12:12' }}</el-tag>
            <el-tag style="font-size: 0.8vw; color: red">
              缺陷数量:{{ 10 }} 个
            </el-tag>
          </div>
        </div>
      </el-col>
      <el-col :span="8" style="background-color: blanchedalmond">
        <div>
          <div>
            <img
              src="./汽车2.png"
              alt=""
              style="
                display: absolute;
                width: 29.5vw;
                height: auto;
                margin-left: -0.5vw;
              "
            />
          </div>
          <div
            style="
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              margin-left: 11vw;
              margin-top: -21vh;
            "
          >
            <el-tag>车身号：{{ 78123456784356 }}</el-tag>
            <el-tag>颜色： {{ '0Q0Q' }}</el-tag>
            <el-tag>时间：{{ '2024/05/11  12:12:12' }}</el-tag>
            <el-tag style="font-size: 0.8vw; color: red">
              缺陷数量:{{ 10 }} 个
            </el-tag>
          </div>
        </div>
      </el-col>
    </el-row> -->
    <!-- ************************ -->
    <hr />
    <!-- *****n****** -->
    <el-row>
      <el-col :span="8">
        <div class="grid-content">
          <p style="font-size: 2vh;margin: 5px 0px;">最新第1台</p>
          <p style="color: red; font-size: 5vh;font-weight: bold;margin: 5px 0px;" >
            车型:{{ modelMap(positionLast1?.model) }} 
          </p>
          <el-tag size= large style="margin: 5px 0px;">车身号：{{ positionLast1?.serialNumber }}</el-tag>
          <el-tag size= large style="margin: 5px 0px;">颜色： {{ positionLast1?.colorCode }}</el-tag>
          <el-tag size= large style="margin: 5px 0px;">时间：{{ positionLast1?.dateTime }}</el-tag>
          <p style="color: red; font-size: 5vh;font-weight: bold;margin: 5px 0px;">
            缺陷总数量:{{ positionLast1?.defectCount }} 个
          </p>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content">
          <p style="font-size: 2vh;margin: 5px 0px;">最新第2台</p>
          <p style="color: red; font-size: 5vh;font-weight: bold;margin: 5px 0px;" >
            车型:{{ modelMap(positionLast2?.model) }} 
          </p>
          <el-tag size= large style="margin: 5px 0px;">车身号：{{ positionLast2?.serialNumber }}</el-tag>
          <el-tag size= large style="margin: 5px 0px;">颜色： {{ positionLast2?.colorCode }}</el-tag>
          <el-tag size= large style="margin: 5px 0px;">时间：{{ positionLast2?.dateTime }}</el-tag>
          <p style="color: red; font-size: 5vh;font-weight: bold;margin: 5px 0px;">
            缺陷总数量:{{ positionLast2?.defectCount }} 个
          </p>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content">
          <p style="font-size: 2vh;margin: 5px 0px;">最新第3台</p>
          <p style="color: red; font-size: 5vh;font-weight: bold;margin: 5px 0px;" >
            车型:{{ modelMap(positionLast3?.model) }} 
          </p>
          <el-tag size= large style="margin: 5px 0px;">车身号：{{ positionLast3?.serialNumber }}</el-tag>
          <el-tag size= large style="margin: 5px 0px;">颜色： {{ positionLast3?.colorCode }}</el-tag>
          <el-tag size= large style="margin: 5px 0px;">时间：{{ positionLast3?.dateTime }}</el-tag>
          <p style="color: red; font-size: 5vh;font-weight: bold;margin: 5px 0px;">
            缺陷总数量:{{ positionLast3?.defectCount }} 个
          </p>
        </div>
        
      </el-col>
    </el-row>

    <el-row style="width: 100%; align-content: space-between">
      <el-col :span="8" style="border-radius: 10px">
        <div>
          <SmallCarLayout></SmallCarLayout>
          <!-- <span class="spansmallcarL">左侧缺陷:{{ 'X' }}个</span>
          <span class="spansmallcarR">右侧缺陷:{{ 'X' }}个</span>
          <span class="spansmalltailgate">缺陷:{{ 'X' }}个</span>
          <span class="spansmallroof">缺陷:{{ 'X' }}个</span>
          <span class="spansmallhood">缺陷:{{ 'X' }}个</span> -->
        </div>
      </el-col>
      <el-col :span="8">
        <div style="position: relative">
          <SmallCarLayout></SmallCarLayout>
          <el-row>
            <el-text
              class="mx-1"
              type="danger"
              size="large"
              style="
                position: absolute;
                font-size: 0.9vw;
                color: blue;
                margin-top: -100%;
                margin-left: 0%;
              "
            >
              <!-- 左侧{{ 8 }} -->
            </el-text>
            <br />
            <el-text
              class="mx-1"
              type="danger"
              size="large"
              style="
                position: absolute;
                font-size: 0.9vw;
                color: blue;
                margin-top: -90%;
                margin-left: 0%;
              "
            >
              <!-- 右侧{{ 8 }} -->
            </el-text>
          </el-row>
        </div>
      </el-col>
      <el-col :span="8">
        <div>
          <SmallCarLayout></SmallCarLayout>
        </div>
        <br />
        <br />
        <br />
      </el-col>
    </el-row>
  </el-card>

  <el-dialog
    v-model="dialogVisible"
    title="缺陷检测示意图"
    style="width: 80%; height: 80%"
    draggable
  >
    <!-- <div><el-tag style="margin: 5px 5px">序号：{{123 }}</el-tag>
          <el-tag style="margin: 5px 5px">
            雪橇号：{{456 }}
          </el-tag>
          <el-tag style="margin: 5px 5px">
            车身号：{{ 789}}
          </el-tag></div> -->
    <!--  <span>It's a draggable Dialog</span> -->
    <div class="box-top">
      <div class="box-top-1">
        <div>
          <img
            src="./carlayout/tailgate.png"
            alt=""
            style="
              position: absolute;
              top: 30%; /* 垂直居中 */
              left: 30%; /* 水平居中 */
              transform: translate(-50%, -50%); /* 以图片中心为基准进行偏移 */
              width: 20vw; /* 图片宽度 */
              height: 35vh; /* 图片高度 */
              margin: 2px 2px;
            "
          />
          <div class="box-top-1-L">
            <div class="chl_box">
              <span>part:13</span>
              <br />

              <span>缺陷数量：{{ 2 }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="box-top-1">
        <div>
          <img
            src="./carlayout/roof.png"
            alt=""
            style="
              position: absolute;
              top: 30%; /* 垂直居中 */
              left: 50%; /* 水平居中 */
              transform: translate(-50%, -50%); /* 以图片中心为基准进行偏移 */
              width: 15vw; /* 图片宽度 */
              height: 20vh; /* 图片高度 */
              margin: 2px 2px;
            "
          />
          <div class="box-top-1-M">
            <div class="chl_box">
              <span>part:11</span>
              <br />

              <span>缺陷数量：{{ 2 }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="box-top-1">
        <div>
          <img
            src="./carlayout/hood.png"
            alt=""
            style="
              position: absolute;
              top: 30%; /* 垂直居中 */
              right: 15%; /* 水平居中 */
              transform: translate(-50%, -50%); /* 以图片中心为基准进行偏移 */
              width: 11vw; /* 图片宽度 */
              height: 30vh; /* 图片高度 */
              margin: 2px 2px;
            "
          />
          <div class="box-top-1-R">
            <div class="chl_box">
              <span>part:12</span>
              <br />

              <span>缺陷数量：{{ 2 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="box-bottom">
      <div class="box-top-2">
        <div>
          <img
            src="./carlayout/left.png"
            alt=""
            style="
              position: absolute;
              top: 65%; /* 垂直居中 */
              left: 30%; /* 水平居中 */
              transform: translate(-50%, -50%); /* 以图片中心为基准进行偏移 */
              width: 28vw; /* 图片宽度 */
              height: 20vh; /* 图片高度 */
              margin: 2px 2px;
            "
          />

          <div class="part-10">
            <div class="part-10-1">
              <span>part:10</span>
              <br />

              <span>缺陷数量：{{ 2 }}</span>
            </div>
          </div>
        </div>
        <div class="box">
          <div class="chl_box">
            <span>part:6</span>
            <br />
            <span>缺陷数量：{{ 2 }}</span>
          </div>
          <div class="chl_box">
            <span>part:7</span>
            <br />
            <span>缺陷数量：{{ 2 }}</span>
          </div>
          <div class="chl_box">
            <span>part:8</span>
            <br />
            <span>缺陷数量：{{ 2 }}</span>
          </div>
          <div class="chl_box">
            <span>part:9</span>
            <br />
            <span>缺陷数量：{{ 2 }}</span>
          </div>
        </div>
      </div>
      <div class="box-top-2">
        <div>
          <img
            src="./carlayout/right.png"
            alt=""
            style="
              position: absolute;
              top: 65%; /* 垂直居中 */
              right: -4%; /* 水平居中 */
              transform: translate(-50%, -50%); /* 以图片中心为基准进行偏移 */
              width: 28vw; /* 图片宽度 */
              height: 21vh; /* 图片高度 */
              margin: 2px 2px;
            "
          />
          <div class="part-5">
            <div class="part-5-1">
              <span>part:5</span>
              <br />

              <span>缺陷数量：{{ 2 }}</span>
            </div>
          </div>
        </div>

        <div class="box">
          <div class="chl_box">
            <span>part:4</span>
            <br />
            <span>缺陷数量：{{ 2 }}</span>
          </div>
          <div class="chl_box">
            <span>part:3</span>
            <br />
            <span>缺陷数量：{{ 2 }}</span>
          </div>
          <div class="chl_box">
            <span>part:2</span>
            <br />
            <span>缺陷数量：{{ 2 }}</span>
          </div>
          <div class="chl_box">
            <span>part:1</span>
            <br />
            <span>缺陷数量：{{ 2 }}</span>
          </div>
        </div>
      </div>
    </div>
    <!--    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确认</el-button>
      </span>
    </template> -->
  </el-dialog>
</template>
<script setup lang="ts">
import SmallCarLayout from './small-car-layout.vue'
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { reqEineshistoryVoLastN } from '@/api/eines/index'
import type { HistoryVo } from '@/api/eines/type'
import moment from 'moment'
let recordsLastN = ref<HistoryVo[]>([])
//let lineSelect = ref<string>('A')
// 定义响应式数据 lineSelect
const lineSelect = ref(0)
//存储当前时间
let time = ref(moment().format('YYYY年MM月DD日 hh:mm:ss'))
let timer = ref(0)
//保存选择的条线.默认一线
let lineMemo = ref(1)

//const radio = ref(3)
//最近第一辆车、第二辆车...
let positionLast1 = ref<HistoryVo>()
let positionLast2 = ref<HistoryVo>()
let positionLast3 = ref<HistoryVo>()
let positionLast4 = ref<HistoryVo>()

//定时器-》刷新
const changeLine = (value: any) => {
  //保存条线选择
  lineMemo.value = value + 1
  //values:0,1,2
  lastRecord(4, value + 1)
}
// 获取最新2条记录
// 转换 Lines 数组为 el-radio 所需要的数据结构
const transformedLines = computed(() => {
  return Lines.map((line) => ({ value: line[0], label: line[1] }))
})

onMounted(() => {
  lastRecord(4, 1)
  //时间显示
  timer.value = setInterval(() => {
    time.value = moment().format('YYYY年MM月DD日 hh:mm:ss')
  }, 1000)
  //更新最新数据
  setInterval(() => {
    lastRecord(4, lineMemo.value)
  }, 60000)
})
// 销毁定时器
onBeforeUnmount(() => {
  clearInterval(timer.value)
})

const lastRecord = async (num: number, line: number) => {
  let result = await reqEineshistoryVoLastN(num, line)
  if (result.code == 200) {
    recordsLastN.value = result.data
    positionLast1.value = recordsLastN.value[0]
    positionLast2.value = recordsLastN.value[1]
    positionLast3.value = recordsLastN.value[2]
    positionLast4.value = recordsLastN.value[3]
    positionLast1.value.dateTime = moment(positionLast1.value.dateTime).format(
      'YYYY-MM-DD HH:mm:ss',
    )
    positionLast2.value.dateTime = moment(positionLast2.value.dateTime).format(
      'YYYY-MM-DD HH:mm:ss',
    )
    positionLast3.value.dateTime = moment(positionLast3.value.dateTime).format(
      'YYYY-MM-DD HH:mm:ss',
    )
    positionLast4.value.dateTime = moment(positionLast4.value.dateTime).format(
      'YYYY-MM-DD HH:mm:ss',
    )
  }
}
//配置线
/* let Lines = [
  [1, '1线'],
  [2, '2线'],
  [3, '3线'],
] */
// 模拟 Lines 数组
const Lines = [
  [0, 'Line 1'],
  [1, 'Line 2'],
  [2, 'Line 3'],
  // ... 更多选项
]

const modelMap = (num: any) => {
  let model: any = {
    '1': 'ASUVE sunroof1',
    '11': 'ASUVE sunroof2',
    '9': 'ASUVE blackroof sunroof1',
    '10': 'ASUVE blackroof sunroof2',
    '2': 'A+SUVE',
    '12': 'A+SUVE Blackroof',
    '3': 'Tiguan Coupe',
    '4': 'Tiguan L',
    '5': 'Lounge PSD',
    '15': 'Lounge PGD',
    '6': 'NEO normal',
    '16': 'NEO panoramic',
    '17': 'NEO blackroof',
    '18': 'NEO panoramicblackroof',
    '7': 'A7L',
    '8': 'Phideon',
    '77': 'A7L blackroof',
    '13': 'Tiguan Coupe Blackroof',
    '19': 'TiguanL NF',
  }
  return model[num]
}

/* ***********dialog */
const dialogVisible = ref(false)
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

.dialog-footer button:first-child {
  margin-right: 10px;
}

/* ***************************************** */
.box-top {
  width: 70vw;
  height: 30vh;
  border: 2px solid #00008b;
  margin: 10px auto;
  display: flex;
  justify-content: center;
  background: rgb(252, 243, 243);
  border-radius: 10px;

  /* flex-direction: row; */
  /*不写这个也是默认水平*/
  .box-top-1-L {
    width: 6vw;
    height: 7vh;
    border: 1px solid #00008b;
    margin: 21vh 1px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10vh;
    margin-left: 4vw;
    border-radius: 10px;
  }

  .box-top-1-M {
    width: 6vw;
    height: 7vh;
    border: 1px solid #00008b;
    margin: 21vh 1px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 0.5vh;
    margin-left: 7vw;
    border-radius: 10px;
  }

  .box-top-1-R {
    width: 6vw;
    height: 7vh;
    border: 1px solid #00008b;
    margin: 21vh 1px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10vh;
    margin-left: 11vw;
    border-radius: 10px;
  }

  .chl_box {
    width: 30vw;
    height: 6vh;
    text-align: center;
    background: $base-defect-color;
    margin-left: 2px;
    margin-right: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4vh;
    flex-direction: column;
    font-weight: bold;
    border-radius: 10px;

    .span {
      font-size: 1.2vh;
      line-height: 1.5vh;
      color: #f5120a;
    }
  }

  .box-top-1 {
    width: 20vw;
    height: 28vh;

    text-align: center;
    background: #eff9fa;
    margin: 5px;
    border-radius: 10px;
  }
}

.box-bottom {
  width: 70vw;
  height: 30vh;
  border: 2px solid #00008b;
  margin: 10px auto;
  display: flex;
  justify-content: center;
  background: rgb(252, 243, 243);
  border-radius: 10px;

  /* flex-direction: row; */
  /*不写这个也是默认水平*/
  .part-10 {
    width: 6vw;
    height: 7vh;
    border: 1px solid #00008b;
    margin: 21vh 1px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 0.6vh;
    margin-left: 2vw;
    border-radius: 10px;

    .part-10-1 {
      width: 30vw;
      height: 6vh;
      text-align: center;
      background: $base-defect-color;
      margin-left: 2px;
      margin-right: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4vh;
      flex-direction: column;
      line-height: 1.9vh;
      font-weight: bold;
      border-radius: 10px;
    }
  }

  .part-5 {
    width: 6vw;
    height: 7vh;
    border: 1px solid #00008b;
    margin: 21vh 1px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 0.6vh;
    margin-left: 22vw;
    border-radius: 10px;

    .part-5-1 {
      width: 30vw;
      height: 6vh;
      text-align: center;
      background: $base-defect-color;
      margin-left: 2px;
      margin-right: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4vh;
      flex-direction: column;
      line-height: 1.9vh;
      font-weight: bold;
      border-radius: 10px;
    }
  }

  .box {
    width: 29vw;
    height: 7vh;
    border: 1px solid #00008b;
    margin: 21vh 1px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: -7.5vh;
    margin-left: 0.5vw;
    border-radius: 10px;

    .chl_box {
      width: 30vw;
      height: 6vh;
      text-align: center;
      background: $base-defect-color;
      margin-left: 2px;
      margin-right: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4vh;
      flex-direction: column;
      line-height: 1.9vh;
      font-weight: bold;
      border-radius: 10px;
    }
  }

  .box-top-2 {
    width: 30vw;
    height: 28vh;
    line-height: 100px;
    text-align: center;
    background: #eff9fa;
    margin: 5px;
    border-radius: 10px;
  }
}

.spansmallcarL {
  display: flex;
  //background-color: #f5120a;
  margin-top: -26vh;
  margin-left: 5px;
  background-size: cover;
  font-size: 0.8vw;
}

.spansmallcarR {
  display: flex;
  //background-color: #f5120a;
  margin-top: 3vh;
  margin-left: 5px;
  margin-right: 0vw;
  background-size: cover;
  font-size: 0.8vw;
}

.spansmalltailgate {
  display: flex;
  //background-color: #f5120a;
  margin-top: 10vh;
  margin-left: 2vw;
  margin-right: 0vw;
  background-size: cover;
  font-size: 0.8vw;
}

.spansmallroof {
  display: flex;
  //background-color: #f5120a;
  margin-top: -10%;
  margin-left: 45%;

  background-size: cover;
  font-size: 0.8vw;
}

.spansmallhood {
  display: flex;
  //background-color: #f5120a;
  margin-top: 4vh;
  margin-left: 85%;
  margin-right: 0vw;
  background-size: cover;
  font-size: 0.8vw;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  .el-tag {
    font-size: 14px;
    font-weight: bold;
  }
}
</style>
