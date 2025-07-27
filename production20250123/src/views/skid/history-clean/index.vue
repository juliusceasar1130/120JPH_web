<!--
 * 最后修改时间->2025-07-26 16:30
 * 作者：chenliang
-->
<template>
  <div class="history-clean-container">
    <div class="header-container">
      <h2 class="skid-title">雪橇编号：{{ skidId }}</h2>
      <el-button @click="backToHome" type="primary" plain>返回雪橇一览表</el-button>
    </div>

    <!-- 筛选条件 -->
    <el-card class="filter-card">
      <div class="filter-container">
        <el-input 
          placeholder="雪橇编号" 
          v-model="filters.skidId" 
          class="filter-item"
          clearable>
        </el-input>
        
        <el-select 
          placeholder="清洁度状态" 
          v-model="filters.cleanStatus" 
          class="filter-item"
          clearable>
          <el-option label="清洁 (C)" value="C"></el-option>
          <el-option label="中度 (M)" value="M"></el-option>
          <el-option label="严重 (S)" value="S"></el-option>
        </el-select>
        
        <el-date-picker
          v-model="filters.inspectionTimeRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="检测开始时间"
          end-placeholder="检测结束时间"
          class="date-picker-item"
          clearable>
        </el-date-picker>
      </div>
      <div class="button-container">
        <el-button type="primary" @click="searchData">搜索</el-button>
        <el-button @click="resetFilters">重置</el-button>
      </div>
    </el-card>

    <!-- 趋势图 -->
    <el-card class="stats-card">
      <template #header>
        <div class="chart-header-absolute">
          <span></span> <!-- 占位元素 -->
          <div class="chart-title-absolute">清洁度变化趋势</div>
          <el-radio-group v-model="chartTimeRange" size="small" @change="updateChart">
            <el-radio-button label="week">最近一周</el-radio-button>
            <el-radio-button label="month">最近一个月</el-radio-button>
            <el-radio-button label="year">最近一年</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <div class="chart-container" ref="chartContainer"></div>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card">
      <el-table
        :data="historyList"
        border
        stripe
        style="width: 100%"
        :default-sort="{ prop: 'inspectionTime', order: 'descending' }"
        :loading="loading">
        <el-table-column prop="inspectionTime" label="检测时间" sortable width="180"></el-table-column>
        <el-table-column prop="cleanStatus" label="清洁度状态" sortable width="120">
          <template #default="scope">
            <el-tag 
              :type="scope.row.cleanStatus === 'C' ? 'success' : scope.row.cleanStatus === 'M' ? 'warning' : 'danger'" 
              size="small">
              {{ scope.row.cleanStatus === 'C' ? '清洁 (C)' : 
                scope.row.cleanStatus === 'M' ? '中度 (M)' : 
                scope.row.cleanStatus === 'S' ? '严重 (S)' : '未知' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="检测照片" width="150">
          <template #default="scope">
            <el-image
              v-if="scope.row.photos && scope.row.photos.length > 0"
              style="width: 80px; height: 60px"
              :src="scope.row.photos[0]"
              :preview-src-list="scope.row.photos"
              preview-teleported
              fit="cover"
              :initial-index="0"
            >
              <template #error>
                <div class="image-error">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            <span v-else class="el-text--info">无照片</span>
          </template>
        </el-table-column>
        <el-table-column prop="inspector" label="检测人员" width="120"></el-table-column>
        <el-table-column prop="inspectionMethod" label="检测方式" width="120"></el-table-column>
        <el-table-column prop="remarks" label="备注" min-width="120"></el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :current-page="currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-card>

    <!-- 检测详情对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="检测详情"
      width="800px"
      destroy-on-close
    >
      <div v-if="currentInspection">
        <div class="mb-4">
          <div style="display: flex;">
            <div style="width: 33%;">
              <div class="mb-2"><span style="color: var(--el-text-color-secondary);">检测时间：</span>{{ currentInspection.inspectionTime }}</div>
              <div class="mb-2"><span style="color: var(--el-text-color-secondary);">检测人员：</span>{{ currentInspection.inspector }}</div>
              <div class="mb-2"><span style="color: var(--el-text-color-secondary);">检测方式：</span>{{ currentInspection.inspectionMethod }}</div>
              <div class="mb-2">
                <span style="color: var(--el-text-color-secondary);">清洁度状态：</span>
                <span :class="{
                  'el-text--success': currentInspection.cleanStatus === 'C',
                  'el-text--warning': currentInspection.cleanStatus === 'M',
                  'el-text--danger': currentInspection.cleanStatus === 'S'
                }">
                  {{ currentInspection.cleanStatus === 'C' ? '清洁 (C)' : 
                    currentInspection.cleanStatus === 'M' ? '中度 (M)' : 
                    currentInspection.cleanStatus === 'S' ? '严重 (S)' : '未知' }}
                </span>
              </div>
            </div>
            <div style="width: 67%;">
              <div class="mb-2"><span style="color: var(--el-text-color-secondary);">备注：</span></div>
              <div style="padding: 8px; background-color: #f5f7fa; border-radius: 4px; min-height: 80px;">{{ currentInspection.remarks || '无' }}</div>
            </div>
          </div>
        </div>

        <div style="margin-top: 16px;">
          <div style="color: var(--el-text-color-secondary); margin-bottom: 8px;">检测照片：</div>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
            <div v-for="(photo, index) in currentInspection.photos" :key="index" class="inspection-photo">
              <el-image
                style="width: 100%; height: 180px"
                :src="photo"
                :preview-src-list="currentInspection.photos"
                :initial-index="index"
                fit="cover"
              >
                <template #error>
                  <div class="image-error">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
              <div style="margin-top: 4px; font-size: 12px; text-align: center; color: var(--el-text-color-secondary);">照片 {{ index + 1 }}</div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import * as echarts from 'echarts'
import { Picture } from '@element-plus/icons-vue'
import { getSkidCleanHistory, getSkidCleanTrend } from '@/api/skid'
import type { CleanHistoryResponse, CleanHistoryQueryParams } from '@/api/skid/type'

// 定义检测记录类型接口
interface InspectionRecord {
  id: number;
  inspectionTime: string
  cleanStatus: 'C' | 'M' | 'S'
  inspector: string
  inspectionMethod: string
  remarks: string
  photos: string[]
}

const router = useRouter()
const route = useRoute()
const currentPage = ref(1)
const pageSize = ref(10)
const skidId = ref('')
const filters = reactive({
  skidId: '',
  cleanStatus: '' as 'C' | 'M' | 'S' | '',
  inspectionTimeRange: [] as Date[]
})
const chartTimeRange = ref<'week' | 'month' | 'year'>('month')
const chartContainer = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null
const dialogVisible = ref(false)
const currentInspection = ref<InspectionRecord | null>(null)
const historyList = ref<InspectionRecord[]>([])
const total = ref(0)
const loading = ref(false)

// 解析URL参数
onMounted(() => {
  const id = route.query.skidId as string
  if (id) {
    skidId.value = id
    // 加载数据
    loadHistoryData()
  }
  
  // 初始化图表
  nextTick(() => {
    initChart()
  })
})

// 初始化趋势图
const initChart = () => {
  if (chartContainer.value) {
    chart = echarts.init(chartContainer.value)
    updateChart()
    
    // 监听窗口大小变化，重置图表大小
    window.addEventListener('resize', () => {
      chart?.resize()
    })
  }
}

// 更新趋势图数据
const updateChart = async () => {
  if (!chart) return
  
  try {
    // 调用API获取趋势数据
    const res = await getSkidCleanTrend(skidId.value, chartTimeRange.value)
    
    if (res.ok && res.data) {
      const { dates, statusValues, statusMap } = res.data      
      
      const option: any = {
        tooltip: {
          trigger: 'axis',
          formatter: function(params: any) {
            const statusValue = params[0].value[1]
            const statusText = statusMap[statusValue]
            const date = new Date(params[0].value[0])
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            const hours = String(date.getHours()).padStart(2, '0')
            const minutes = String(date.getMinutes()).padStart(2, '0')
            const seconds = String(date.getSeconds()).padStart(2, '0')
            const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
            return `检测时间: ${formattedDate}<br/>清洁度状态: ${statusText}`
          }
        },
        xAxis: {
          type: 'time',
          axisLabel: {
            rotate: 45,
            margin: 15, // 增加margin使标签与轴线保持距离
            formatter: function (value: number) {
              const date = new Date(value);
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              const hours = String(date.getHours()).padStart(2, '0');
              const minutes = String(date.getMinutes()).padStart(2, '0');
              return `${month}-${day}\n${hours}:${minutes}`; // 使用换行符分为两行显示
            }
          },
          splitLine: {
            show: false // 隐藏X轴网格线
          }
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 4,
          interval: 1,
          axisLabel: {
            formatter: function (value: number) {
              const labels = ['', '清洁 (C)', '中度 (M)', '严重 (S)', '']
              return labels[value] || ''
            }
          },
          splitLine: {
            show: false // 隐藏Y轴网格线
          }
        },
        visualMap: {
          show: false,
          pieces: [
            {gt: 0, lte: 1.5, color: '#67C23A'},
            {gt: 1.5, lte: 2.5, color: '#E6A23C'},
            {gt: 2.5, lte: 3.5, color: '#F56C6C'}
          ]
        },
        series: [
          {
            data: dates.map((date, index) => {
              // 确保日期是Date对象
              const dateObj = new Date(date);
              return [dateObj, statusValues[index]];
            }),
            type: 'line',
            smooth: true,
            lineStyle: {
              width: 3
            },
            symbol: 'circle',
            symbolSize: 8
          }
        ]
      }
      
      // 设置图表的grid布局，优化边距使图表更紧凑
      option.grid = {
        left: 10,      // 减小左侧边距
        top: 10,       // 减小顶部边距
        right: 10,     // 减小右侧边距
        bottom: 30,    // 增加底部边距，为X轴标签留出空间
        containLabel: true
      };
      
      chart.setOption(option)
    } else {
      console.error('获取趋势数据失败:', res.message)
    }
  } catch (error) {
    console.error('获取趋势数据出错:', error)
    // 移除使用模拟数据的代码，只保留错误处理
  }
}

// 格式化日期
const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 加载历史数据
const loadHistoryData = async () => {
  loading.value = true
  try {
    const params: any = {
      skidId: filters.skidId || skidId.value,
      page: currentPage.value,
      size: pageSize.value,
      cleanStatus: filters.cleanStatus || undefined,
      startTime: filters.inspectionTimeRange && filters.inspectionTimeRange[0] ? formatDate(filters.inspectionTimeRange[0]) : undefined,
      endTime: filters.inspectionTimeRange && filters.inspectionTimeRange[1] ? formatDate(filters.inspectionTimeRange[1]) : undefined
    }
    
    const res = await getSkidCleanHistory(params)
    
    if (res.ok && res.data) {
      historyList.value = res.data.records.map(item => ({
        id: item.id,
        inspectionTime: item.inspectionTime,
        cleanStatus: item.cleanStatus,
        inspector: item.inspector,
        inspectionMethod: item.inspectionMethod,
        remarks: item.remarks || '',
        photos: item.photos || []
      }))
      total.value = res.data.total
    } else {
      console.error('获取历史数据失败:', res.message)
      historyList.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('获取历史数据出错:', error)
    // 移除使用模拟数据的代码，只保留错误处理
    historyList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 查看检测详情
const viewInspectionDetail = (record: InspectionRecord) => {
  currentInspection.value = record
  dialogVisible.value = true
}

// 查询数据
const searchData = () => {
  currentPage.value = 1
  // 如果搜索框有雪橇编号，则更新顶部显示的雪橇编号
  if (filters.skidId) {
    skidId.value = filters.skidId;
  }
  loadHistoryData().then(() => {
    // 加载历史数据成功后，更新趋势图
    updateChart();
  });
}

// 重置筛选条件
const resetFilters = () => {
  filters.skidId = '';
  filters.cleanStatus = '';
  filters.inspectionTimeRange = [];
  currentPage.value = 1;
  // 重新获取路由参数中的雪橇编号
  const id = route.query.skidId as string;
  if (id) {
    skidId.value = id;
  }
  // 重置后更新趋势图
  loadHistoryData().then(() => {
    // 重置后更新趋势图
    updateChart();
  });
}

// 返回雪橇一览表
const backToHome = () => {
  router.push('/skid/home')
}

// 分页相关方法
const handleSizeChange = (size: number) => {
  pageSize.value = size
  loadHistoryData()
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
  loadHistoryData()
}
</script>

<style scoped>
.history-clean-container {
  padding: 20px;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 16px;
}

.skid-title {
  background-color: #f0f2f5;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 16px;
  color: #303133;
  margin: 0;
}

.filter-card {
  margin-bottom: 5px;
}

.filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.filter-item {
  width: 200px;
}

.date-picker-item {
  width: 380px;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.stats-card {
  margin-bottom: 5px;
}

.chart-container {
  width: 100%;
  height: 300px;
  margin-top: 5px;
  margin-bottom: 5px;
}

.table-card {
  margin-bottom: 5px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

/* 方案三：使用绝对定位 */
.chart-header-absolute {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  height: 32px; /* 固定高度，确保标题垂直居中 */
}

.chart-title-absolute {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-weight: 500;
  font-size: 16px;
  white-space: nowrap; /* 防止标题换行 */
  z-index: 1; /* 确保标题在上层 */
}

.image-error {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #f5f7fa;
  color: #909399;
}

/* 使用Element Plus颜色系统 */
.el-text--success {
  color: var(--el-color-success);
}

.el-text--warning {
  color: var(--el-color-warning);
}

.el-text--danger {
  color: var(--el-color-danger);
}

.el-text--info {
  color: var(--el-color-info);
}

.mb-2 {
  margin-bottom: 8px;
}

.mb-4 {
  margin-bottom: 16px;
}
</style> 