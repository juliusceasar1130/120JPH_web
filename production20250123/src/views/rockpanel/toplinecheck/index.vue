<template>
  <einesCar>123</einesCar>
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
  <!--弹出图片部分-->
  <el-dialog v-model="visible" :show-close="false" draggable="true">
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
    -------------------
    <div>
      <el-tag v-for="(value, key) in dialogInfo.partDefectCount">
        part:{{ key }}-数量:{{ value }}
      </el-tag>
    </div>
    ---------------------
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
  partDefectCount: '',
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
const dateConvert = (row) => {
  let date = new Date(row.dateTime)
  return date.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
}
const openDia = (row: any) => {
  visible.value = true
  console.log(row)
  //获取数据
  Object.assign(dialogInfo, row)
  //计算每个part上的缺陷数量
  let partMap = new Map()
  row.historyDetailList.map((item: any) => {
    if (item.part > 0) {
      if (partMap.has(item.part)) {
        partMap.set(item.part, partMap.get(item.part) + 1)
      } else {
        partMap.set(item.part, 1)
      }
    }
  })
  //map转对象
  dialogInfo.partDefectCount = Object.fromEntries(partMap)
  //console.log(dialogInfo.partDefectCount['7'])
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
<style scoped>
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
</style>
