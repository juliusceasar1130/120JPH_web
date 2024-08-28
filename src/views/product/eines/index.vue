<template>
  <einesCar></einesCar>
  <!--搜索部分-->
  <el-card>
    <el-form inline>
      <el-form-item style="width: 20%">
        <span class="demonstration"></span>
        <el-date-picker v-model="dateTimepickUp" type="datetimerange" :shortcuts="shortcuts" range-separator="至"
          start-placeholder="开始时间" end-placeholder="结束时间" @change="datepickup" value-format="YYYY-MM-DDTHH:mm:ss" />
      </el-form-item>
      <el-form-item label="车型">
        <div class="m-4">
          <el-cascader v-model="modelSelected" :options="modelOptions" @change="handleChange" />
        </div>
      </el-form-item>

      <el-form-item label="颜色">
        <el-input v-model="query.colorCode" placeholder="请输入颜色"></el-input>
      </el-form-item>
      <el-form-item label="车号">
        <el-input v-model="query.serialNumber" placeholder="请输入车号"></el-input>
      </el-form-item>

      <el-form-item label="通道">
        <el-select v-model="query.tunnel" clearable placeholder="Select" style="width: 240px">
          <el-option v-for="item in tunnelOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="Search" @click="search"></el-button>
        <el-button type="primary" icon="Refresh" @click="reset"></el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <!--图表部分-->
  <el-card style="margin: 5px 0px">
    <div>
      <el-table border style="margin: 5px 0px" :data="pageData" :row-class-name="tableRowClassName" height="550"
        @sort-change="sortChange">
        <el-table-column label="ID" align="center" width="100px" prop="historyId"></el-table-column>
        <el-table-column label="时间" align="center" prop="dateTime" sortable="custom">
          <template #="{ row, index }">
            <p>{{ dateConvert(row) }}</p>
          </template>
        </el-table-column>
        <el-table-column label="车型" align="center" width="200px">
          <template #="{ row, index }">
            <p>{{ modelMap(row) }}</p>
          </template>
        </el-table-column>
        <el-table-column label="VIN" align="center" width="200px" prop="serialNumber"></el-table-column>
        <el-table-column label="颜色" align="center" prop="colorCode"></el-table-column>
        <el-table-column label="通道" align="center" prop="tunnel"></el-table-column>
        <el-table-column label="循环" align="center" prop="cycle"></el-table-column>
        <el-table-column label="缺陷数量" align="center">
          <template #="{ row, index }">
            <el-tag type="danger" size="large">{{ row.defectCount }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="分布" align="center" width="120px">
          <template #="{ row, index }">
            <el-button type="primary" size="small" @click="openDia(row)">
              ...
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 50]"
        :background="true" layout=" prev, pager, next, jumper,->,sizes,total" :total="total"
        @size-change="reqEineshistoryAndDetailPageFunction(1)" @current-change="reqEineshistoryAndDetailPageFunction" />
    </div>
  </el-card>
  <!--弹出图片部分   old:el-dialog v-model="visible" :show-close="false" draggable-->
  <el-dialog
    v-model="visible"    
    style="width: 75%; height: 73%"
    draggable
  >
    <div class="diagContainer">
      <div class="diagtag">
        <el-tag type="Primary" effect="dark" style="margin: 0px 10px">
          车型： {{ modelMap(dialogInfo) }}
        </el-tag>
        <el-tag type="Primary" effect="dark" style="margin: 0px 10px">
          Vin: {{ dialogInfo.serialNumber }}
        </el-tag>
        <el-tag type="Primary" effect="dark" style="margin: 0px 10px">
          颜色: {{ dialogInfo.colorCode }}
        </el-tag>
      </div>
      <div class="diagtag">
        <el-tag type="danger" effect="dark" style="margin: 0px 10px">
          缺陷总数：{{ dialogInfo.defectCount }}
        </el-tag>
      </div>
    </div>
    

 <!--    <div>
      <el-tag v-for="(value, key) in dialogInfo.partDefectCount">
        part:{{ key }}-数量:{{ value }}
        
      </el-tag>
    </div> -->

   
    <!-- 图示部分 -->
    <div class="box-top dialog-text">
      <!-- 后门 -->
      <div class="box-top-1">
        <div class="chl_box_11" style="margin-left: 30%; margin-top: 20%">
          <span>{{ dialogInfo.partDefectCount?.get("13")>0?dialogInfo.partDefectCount?.get("13"):''}}</span>
        </div>
        <img
          src="./component/carlayout/tailgate.png"
          style="width: 60%; height: 100%; margin-top: -35%; margin-left: 50%"
          alt=""
        />
      </div>
      <!-- 顶 -->
      <div class="box-top-1">
        <div class="chl_box_11" style="margin-left: 30%; margin-top: 20%">
          <span>{{dialogInfo.partDefectCount?.get("11")>0?dialogInfo.partDefectCount?.get("11"):'' }}</span>
        </div>
        <img
          src="./component/carlayout/roof.png"
          style="width: 90%; height: 95%; margin-top: -35%; margin-left: 5%"
          alt=""
        />
      </div>
      <!-- 前盖 -->
      <div class="box-top-1">
        <div class="chl_box_11" style="margin-left: 30%; margin-top: 20%">
          <span>{{ dialogInfo.partDefectCount?.get("12")>0?dialogInfo.partDefectCount?.get("12"):'' }}</span>
        </div>
        <img
          src="./component/carlayout/hood.png"
          style="width: 60%; height: 110%; margin-top: -40%; margin-left: -15%"
          alt=""
        />
      </div>
    </div>

    <div class="box-bottom dialog-text">
      <div class="box-bottom-1">
        <img
          src="./component/carlayout/left-1.png"
          style="width: 99%; height: 80%; margin-top: 4%"
          alt=""
        />
        <div class="chl_box_5" style="margin-left: 46%; margin-top: -38%">
          <span>{{ dialogInfo.partDefectCount?.get("10")>0?dialogInfo.partDefectCount?.get("10"):''}}</span>
        </div>
        <div class="box dialog-text" style="margin-left: -10%; margin-top: 5%">
          <div class="chl_box">
            <span>{{ dialogInfo.partDefectCount?.get("6")>0?dialogInfo.partDefectCount?.get("6"):'' }}</span>
          </div>
          <div class="chl_box">
            <span>{{ dialogInfo.partDefectCount?.get("7")>0?dialogInfo.partDefectCount?.get("7"):'' }}</span>
          </div>
          <div class="chl_box">
            <span>{{ dialogInfo.partDefectCount?.get("8")>0?dialogInfo.partDefectCount?.get("8"):'' }}</span>
          </div>
          <div class="chl_box">
            <span>{{ dialogInfo.partDefectCount?.get("9")>0?dialogInfo.partDefectCount?.get("9"):'' }}</span>
          </div>
        </div>
      </div>
      <div class="box-bottom-1">
        <img
          src="./component/carlayout/right-1.png"
          style="width: 99%; height: 80%;  margin-top: 4%;margin-left: -4%"
          alt=""
        />
        <div class="chl_box_5" style="margin-left: 30%; margin-top: -38%">
          <span>{{ dialogInfo.partDefectCount?.get("5")>0?dialogInfo.partDefectCount?.get("5"):'' }}</span>
        </div>

        <div class="box" style="margin-left: -15%; margin-top: 5%">
          <div class="chl_box">
            <span>{{dialogInfo.partDefectCount?.get("4")>0?dialogInfo.partDefectCount?.get("4"):'' }}</span>
          </div>
          <div class="chl_box">
            <span>{{ dialogInfo.partDefectCount?.get("3")>0?dialogInfo.partDefectCount?.get("3"):''}}</span>
          </div>
          <div class="chl_box">
            <span>{{ dialogInfo.partDefectCount?.get("2")>0?dialogInfo.partDefectCount?.get("2"):'' }}</span>
          </div>
          <div class="chl_box" >
            <span>{{ dialogInfo.partDefectCount?.get("1")>0?dialogInfo.partDefectCount?.get("1"):''}}</span>
          </div>
        </div>
      </div>
    </div>
    
  </el-dialog>
</template>
<script setup lang="ts">
import { einesDto, HistoryVo } from '@/api/eines/type'
import { ref, reactive, onMounted } from 'vue'
import { reqEineshistoryAndDetailPage } from '@/api/eines/index'
import { ElMessage } from 'element-plus'
import einesCar from './component/einesCar.vue'
let dateTimepickUp = ref('')
let pageNo = ref(1)
let pageSize = ref(10)
let total = ref()
let pageData = ref([])
let query = reactive<einesDto>({
  model: 0,
  colorCode: '',
  startTime: '',
  endTime: '',
  tunnel: '',
  serialNumber: '',
  orderBy: { prop: '', order: '' },
})
let modelSelected = ref([])
let visible = ref(false)
//对话框数量
let dialogInfo = reactive<HistoryVo>({
  colorCode: '',
  cycle: 0,
  dateTime: '',
  defectCount: 0,
  historyId: '',
  model: 0,
  serialNumber: '',
  tunnel: '',
  historyDetailList: [],
  partDefectCount: undefined,
})
onMounted(() => {
  reqEineshistoryAndDetailPageFunction()
})
const reqEineshistoryAndDetailPageFunction = async (page = 1) => {
  pageNo.value = page
  let result = await reqEineshistoryAndDetailPage(
    pageNo.value,
    pageSize.value,
    query,
  )
  console.log(result)
  if (result.code == 200) {
    pageData.value = result.data.pageData
    total.value = result.data.totalSize
  } else {
    ElMessage.error
  }
}
const reset = () => {
  Object.assign(query, {
    model: '',
    colorCode: '',
    startTime: '',
    endTime: '',
    tunnel: '',
    serialNumber: '',
    orderBy: { prop: '', order: '' },
  })
  //清空时间pickup
  dateTimepickUp.value = ''
  //车型选择
  modelSelected.value = []
  reqEineshistoryAndDetailPageFunction()
}
const search = () => {
  reqEineshistoryAndDetailPageFunction()
}
//时间选择器
const shortcuts = [
  {
    text: '上周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '上月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '上3个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]
//点击时间选择器确定后传送参数至Query
const datepickup = (value: any) => {
  ; (query.startTime = value[0]), (query.endTime = value[1]), console.log(query)
}
//表格字段排序
const sortChange = (data: any) => {
  console.log(data)
  query.orderBy.order = data.order == 'ascending' ? 'ASC' : 'DESC'
  //dateTime要转换为DATE_TIME 否则SQL不认
  query.orderBy.prop = data.prop == 'dateTime' ? 'DATE_TIME' : ''
  reqEineshistoryAndDetailPageFunction()
}
const dateConvert = (row:any) => {
  let date = new Date(row.dateTime)
  return date.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
}
const openDia = (row: any) => {
  visible.value = true
  console.log(row)
  //获取数据
  Object.assign(dialogInfo, row)
  let partMap = calDefectNum(row.historyDetailList)
  //map转对象
  dialogInfo.partDefectCount = partMap 
}
//计算part的缺陷数量
const calDefectNum = (list: any) => {
  //Part共计13个
  let partMap = new Map([["1",0],["2",0],["3",0],["4",0],["5",0],["6",0],["7",0],["8",0],["9",0],["10",0],["11",0],["12",0],["13",0]])
  list.map((item: any) => {
    if (item.part > 0) {
      if (partMap.has(item.part.toString())) {
        partMap.set(item.part.toString(), partMap.get(item.part.toString()) as number + 1)
      } else {
        partMap.set(item.part.toString(), 1)
      }     
    }
  })
  return partMap
}

//车型的级联选择
const handleChange = (value: any) => {
  query.model = value[1]
}
const modelMap = (row: any) => {
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
  return model[row.model]
}

const modelOptions = [
  {
    value: 'guide',
    label: 'ASUV',
    children: [
      {
        value: '1',
        label: 'ASUVEsunroof1',
      },
      {
        value: '11',
        label: 'ASUVEsunroof2',
      },
      {
        value: '9',
        label: 'ASUVEblackroofsunroof1',
      },
      {
        value: '10',
        label: 'ASUVEblackroofsunroof1',
      },
    ],
  },
  {
    value: 'guide',
    label: 'A+SUVE',
    children: [
      {
        value: '2',
        label: 'A+SUVE',
      },
      {
        value: '12',
        label: 'A+SUVEBlackroof',
      },
    ],
  },
  {
    value: 'guide',
    label: 'TiguanL',
    children: [
      {
        value: '3',
        label: 'TiguanLCoupe',
      },
      {
        value: '4',
        label: 'TiguanL',
      },
      {
        value: '13',
        label: 'TiguanCoupeBlackroof',
      },
      {
        value: '19',
        label: 'TiguanLNF',
      },
    ],
  },
  {
    value: 'guide',
    label: 'Lounge',
    children: [
      {
        value: '5',
        label: 'LoungePSD',
      },
      {
        value: '15',
        label: 'LoungePGD',
      },
    ],
  },
  {
    value: 'guide',
    label: 'A7L',
    children: [
      {
        value: '7',
        label: 'A7L',
      },
      {
        value: '77',
        label: 'A7Lblackroof',
      },
    ],
  },
  {
    value: 'guide',
    label: 'NEO',
    children: [
      {
        value: '6',
        label: 'NEOnormal',
      },
      {
        value: '16',
        label: 'NEOpanoramic',
      },
      {
        value: '17',
        label: 'NEOblackroof',
      },
      {
        value: '18',
        label: 'NEOpanoramicblackroof',
      },
    ],
  },
]
const tunnelOptions = [
  {
    value: 1,
    label: '1线',
  },
  {
    value: 2,
    label: '2线',
  },
  {
    value: 3,
    label: '3线',
  },
]
</script>
<!-- <style scoped>
.diagContainer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .diagtag {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }
}
</style> -->
<style lang="scss" scoped>
.diagContainer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .diagtag {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }
}

/* ***************************************** */
.box-top {
  width: 95%;
  height: 30%;  
  margin-bottom: 2px;
  display: flex;
  justify-content: center;
  // background: rgb(252, 243, 243);
  border-radius: 10px;
  .box-top-1 {
    display: relative;
    margin: 1px 1px;
    width: 21.3vw;
    height: 28vh;
    color: #0e7fdb;
    text-align: center;
    position: relative;
    background-color: rgb(251, 245, 245);
    margin: 5px;
    border-radius: 10px;
  }
}

.box-bottom {
  width: 95%;
  height: 31vh;
  display: flex;
  
  justify-content: center;
  // background: rgb(252, 243, 243);
  border-radius: 10px;
  position: relative;
  /*   part 6 7 8 9 1 2 3 4 */
  .box {
    width: 125%;
    height: 7vh;
    display: flex;
    justify-content: center;
    border-radius: 10px;
    position: relative;
    .chl_box {
      width: 11%;
      height: 5vh;
     // background: rgb(203, 244, 229);
     background-color: rgba(18, 119, 119, 0.233);
     color: #0e7fdb;
      margin-left: 3%;
      margin-right: 3%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border-radius: 5px;
    }
  }

  .box-bottom-1 {
    width: 44%;
    height: 97%;
    text-align: center;
   // background: #f6f5f6;
   background-color: rgb(251, 245, 245);
   color: #0e7fdb;
    margin: 5px;
    border-radius: 10px;
    position: relative;
  }
}

/* part 5 10 */
.chl_box_5 {
  width: 15%;
  height: 25%;
  text-align: center;
 // background: rgb(203, 244, 229);
 color: #0e7fdb;
 background-color: rgba(18, 119, 119, 0.233);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-direction: column;
  border-radius: 10px;
}
/* part 11 12 13 */
.chl_box_11 {
  width: 20%;
  height: 25%;
  //background: rgb(203, 244, 229);
  background-color: rgba(18, 119, 119, 0.233);
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 10px;
  
}
.mx-1 {
  width: 7vw;
  font-size: 4vh;
  line-height: 5vh;
  background-color: rgb(247, 250, 242);
  border-radius: 5px;
  font-weight: bold;
  text-align: center;
  position: relative;
  left: 1%;
  top: -10%;
}
/* dialog的文字样式 */
.dialog-text {
  text-align: center;
  font-size: 4vh;
  font-weight: bold;
  line-height: 4vh;
  font-family: Arial, sans-serif;
  color: #f7b733;
}

/* 缺陷是、总数量的样式 */
.TextStyle {
  color: rgb(251, 0, 0);
  font-size: 6vh;
  font-weight: bold;
  margin: 5px 0px;
  font-family: '宋体';
}
/* 车型一行的文字样式 */
.TextCarLineStyle {
  color: blue;
  font-size: 5vh;
  font-weight: bold;
  margin: 5px 0px;
  font-family: '宋体';
}
/* 车身号，颜色，时间 */
.CarTimesColor {
  margin: 5px 0px;
  font-family: '宋体';
}

/* 最新第X台的样式 */
.LatestUnit {
  font-family: '宋体';
  font-size: 3vh;
  margin: 5px 0px;
  color: #000000;
  font-weight: bold;
}
/* 顶部时间的样式 */
</style>

