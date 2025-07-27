<!--
 * 最后修改时间->2025-07-26 15:45
 * 作者：chenliang
-->
<template>
  <div class="history-status-container">
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
          placeholder="上下线状态" 
          v-model="filters.onlineStatus" 
          class="filter-item"
          clearable>
          <el-option label="在线" value="online"></el-option>
          <el-option label="离线" value="offline"></el-option>
          <el-option label="清洗中" value="cleaning"></el-option>
        </el-select>
        
        <el-date-picker
          v-model="filters.statusChangeTimeRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="状态变更开始时间"
          end-placeholder="状态变更结束时间"
          class="date-picker-item"
          clearable>
        </el-date-picker>
      </div>
      <div class="button-container">
        <el-button type="primary" @click="searchData">搜索</el-button>
        <el-button @click="resetFilters">重置</el-button>
      </div>
    </el-card>

    <!-- 运行状态概览 -->
    <el-card class="stats-card">
      <template #header>
        <div class="chart-header-absolute">
          <span></span> <!-- 占位元素 -->
          <div class="chart-title-absolute">运行状态概览</div>
          <el-radio-group v-model="chartTimeRange" size="small" @change="updateChart">
            <el-radio-button label="week">最近一周</el-radio-button>
            <el-radio-button label="month">最近一个月</el-radio-button>
            <el-radio-button label="year">最近一年</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <div class="stats-container">
        <div class="stat-item">
          <h3 class="stat-title">上线时长</h3>
          <div class="stat-value-container">
            <span class="stat-value">{{ stats.onlineHours || 0 }}</span>
            <span class="stat-unit">小时</span>
          </div>
        </div>
        <div class="stat-item">
          <h3 class="stat-title">上线率</h3>
          <div class="stat-value-container">
            <span class="stat-value success">{{ stats.onlineRate || '0%' }}</span>
          </div>
        </div>
        <div class="stat-item">
          <h3 class="stat-title">平均连续运行时间</h3>
          <div class="stat-value-container">
            <span class="stat-value">{{ stats.avgRunningTime || 0 }}</span>
            <span class="stat-unit">小时</span>
          </div>
        </div>
      </div>
      <div class="chart-container" ref="chartContainer"></div>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card">
      <el-table
        :data="historyList"
        border
        stripe
        style="width: 100%"
        :default-sort="{ prop: 'statusChangeTime', order: 'descending' }">
        <el-table-column prop="statusChangeTime" label="状态变更时间" sortable width="180"></el-table-column>
        <el-table-column prop="onlineStatus" label="上下线状态" sortable width="120">
          <template #default="scope">
            <el-tag 
              :type="scope.row.onlineStatus === 'online' ? 'success' : scope.row.onlineStatus === 'cleaning' ? 'warning' : 'info'" 
              size="small">
              {{ scope.row.onlineStatus === 'online' ? '在线' : scope.row.onlineStatus === 'cleaning' ? '清洗中' : '离线' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作人员" width="120"></el-table-column>
        <el-table-column prop="duration" label="持续时间" width="120"></el-table-column>
        <el-table-column prop="reason" label="原因" min-width="200"></el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagination.size"
          :current-page="pagination.current"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import { getSkidStatusHistory, getSkidStatusTrend, getSkidStatusStats } from '@/api/skid'
import type { SkidStatusHistory, StatusTrendResponse, SkidStatusStatsResponse } from '@/api/skid/type'

// 定义上下线记录类型接口
interface StatusRecord {
  id?: number;
  skidId: string;
  statusChangeTime: string;
  onlineStatus: 'online' | 'offline' | 'cleaning';
  operator: string;
  duration?: string;
  reason?: string;
}

const router = useRouter()
const route = useRoute()
const skidId = ref('')
const filters = reactive({
  skidId: '',
  onlineStatus: '',
  statusChangeTimeRange: [] as Date[]
})
const chartTimeRange = ref<'week' | 'month' | 'year'>('month')
const chartContainer = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null

// 分页相关
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

// 统计数据
const stats = reactive({
  onlineHours: 0,
  onlineRate: '0%',
  avgRunningTime: 0
})

// 历史记录列表
const historyList = ref<StatusRecord[]>([])

// 加载状态
const loading = ref(false)
const chartLoading = ref(false)



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
  if (!skidId.value && !filters.skidId) return
  
  loading.value = true
  try {
    const params = {
      skidId: filters.skidId || skidId.value,
      page: pagination.current,
      size: pagination.size,
      onlineStatus: (filters.onlineStatus as 'online' | 'offline' | 'cleaning' | undefined) || undefined,
      startTime: filters.statusChangeTimeRange && filters.statusChangeTimeRange[0] ? formatDate(filters.statusChangeTimeRange[0]) : undefined,
      endTime: filters.statusChangeTimeRange && filters.statusChangeTimeRange[1] ? formatDate(filters.statusChangeTimeRange[1]) : undefined
    }
    
    const res = await getSkidStatusHistory(params)
    
    if (res.ok && res.data) {
      historyList.value = res.data.records
      pagination.total = res.data.total
      pagination.current = res.data.current
      pagination.size = res.data.size
      
      // 获取统计数据
      loadStatsData()
      
      // 更新图表
      updateChart()
    } else {
      historyList.value = []
      pagination.total = 0
      ElMessage.error(res.message || '获取历史记录失败')
    }
  } catch (error) {
    console.error('获取历史数据出错:', error)
    historyList.value = []
    pagination.total = 0
    ElMessage.error('获取历史记录失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}

// 加载统计数据
const loadStatsData = async () => {
  if (!skidId.value && !filters.skidId) return
  
  try {
    const res = await getSkidStatusStats(filters.skidId || skidId.value, chartTimeRange.value)
    
    if (res.ok && res.data) {
      // 更新统计数据
      stats.onlineHours = res.data.onlineHours
      stats.onlineRate = res.data.onlineRate
      stats.avgRunningTime = res.data.avgRunningTime
    } else {
      // 如果API调用失败，重置统计数据
      stats.onlineHours = 0
      stats.onlineRate = '0%'
      stats.avgRunningTime = 0
      console.error('获取统计数据失败:', res.message)
    }
  } catch (error) {
    console.error('获取统计数据出错:', error)
    stats.onlineHours = 0
    stats.onlineRate = '0%'
    stats.avgRunningTime = 0
  }
}

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
  if (!chart || !skidId.value) return
  
  // 当图表时间范围改变时，重新加载统计数据
  loadStatsData()
  
  chartLoading.value = true
  try {
    // 调用API获取趋势数据
    const res = await getSkidStatusTrend(skidId.value, chartTimeRange.value)
    
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
            return `${formattedDate}<br/>状态: ${statusText}`
          }
        },
        xAxis: {
          type: 'time',
          axisLabel: {
            rotate: 45,
            margin: 0, // 减小margin使标签更贴近轴线
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
          min: -0.1,
          max: 1.1,
          interval: 0.5,
          axisLabel: {
            formatter: function (value: number) {
              if (value === 0) return '离线';
              if (value === 0.5) return '清洗中';
              if (value === 1) return '在线';
              return '';
            }
          },
          splitLine: {
            show: false // 隐藏Y轴网格线
          }
        },
        series: [
          {
            data: dates.map((date, index) => {
              // 确保日期是Date对象
              const dateObj = new Date(date);
              return [dateObj, statusValues[index]];
            }),
            type: 'line',
            step: 'end',
            itemStyle: {
              color: function(params: any) {
                const value = Array.isArray(params.value) ? params.value[1] : params.value;
                if (value === 1) return '#67C23A'; // 在线 - 绿色
                if (value === 0.5) return '#E6A23C'; // 清洗中 - 黄色
                return '#909399'; // 离线 - 灰色
              }
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: 'rgba(103, 194, 58, 0.2)'
                }, {
                  offset: 1,
                  color: 'rgba(103, 194, 58, 0)'
                }]
              }
            }
          }
        ]
      }
      
      // 设置图表的grid布局，优化边距使图表更紧凑
      option.grid = {
        left: 10,      // 进一步减小左侧边距
        top: 10,       // 进一步减小顶部边距
        right: 10,     // 进一步减小右侧边距
        bottom: 10,    // 进一步减小底部边距，使X轴更贴近底部
        containLabel: true
      };
      
      chart.setOption(option)
    } else {
      console.error('获取趋势数据失败:', res.message)
      // 如果API调用失败，则使用默认空图表
      const today = new Date()
      const formattedDate = formatDate(today).split(' ')[0]
      
      const option: any = {
        tooltip: {
          trigger: 'axis',
          formatter: function(params: any) {
            let status = '离线'
            return `${params[0].axisValue}<br/>状态: ${status}`
          }
        },
        xAxis: {
          type: 'time',
          axisLabel: {
            formatter: '{yyyy-MM-dd HH:mm}'
          }
        },
        yAxis: {
          type: 'value',
          min: -0.1,
          max: 1.1,
          interval: 0.5,
          axisLabel: {
            formatter: function (value: number) {
              if (value === 0) return '离线';
              if (value === 0.5) return '清洗中';
              if (value === 1) return '在线';
              return '';
            }
          }
        },
        series: [
          {
            data: [[new Date(formattedDate), 0]],
            type: 'line',
            step: 'end'
          }
        ]
      }
      
      chart.setOption(option)
    }
  } catch (error) {
    console.error('获取趋势数据出错:', error)
    // 错误处理，显示空图表
    const today = new Date()
    const formattedDate = formatDate(today).split(' ')[0]
    
    const option: any = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'time',
        axisLabel: {
          formatter: '{yyyy-MM-dd HH:mm}'
        },
        splitLine: {
          show: false // 隐藏X轴网格线
        }
      },
      yAxis: {
        type: 'value',
        min: -0.1,
        max: 1.1,
        interval: 0.5,
        splitLine: {
          show: false // 隐藏Y轴网格线
        }
      },
      series: [
        {
          data: [[new Date(formattedDate), 0]],
          type: 'line'
        }
      ]
    }
    
    chart.setOption(option)
  } finally {
    chartLoading.value = false
  }
}

// 查询数据
const searchData = () => {
  pagination.current = 1
  // 如果搜索框有雪橇编号，则更新顶部显示的雪橇编号
  if (filters.skidId) {
    skidId.value = filters.skidId;
  }
  // 加载历史数据
  loadHistoryData();
  // 更新统计数据和图表
  loadStatsData();
  updateChart();
}

// 重置筛选条件
const resetFilters = () => {
  filters.skidId = ''
  filters.onlineStatus = ''
  filters.statusChangeTimeRange = []
  pagination.current = 1
  // 重新获取路由参数中的雪橇编号
  const id = route.query.skidId as string;
  if (id) {
    skidId.value = id;
  }
  // 加载历史数据
  loadHistoryData();
  // 更新统计数据和图表
  loadStatsData();
  updateChart();
}

// 返回雪橇一览表
const backToHome = () => {
  router.push('/skid/home')
}

// 分页相关方法
const handleSizeChange = (size: number) => {
  pagination.size = size
  loadHistoryData();
}

const handleCurrentChange = (page: number) => {
  pagination.current = page
  loadHistoryData();
}
</script>

<style scoped>
.history-status-container {
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

.stats-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  gap: 8px;
}

.stat-item {
  width: 32%;
  background-color: #f5f7fa;
  padding: 12px;
  border-radius: 8px;
}

.stat-title {
  font-size: 10px;
  font-weight: bold;
  margin-bottom: 6px;
  text-align: center;
  color: var(--el-text-color-secondary);
}

.stat-value-container {
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.stat-value.success {
  color: var(--el-color-success);
}

.stat-unit {
  margin-left: 8px;
  color: #909399;
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

/* 使用Element Plus颜色系统 */
.el-text--success {
  color: var(--el-color-success);
}

.el-text--warning {
  color: var(--el-color-warning);
}

.el-text--info {
  color: var(--el-color-info);
}
</style> 