<template>
  <div class="change-point-container">
    <!-- 搜索面板 -->
    <el-card class="search-panel">
      <div class="search-panel-content">
        <el-form class="search-form" inline>
          <el-form-item class="date-form-item">
            <el-date-picker 
              v-model="dateTimepickUp" 
              type="datetimerange" 
              :shortcuts="shortcuts" 
              range-separator="至"
              start-placeholder="开始时间" 
              end-placeholder="结束时间" 
              @change="datepickup" 
              value-format="YYYY-MM-DDTHH:mm:ss" 
            />
          </el-form-item>
          
          <el-form-item class="action-buttons">
            <el-button type="primary" size="default" @click="search">
              <el-icon><Search /></el-icon>
              <span class="button-text">搜索</span>
            </el-button>
            <el-button type="info" size="default" @click="reset">
              <el-icon><Refresh /></el-icon>
              <span class="button-text">重置</span>
            </el-button>
            <el-button type="success" size="default" @click="todaySearch">
              <span class="button-text">今天</span>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 主内容区 -->
    <el-card class="main-content">
      <!-- 优先级选择器 -->
      <div class="priority-filter">
        <div class="section-title">
          <el-icon><Filter /></el-icon>
          <span>优先级筛选</span>
        </div>
        <div class="priority-buttons">
          <el-button 
            v-for="(label, index) in priorityLabels" 
            :key="index"
            class="priority-btn"
            :class="{'active-priority': selectedPriority === index}"
            :style="selectedPriority === index ? { 
              borderColor: priorityColors[index],
              color: priorityColors[index],
              backgroundColor: `${priorityColors[index]}10`
            } : {}"
            @click="selectPriority(index)"
          >
            <el-icon v-if="selectedPriority === index"><Check /></el-icon>
            {{ label }}
          </el-button>
        </div>
      </div>
      
      <!-- 区域卡片网格 -->
      <div class="areas-grid">
        <div v-for="(K, V) in cpResult" :key="V" class="area-card">
          <div class="area-header">
            <div class="area-title-content">
              <el-icon><Location /></el-icon>
              <span>{{ V }}</span>
            </div>
          </div>
          <div class="area-content">
            <div class="line-buttons">
              <div v-for="(K2, V2) in K" :key="V2" class="line-button-wrapper">
                <el-badge :value="K2.length - 1" :hidden="K2.length - 1 === 0" :type="priorityBadge_color">
                  <el-button class="line-button" @click="openTrace(V, V2)">
                    line: {{ V2 }}
                  </el-button>
                </el-badge>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 无数据提示 -->
      <el-empty v-if="Object.keys(cpResult).length === 0" description="暂无数据" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import type { AreaAndLineListResponseData, query, cpResult } from '@/api/changePoint/type'
import { reqGetAreaAndLine, reqGetDataByQuery } from '@/api/changePoint'
import { ref, onMounted, reactive, watch } from 'vue'
import moment from 'moment'
import useTraceStore from '@/views/changePoint/store/trace.ts'
import { useRouter } from 'vue-router'
import { Search, Refresh, Filter, Location, Check } from '@element-plus/icons-vue'

let $router = useRouter()
//引入仓库
let traceStore = useTraceStore()
let areaNum = ref()
let areaAndLineList = ref<AreaAndLineListResponseData>()
let cpResult = ref<any>({})
let dateTimepickUp = ref()
//初始化查询
let query = reactive<query>({
  areaCh: '',
  line: '',
  startTime: '',
  endTime: '',
  priority: 3 //1级：0；2级：1；3级：2；全部：3
})
let priorityBadge_color=ref()
onMounted(() => {
  query.startTime = moment(shortcuts[0].value()[0]).format(
    'YYYY-MM-DDTHH:mm:ss',
  )
  query.endTime = moment(shortcuts[0].value()[1]).format('YYYY-MM-DDTHH:mm:ss')
  dateTimepickUp.value = [query.startTime, query.endTime]
  //获取区域和线路
  GetAreaAndLine()
  //根据区域和线获取数据
  GetDataByQuery(query)
})

const GetAreaAndLine = async () => {
  let result = await reqGetAreaAndLine()
  if (result.code == 200) {
    areaNum.value = result.data.length
    areaAndLineList.value = result.data
  }
}

const GetDataByQuery = async (query: query) => {
  let result = await reqGetDataByQuery(query)
  if (result.code == 200) {
    //必须定义对象
    cpResult.value = result.data
    //reactive中用于复制对象
    //Object.assign(cpResult, result.data)
  }
}

//时间选择器
const shortcuts = [
  {
    text: '昨天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
      return [start, end]
    },
  },
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
const search = () => {
  GetDataByQuery(query)
}
const reset = () => {
  //清空Query
  Object.assign(query, {
    areaCh: '',
    line: '',
    startTime: '',
    endTime: '',
  })
  //重新获取数据，上周
  query.startTime = moment(shortcuts[0].value()[0]).format(
    'YYYY-MM-DDTHH:mm:ss',
  )
  query.endTime = moment(shortcuts[0].value()[1]).format('YYYY-MM-DDTHH:mm:ss')
  dateTimepickUp.value = [query.startTime, query.endTime]
  GetDataByQuery(query)
}
const todaySearch = () => {
  //今天
  query.startTime = moment(shortcuts[0].value()[0]).format(
    'YYYY-MM-DDTHH:mm:ss',
  )
  query.endTime = moment(shortcuts[0].value()[1]).format('YYYY-MM-DDTHH:mm:ss')
  dateTimepickUp.value = [query.startTime, query.endTime]
  GetDataByQuery(query)
}
//监视查询Query,复制给仓库的查询条件 开启深度监视
watch(
  () => query,
  () => {
    traceStore.query = query
  },
  { deep: true },
)
const openTrace = (area: any, line: any) => {
  query.areaCh = area
  query.line = line
  $router.push('/cp/trace')
}
// 分类按钮标签和颜色
const priorityLabels = ['一级', '二级', '三级', '全部']
const priorityColors = ['#f56c6c', '#e6a23c', '#67c23a', '#409eff'] // 按钮对应的颜色
const priorityBadge = ['danger', 'warning', 'success', 'primary'] // 小圆点对应的不同type
const selectedPriority = ref<number>(3) // 已选择、默认选择：'默认全部'

const selectPriority = (index: number) => {
  try {
    selectedPriority.value = index; // 更新选中的优先级
    //根据区域和线获取数据
    query.priority=index
    GetDataByQuery(query)
    //根据优先级获取小圆点的type
    getBadgeType(index)
  } catch (error) {
    console.error("选择优先级时发生错误:", error);
  }
};

// 根据优先级获取小圆点的type
const getBadgeType = (index: number) => {
  priorityBadge_color.value = priorityBadge[index] || 'info' // 默认返回 'info'
}
</script>

<style scoped>
/* 整体容器样式 */
.change-point-container {
  padding: 12px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 120px);
}

/* 搜索面板样式 */
.search-panel {
  margin-bottom: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  border: none;
}

.search-panel-content {
  padding: 8px;
}

.search-form {
  display: flex;
  align-items: center;
  width: 100%;
}

.date-form-item {
  margin-bottom: 0;
  flex: 1;
  min-width: 300px;
}

.action-buttons {
  margin-bottom: 0;
  margin-left: 12px;
  display: flex;
  gap: 8px;
}

/* 主内容区样式 */
.main-content {
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  padding: 0;
  border: none;
}

/* 优先级筛选区域 */
.priority-filter {
  padding: 16px;
  border-bottom: 1px solid #ebeef5;
  background-color: #f9fafc;
  border-radius: 8px 8px 0 0;
}

.section-title {
  font-size: 15px;
  font-weight: 500;
  color: #606266;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.section-title .el-icon {
  margin-right: 6px;
  font-size: 18px;
}

.priority-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.priority-btn {
  border-radius: 20px;
  font-size: 14px;
  padding: 8px 16px;
  transition: all 0.2s ease;
}

.priority-btn .el-icon {
  margin-right: 4px;
}

.active-priority {
  font-weight: 500;
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

/* 区域卡片网格 */
.areas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
  padding: 16px;
}

.area-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 240px;
}

.area-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.area-header {
  background-color: #2c8bbc;
  color: white;
  padding: 12px 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.area-title-content {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
}

.area-title-content .el-icon {
  margin-right: 8px;
  font-size: 20px;
}

.area-content {
  background-color: #e8f4fc;
  flex: 1;
  padding: 12px;
}

.line-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.line-button-wrapper {
  margin: 4px;
}

.line-button {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  background-color: white;
  border: 1px solid #dcdfe6;
  transition: all 0.2s ease;
}

.line-button:hover {
  color: #2c8bbc;
  background-color: #f0f9ff;
  transform: translateY(-2px);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .search-form {
    flex-direction: column;
    align-items: stretch;
  }
  
  .date-form-item {
    margin-bottom: 12px;
    width: 100%;
  }
  
  .action-buttons {
    margin-left: 0;
    width: 100%;
    justify-content: space-between;
  }
  
  .priority-filter {
    padding: 12px;
  }
  
  .areas-grid {
    grid-template-columns: 1fr;
    padding: 12px;
  }
  
  .area-card {
    min-height: 200px;
  }
  
  .button-text {
    display: none;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .areas-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
}

@media (min-width: 1025px) {
  /* 大屏幕默认设置 */
}
</style>
