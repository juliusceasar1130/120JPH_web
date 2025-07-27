<!--
 * 最后修改时间->2025-07-24 14:30
 * 作者：chenliang
-->
<template>
  <div class="skid-container">


    <!-- 筛选条件 -->
    <el-card class="mb-4 filter-card">
      <div class="filter-container">
        <!-- 主要筛选条件行 - 水平2:4:4分割 -->
        <div class="filter-main-row filter-section filter-basic">
          <!-- 雪橇编号筛选器 - 占2份 -->
          <div class="filter-item filter-skid">
            <div class="filter-label">雪橇编号：</div>
            <el-input 
              placeholder="请输入雪橇编号" 
              v-model="filters.skidId" 
              class="filter-input"
              clearable>
            </el-input>
          </div>
          
          <!-- 清洁度状态筛选器 - 占4份 -->
          <div class="filter-item filter-clean">
            <div class="filter-label">清洁度状态：</div>
            <el-radio-group v-model="filters.cleanStatus" class="filter-radio-group">
              <el-radio label="">全部</el-radio>
              <el-radio label="C">清洁 (C)</el-radio>
              <el-radio label="M">中度 (M)</el-radio>
              <el-radio label="S">严重 (S)</el-radio>
            </el-radio-group>
          </div>
          
          <!-- 上下线状态筛选器 - 占4份 -->
          <div class="filter-item filter-online">
            <div class="filter-label">上下线状态：</div>
            <el-radio-group v-model="filters.onlineStatus" class="filter-radio-group">
              <el-radio label="">全部</el-radio>
              <el-radio label="online">在线</el-radio>
              <el-radio label="offline">离线</el-radio>
              <el-radio label="cleaning">清洁中</el-radio>
            </el-radio-group>
          </div>
        </div>
        
        <!-- 时间筛选器区域 -->
        <div class="filter-section filter-time">
          <div class="time-filters-row">
            <!-- 检测时间筛选器 -->
            <div class="time-filter-item">
              <div class="filter-label">检测时间：</div>
              <div class="date-picker-wrapper">
                <el-date-picker
                  v-model="filters.inspectionTimeRange"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  class="filter-date-picker"
                  clearable>
                </el-date-picker>
              </div>
            </div>
            
            <!-- 状态变更时间筛选器 -->
            <div class="time-filter-item">
              <div class="filter-label">状态变更时间：</div>
              <div class="date-picker-wrapper">
                <el-date-picker
                  v-model="filters.statusChangeTimeRange"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  class="filter-date-picker"
                  clearable>
                </el-date-picker>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 按钮组 -->
        <div class="filter-buttons">
          <el-button type="primary" @click="searchData">搜索</el-button>
          <el-button @click="resetFilters">重置</el-button>
        </div>
      </div>
    </el-card>

    <!-- 数据表格 -->
    <el-card>
      <div class="flex justify-end mb-4">      
        <el-button type="primary" @click="openAddSkidDialog" v-if="showAddButton">
          <el-icon><Plus /></el-icon> 新增雪橇
        </el-button>
      </div>
      
      <el-table
        :data="skidList"
        border
        stripe
        style="width: 100%"
        :default-sort="{ prop: 'skidId', order: 'ascending' }">
        <el-table-column prop="skidId" label="雪橇编号" sortable width="120" align="center" header-align="center"></el-table-column>
        <el-table-column prop="cleanStatus" label="清洁度状态" sortable width="120" align="center" header-align="center">
          <template #default="scope">
            <div class="status-badge" :class="{
              'status-clean': scope.row.cleanStatus === 'C',
              'status-medium': scope.row.cleanStatus === 'M',
              'status-severe': scope.row.cleanStatus === 'S'
            }">
              {{ scope.row.cleanStatus === 'C' ? '清洁 (C)' : 
                scope.row.cleanStatus === 'M' ? '中度 (M)' : 
                scope.row.cleanStatus === 'S' ? '严重 (S)' : '未知' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="inspectionTime" label="检测时间" sortable width="180" align="center" header-align="center"></el-table-column>
        <el-table-column prop="onlineStatus" label="上下线状态" sortable width="120" align="center" header-align="center">
          <template #default="scope">
            <div class="status-badge" :class="{
              'status-online': scope.row.onlineStatus === 'online',
              'status-cleaning': scope.row.onlineStatus === 'cleaning',
              'status-offline': scope.row.onlineStatus === 'offline'
            }">
              {{ scope.row.onlineStatus === 'online' ? '在线' : 
                 scope.row.onlineStatus === 'cleaning' ? '清洁中' : '离线' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="statusChangeTime" label="上下线时间" sortable width="180" align="center" header-align="center"></el-table-column>
        <el-table-column label="最新检测照片" width="120" align="center" header-align="center">
          <template #default="scope">
            <el-image
              v-if="scope.row.lastPhoto"
              style="width: 80px; height: 60px"
              :src="scope.row.lastPhoto"
              :preview-src-list="[scope.row.lastPhoto]"
              preview-teleported
              fit="cover">
              <template #error>
                <div class="image-error">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            <span v-else class="text-gray-400">无照片</span>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注" min-width="120" align="center" header-align="center"></el-table-column>
        <el-table-column label="操作" fixed="right" width="280" align="center" header-align="center">
          <template #default="scope">
            <div class="button-group">
              <el-button 
                type="primary" 
                size="small" 
                @click="viewCleanHistory(scope.row.skidId)">
                清洁历史
              </el-button>
              <el-button 
                type="info" 
                size="small" 
                @click="viewStatusHistory(scope.row.skidId)">
                上下线历史
              </el-button>
              <el-button 
                type="warning" 
                size="small" 
                @click="openEditSkidDialog(scope.row)">
                编辑
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="flex justify-end mt-4">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :total="total"
          :page-sizes="[5, 20, 50, 100]"
          :page-size="pageSize"
          :current-page="currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-card>

    <!-- 编辑雪橇对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      :title="isAddingSkid ? '新增雪橇' : '编辑雪橇信息'"
      width="600px"
      destroy-on-close
    >
      <el-form :model="editingSkid" label-width="120px" :rules="skidRules" ref="skidFormRef">
        <el-form-item label="雪橇编号" prop="skidId">
          <el-input v-model="editingSkid.skidId" :disabled="!isAddingSkid"></el-input>
        </el-form-item>
        <el-form-item label="清洁度状态" prop="cleanStatus">
          <el-select v-model="editingSkid.cleanStatus" style="width: 100%" disabled>
            <el-option label="清洁 (C)" value="C"></el-option>
            <el-option label="中度 (M)" value="M"></el-option>
            <el-option label="严重 (S)" value="S"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上下线状态" prop="onlineStatus" class="status-highlight">
          <el-radio-group v-model="editingSkid.onlineStatus" class="online-status-radio">
            <el-radio label="online" class="online-radio">
              <span class="status-text status-online">在线</span>
            </el-radio>
            <el-radio label="offline" class="offline-radio">
              <span class="status-text status-offline">离线</span>
            </el-radio>
            <el-radio label="cleaning" class="cleaning-radio">
              <span class="status-text status-cleaning">清洁中</span>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="editingSkid.remarks" type="textarea" rows="3"></el-input>
        </el-form-item>
        <el-form-item label="检测照片" v-if="!isAddingSkid">
          <div v-if="editingSkid.lastPhoto">
            <el-image
              style="width: 100px; height: 100px"
              :src="editingSkid.lastPhoto"
              fit="cover"
              preview-teleported
              :preview-src-list="[editingSkid.lastPhoto]">
            </el-image>
          </div>
          <div v-else class="text-gray-400">暂无照片</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitSkidForm">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Picture, Plus } from '@element-plus/icons-vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { getSkidList, addSkid, updateSkid } from '@/api/skid'
import type { SkidInfo, AddSkidParams, UpdateSkidParams } from '@/api/skid/type'

// 定义雪橇数据类型接口
interface SkidRecord {
  skidId: string
  cleanStatus: 'C' | 'M' | 'S'
  inspectionTime: string
  onlineStatus: 'online' | 'offline' | 'cleaning'
  statusChangeTime: string
  remarks?: string
  lastPhoto?: string
}

const router = useRouter()
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)
const showAddButton = ref(false) // 默认隐藏新增雪橇按钮

// 筛选条件
const filters = reactive({
  skidId: '',
  cleanStatus: '',
  onlineStatus: '',
  inspectionTimeRange: [],
  statusChangeTimeRange: []
})

// 雪橇列表数据
const skidList = ref<SkidRecord[]>([])

// 加载雪橇列表数据
const loadSkidList = async () => {
  loading.value = true
  
  try {
    const queryParams: any = {
      page: currentPage.value,
      size: pageSize.value,
      skidId: filters.skidId || undefined,
      cleanStatus: filters.cleanStatus as 'C' | 'M' | 'S' | undefined,
      onlineStatus: filters.onlineStatus as 'online' | 'offline' | 'cleaning' | undefined,
      inspectionTimeStart: filters.inspectionTimeRange && filters.inspectionTimeRange[0] ? formatDate(filters.inspectionTimeRange[0]) : undefined,
      inspectionTimeEnd: filters.inspectionTimeRange && filters.inspectionTimeRange[1] ? formatDate(filters.inspectionTimeRange[1]) : undefined,
      statusChangeTimeStart: filters.statusChangeTimeRange && filters.statusChangeTimeRange[0] ? formatDate(filters.statusChangeTimeRange[0]) : undefined,
      statusChangeTimeEnd: filters.statusChangeTimeRange && filters.statusChangeTimeRange[1] ? formatDate(filters.statusChangeTimeRange[1]) : undefined
    }
    
    const res = await getSkidList(queryParams)
    
    if (res.ok) {
      skidList.value = res.data?.records as SkidRecord[] || []
      total.value = res.data?.total || 0
    } else {
      ElMessage.error(res.message || '获取雪橇列表失败')
    }
  } catch (error) {
    console.error('加载雪橇列表出错:', error)
    ElMessage.error('获取雪橇列表时出现错误')
    
    // 使用模拟数据作为后备
    skidList.value = [
      { 
        skidId: 'SK001', 
        cleanStatus: 'C', 
        inspectionTime: '2024-05-15 08:30:25', 
        onlineStatus: 'online', 
        statusChangeTime: '2024-05-15 08:30:00',
        remarks: '正常运行',
        lastPhoto: 'https://img1.baidu.com/it/u=1855002638,3583285371&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=333'
      },
      { 
        skidId: 'SK002', 
        cleanStatus: 'M', 
        inspectionTime: '2024-05-15 09:15:32', 
        onlineStatus: 'online', 
        statusChangeTime: '2024-05-14 14:22:10',
        remarks: '需要定期清洁',
        lastPhoto: 'https://img0.baidu.com/it/u=2231572125,3559500969&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=313'
      }
    ]
    total.value = skidList.value.length
  } finally {
    loading.value = false
  }
}

// 编辑相关
const editDialogVisible = ref(false)
const isAddingSkid = ref(false)
const editingSkid = ref<SkidRecord>({
  skidId: '',
  cleanStatus: 'C',
  inspectionTime: '',
  onlineStatus: 'online',
  statusChangeTime: '',
  remarks: ''
})
const photoFile = ref<File | null>(null)
const skidFormRef = ref<FormInstance>()

// 表单验证规则
const skidRules = {
  skidId: [
    { required: true, message: '请输入雪橇编号', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
  ],
  cleanStatus: [
    { required: true, message: '请选择清洁度状态', trigger: 'change' }
  ],
  onlineStatus: [
    { required: true, message: '请选择上下线状态', trigger: 'change' }
  ]
}

// 打开编辑对话框
const openEditSkidDialog = (row: SkidRecord) => {
  isAddingSkid.value = false
  editingSkid.value = { ...row }
  editDialogVisible.value = true
}

// 打开新增对话框
const openAddSkidDialog = () => {
  isAddingSkid.value = true
  editingSkid.value = {
    skidId: '',
    cleanStatus: 'C',
    inspectionTime: '',
    onlineStatus: 'online',
    statusChangeTime:'',
    remarks: ''
  }
  editDialogVisible.value = true
}



// 提交表单
const submitSkidForm = async () => {
  if (!skidFormRef.value) return
  
  await skidFormRef.value.validate(async (valid) => {
    if (valid) {
      // 设置当前时间
      const now = formatDate(new Date())
      
      // if (editingSkid.value.cleanStatus !== (isAddingSkid.value ? 'C' : getOriginalSkid(editingSkid.value.skidId)?.cleanStatus)) {
      //   editingSkid.value.inspectionTime = now
      // }
      
      // if (editingSkid.value.onlineStatus !== (isAddingSkid.value ? 'online' : getOriginalSkid(editingSkid.value.skidId)?.onlineStatus)) {
      //   editingSkid.value.statusChangeTime = now
      // }
      
      // 处理照片（在实际应用中，这里会上传照片到服务器）
      if (photoFile.value) {
        // 模拟上传成功后的URL（实际中这里会用服务器返回的URL）
        const randomPhoto = [
          'https://img1.baidu.com/it/u=3571041241,4255270&fm=253&fmt=auto&app=138&f=JPEG?w=667&h=500',
          'https://img1.baidu.com/it/u=3746746777,868920430&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=333',
          'https://img0.baidu.com/it/u=3655449823,424301349&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=333'
        ]
        const randomIndex = Math.floor(Math.random() * randomPhoto.length)
        editingSkid.value.lastPhoto = randomPhoto[randomIndex]
      }
      
      if (isAddingSkid.value) {
        // 添加新雪橇
        const params: AddSkidParams = {
          skidId: editingSkid.value.skidId,
          cleanStatus: editingSkid.value.cleanStatus,
          onlineStatus: editingSkid.value.onlineStatus,
          remarks: editingSkid.value.remarks || '',
          inspectionTime:'',
          statusChangeTime:'',
          lastPhoto:'',
          createdAt:'',
          updatedAt:'',
          photo: photoFile.value || undefined
        }
        
        try {
          loading.value = true
          const res = await addSkid(params)
          if (res.ok) {
            ElMessage.success('雪橇添加成功')
            editDialogVisible.value = false
            // 刷新数据列表
            loadSkidList()
          } else {
            ElMessage.error(res.message || '添加雪橇失败')
          }
        } catch (error) {
          console.error('添加雪橇出错:', error)
          ElMessage.error('添加雪橇时出现错误')      
          editDialogVisible.value = false
        } finally {
          loading.value = false
        }
      } else {
        // 更新现有雪橇
        const params: UpdateSkidParams = {
          skidId: editingSkid.value.skidId,
          cleanStatus: editingSkid.value.cleanStatus,
          onlineStatus: editingSkid.value.onlineStatus,
          remarks: editingSkid.value.remarks,
          photo: photoFile.value || undefined
        }
        
        // 只有当onlineStatus发生变化时，才传递statusChangeTime参数
        const originalSkid = getOriginalSkid(editingSkid.value.skidId)     
        if (originalSkid && editingSkid.value.onlineStatus !== originalSkid?.onlineStatus) {
         
          params.statusChangeTime = now
        }
        
        try {
          loading.value = true
          const res = await updateSkid(params)
          if (res.ok) {
            ElMessage.success('雪橇信息更新成功')
            editDialogVisible.value = false
            // 刷新数据列表
            loadSkidList()
          } else {
            ElMessage.error(res.message || '更新雪橇信息失败')
          }
        } catch (error) {
          console.error('更新雪橇信息出错:', error)
          ElMessage.error('更新雪橇信息时出现错误')         
          editDialogVisible.value = false
        } finally {
          loading.value = false
        }
      }
    } else {
      return false
    }
  })
}

// 获取原始雪橇数据
const getOriginalSkid = (skidId: string): SkidRecord | undefined => {
  return skidList.value.find(item => item.skidId === skidId)
}

// 格式化日期
const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
}

// 查询数据
const searchData = () => {
  currentPage.value = 1 // 重置为第一页
  loadSkidList()
}

// 重置筛选条件
const resetFilters = () => {
  filters.skidId = ''
  filters.cleanStatus = '' // 空字符串对应"全部"选项
  filters.onlineStatus = '' // 空字符串对应"全部"选项
  filters.inspectionTimeRange = []
  filters.statusChangeTimeRange = []
  
  // 重置后自动查询
  searchData()
}

// 查看清洁历史
const viewCleanHistory = (skidId: string) => {
  router.push({
    path: '/skid/history-clean',
    query: { skidId }
  })
}

// 查看上下线历史
const viewStatusHistory = (skidId: string) => {
  router.push({
    path: '/skid/history-status',
    query: { skidId }
  })
}

// 分页相关方法
const handleSizeChange = (size: number) => {
  pageSize.value = size
  loadSkidList()
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
  loadSkidList()
}

// 键盘事件处理 - 切换新增雪橇按钮显示状态
const handleKeydown = (event: KeyboardEvent) => {
  // 检测Ctrl+N组合键 (78是N键的keyCode)
  if (event.ctrlKey && event.key === 'm') {
    // 阻止浏览器默认行为（如打开新窗口）
    event.preventDefault()
    // 切换按钮显示状态
    showAddButton.value = !showAddButton.value
  }
}

// 在页面加载时获取数据并添加键盘事件监听
onMounted(() => {
  loadSkidList()
  // 添加键盘事件监听
  window.addEventListener('keydown', handleKeydown)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  // 移除键盘事件监听
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.skid-container {
  padding: 0px;
}

/* 筛选器卡片样式 */
.filter-card :deep(.el-card__body) {
  padding: 8px;
}

/* 筛选器容器样式 */
.filter-container {
  width: 100%;
}

/* 筛选区域通用样式 */
.filter-section {
  padding: 8px 12px;
  margin-bottom: 8px;
  border-radius: 6px;
}

/* 基本筛选区域样式（雪橇编号、清洁度状态、上下线状态） */
.filter-basic {
  background-color: #f0f5ff; /* 淡蓝色背景 */
  border: 1px solid #e8f0fe;
}

/* 时间筛选区域样式 */
.filter-time {
  background-color: #f3f9f1; /* 淡绿色背景 */
  border: 1px solid #e8f5e6;
}

/* 主要筛选条件行 - 水平2:4:4布局 */
.filter-main-row {
  display: grid;
  grid-template-columns: 2fr 4fr 4fr;
  gap: 12px;
  margin-bottom: 6px;
}

/* 雪橇编号筛选器样式 */
.filter-skid {
  min-width: 150px;
}

/* 清洁度状态筛选器样式 */
.filter-clean {
  min-width: 300px;
}

/* 上下线状态筛选器样式 */
.filter-online {
  min-width: 300px;
}

/* 时间筛选器行样式 */
.time-filters-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 6px;
}

/* 时间筛选器项样式 */
.time-filter-item {
  flex: 1;
  min-width: 300px;
  max-width: calc(50% - 10px);
  display: flex;
  flex-direction: row;
  align-items: center;
}

/* 筛选器网格布局 */
.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 8px;
  margin-bottom: 6px;
}

/* 筛选项样式 */
.filter-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 8px;
}

/* 标签样式 */
.filter-label {
  margin-bottom: 6px;
  font-weight: 600;
  color: #606266;
  font-size: 13px;
}

/* 时间筛选器标签靠右对齐 */
.time-filter-item .filter-label {
  text-align: right;
  padding-right: 10px;
  width: 120px;
  margin-bottom: 0;
}

/* 日期选择器容器 */
.time-filter-item .date-picker-wrapper {
  flex: 1;
}

/* 输入框样式 */
.filter-input {
  width: 100%;
}

/* 单选按钮组样式 */
.filter-radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

/* 日期选择器样式 */
.filter-date-picker {
  width: 100%;
}

/* 确保日期选择器不会重叠 */
:deep(.el-date-editor.el-input__wrapper) {
  width: 100%;
}

/* 日期范围选择器样式 */
:deep(.el-date-editor--datetimerange) {
  width: 100%;
}

/* 按钮组样式 */
.filter-buttons {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 8px;
  padding: 0 12px;
}

/* 响应式样式 */
@media screen and (max-width: 1200px) {
  .time-filters-row {
    flex-direction: column;
    gap: 12px;
  }
  
  .time-filter-item {
    max-width: 100%;
  }
}

@media screen and (max-width: 768px) {
  .filter-main-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .filter-grid {
    grid-template-columns: 1fr;
  }
  
  .time-filter-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .time-filter-item .filter-label {
    width: 100%;
    text-align: left;
    padding-right: 0;
    margin-bottom: 6px;
  }
  
  .time-filter-item .date-picker-wrapper {
    width: 100%;
  }
}

.text-success {
  color: #67C23A;
}

.text-warning {
  color: #E6A23C;
}

.text-danger {
  color: #F56C6C;
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

/* 操作按钮组样式 */
.button-group {
  display: flex;
  justify-content: center;
  gap: 8px;
}

/* 上下线状态单选框样式 */
.status-highlight {
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  border: 2px solid #e9ecef;
}

.online-status-radio {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.status-text {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 4px;
  font-weight: bold;
  min-width: 60px;
  text-align: center;
  font-size: 12px;
}

/* 状态标签样式 */
.status-badge {
  padding: 2px 4px;
  border-radius: 4px;
  /* font-weight: bold; */
  display: inline-block;
  text-align: center;
  min-width: 40px;
  color: white;
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
  /* border: 1px solid transparent; */
  font-size: 10px;
}

/* 清洁度状态样式 */
.status-clean {
  background-color: #13CE66;
  border-color: #0ca757;
}

.status-medium {
  background-color: #FFBA00;
  border-color: #e6a700;
}

.status-severe {
  background-color: #FF4949;
  border-color: #f03737;
}

/* 上下线状态样式 */
.status-online {
  background-color: #13CE66;
  border-color: #0ca757;
}

.status-offline {
  background-color: #8492A6;
  border-color: #758195;
}

.status-cleaning {
  background-color: #FFBA00;
  border-color: #e6a700;
}

.status-online {
  color: white;
  background-color: #67C23A;
}

.status-offline {
  color: white;
  background-color: #909399;
}

.status-cleaning {
  color: white;
  background-color: #E6A23C;
}
</style> 