<!--
最后修改时间->2025-08-13 10:30
主要内容->为右侧主要区域增加放大和恢复的切换功能，支持全屏弹窗显示
作者->chenliang
-->
<template>
  <div class="home-container">
    <!-- 顶部搜索区域 -->
    <div class="search-area">
      <div class="search-content">
        <!--搜索部分-->
        <el-card class="search-card">
          <el-row :gutter="15">
            <el-col :span="14">
              <el-form style="padding: 10px;">
                <el-form-item label="颜色" class="custom-form-item">
                  <div class="input-button-group">
                    <el-input v-model="params.COLOR" placeholder="请输入颜色" class="custom-input"></el-input>
                    <div class="button-group">
                      <el-button v-for="color in colorOptions" :key="color.value" size="small" :type="color.type"
                        :plain="color.plain" class="custom-button" @click="selectColor(color.value)">
                        {{ color.label }}
                      </el-button>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item label="车型" class="custom-form-item">
                  <div class="input-button-group">
                    <el-input v-model="params.BODY_TYPE" placeholder="请输入车型" class="custom-input"></el-input>
                    <div class="button-group">
                      <el-button v-for="type in bodyTypeOptions" :key="type.value" size="small" :type="type.type"
                        :plain="type.plain" class="custom-button" @click="selectBodyType(type.value)">
                        {{ type.label }}
                      </el-button>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item class="date-picker-item">
                  <div class="action-group">
                    <el-date-picker v-model="dateTimepickUp" type="datetimerange" :shortcuts="shortcuts"
                      range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" @change="datepickup"
                      value-format="YYYY-MM-DDTHH:mm:ss" class="custom-date-picker" />
                    <div class="action-buttons">
                      <el-button type="primary" icon="Search" class="action-button" @click="search">搜索</el-button>
                      <el-button type="info" icon="Refresh" class="action-button" @click="reset">重置</el-button>
                    </div>
                  </div>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="10" class="right-content-col">
              <div class="content-box">
                <el-card class="statistic-card" shadow="hover">
                  <template #header>
                    <div class="card-header">
                      <el-icon><DataLine /></el-icon>
                      <span>车身追踪统计</span>
                      <el-tag v-if="params.BODY_ID" size="small" type="info" class="header-tag">
                        当前车号: {{ params.BODY_ID }}
                      </el-tag>
                    </div>
                  </template>
                  <el-row :gutter="10">
                    <el-col :span="12">
                      <el-statistic title="经过节点" :value="points || 0">
                      </el-statistic>
                    </el-col>
                    <el-col :span="12">
                      <el-statistic title="用时" :value="timeDetla || '0'" value-style="color: #409EFF">

                      </el-statistic>
                      <!-- <div v-if="timeDetla" class="time-hint">
                        <el-tooltip content="从首次读取到最后一次读取的总时长" placement="bottom">
                          <el-icon><InfoFilled /></el-icon>
                        </el-tooltip>
                      </div> -->
                    </el-col>
                  </el-row>
                </el-card>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>
    </div>

    <!-- 主体内容区域 -->
    <div class="main-content">
      <!-- 左侧列表区域 -->
      <div class="left-sidebar">
        <el-card class="table-card" shadow="hover">
          <template #header>
            <div class="card-header-container">
              <div class="card-header">
                <div class="header-left">
                  <el-icon><DataAnalysis /></el-icon>
                  <!-- <p>进车记录</p>                   -->
                </div>
                <el-pagination
                  class="compact-pagination"
                  small
                  v-model:current-page="pageNo"
                  v-model:page-size="pageSize"
                  :page-sizes="[10, 20, 30, 50]"
                  background
                  layout="sizes, prev, pager, next"
                  :total="total || 0"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange" />
              </div>
              
              <div class="total-count-row" v-if="resultData && resultData.length">
                <el-tag size="large" type="primary" effect="dark" class="total-count-tag">
                  <el-icon><Document /></el-icon>
                  <span class="total-text">总记录数: {{ total || resultData.length }}</span>
                </el-tag>
              </div>
            </div>
          </template>
          <el-table 
            :data="resultData" 
            border 
            stripe 
            highlight-current-row
            :max-height="540"
            v-loading="loading2"
            :empty-text="'暂无数据'"
            style="width: 100%">
            <el-table-column 
              type="index" 
              label="序号" 
              width="60" 
              align="center" />
            <el-table-column label="车身信息" align="center">
              <template #default="{ row }">
                <div class="car-info">
                  <el-button 
                    type="primary" 
                    link 
                    @click="GetreqtraceSearchByFis(row.BODY_ID)">
                    {{ row.BODY_ID }}
                  </el-button>
                  <div class="tag-group">
                    <el-tag size="small" effect="plain">{{ row.BODY_TYPE }}</el-tag>
                    <el-tag size="small" type="success" effect="plain">{{ row.COLOR }}</el-tag>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="上线信息" align="center">
              <template #default="{ row }">
                <div class="station-info">
                  <el-tag size="small" effect="light">{{ row.RW_STATION_ID }}</el-tag>
                  <el-tooltip :content="row.DATE_EVT" placement="top">
                    <span class="time-text">{{ datatimeformat(row.DATE_EVT) }}</span>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>

      <!-- 右侧主要区域 -->
      <div class="main-area">

        <el-form-item label="车号" class="custom-form-item-layout">
          <div class="form-content-container">
            <div class="left-controls">
              <el-input v-model="params.BODY_ID" placeholder="请输入车号" class="car-input"></el-input>
              <el-button type="primary" @click="searchbyfis">
                <el-icon><Search /></el-icon>
                搜索
              </el-button>
              <el-button type="info" @click="toTOP">TOP</el-button>
              <el-button type="info" @click="toTOP">PVC</el-button>
              <el-button type="info" @click="toTOP">PT</el-button>
            </div>
            <div class="right-controls">
              <el-button 
                type="warning" 
                :icon="isFullscreen ? Aim : FullScreen" 
                @click="toggleFullscreen"
                title="全屏显示/退出全屏">
                {{ isFullscreen ? '退出' : '放大' }}
              </el-button>
            </div>
          </div>
        </el-form-item>

        <!--画面部分-->
        <div v-loading="loading1" class="production-line-container">
          <div class="background-image" ref="backgroundImageRef" @click="handleBackgroundClick($event)">
            <div class="background-actual" ref="actualImageRef">
              <TrackPoints :pointFirst="pointFirst" :pointLast="String(pointLast)" :isDebugMode="isDebugMode"
                :points="trackPoints" :isEditingIndex="isEditingIndex" :dotSize="12" :dotColor="'#ff0000'"
                :activeColor="'#ffff00'" @point-click="handlePointClick" />

              <!-- 调试点标记 -->
              <div v-if="isDebugMode" class="debug-marker"
                :style="{ left: debugPosition.x + '%', top: debugPosition.y + '%' }" @mousedown.stop="startDragMarker">
              </div>
            </div>

            <!-- 调试工具面板 -->
            <div class="debug-panel" :style="debugPanelStyle" @click.stop>
              <div :class="isDebugMode ? 'debug-panel-header' : 'debug-panel-header-hidden'"
                @mousedown.prevent="startDragPanel">
                <button @click="toggleDebugMode" class="debug-toggle">
                  {{ isDebugMode ? '关闭调试' : '开启调试' }}
                </button>
                <div class="drag-handle">拖动</div>
              </div>

              <div v-if="isDebugMode" class="position-debug-tool">
                <h3>位置调试工具</h3>
                <div class="debug-controls">
                  <div>
                    <label>X位置(%):
                      <input type="number" v-model="xPosition" min="0" max="100" step="0.5" />
                    </label>
                  </div>
                  <div>
                    <label>Y位置(%):
                      <input type="number" v-model="yPosition" min="0" max="100" step="0.5" />
                    </label>
                  </div>
                  <div class="debug-info">
                    提示: 点击背景图任意位置可直接定位调试点
                  </div>
                  <div class="debug-info">
                    当前调试点坐标: ({{ debugPosition.x }}%, {{ debugPosition.y }}%)
                  </div>
                  <div>
                    <button @click="addNewPoint" class="add-point-btn">添加当前位置按钮</button>
                  </div>
                  <div>
                    <button @click="savePoints" class="save-points-btn">保存点位</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 调试信息层 -->
          <div v-if="isDebugMode" class="debug-info-overlay">
            <div>
              <h4>当前按钮位置:</h4>
              <ul>
                <li v-for="(point, index) in trackPoints" :key="'info-' + index">
                  {{ point.id }}: ({{ point.xPercent }}%, {{ point.yPercent }}%)
                </li>
              </ul>
              <h4>窗口信息:</h4>
              <div>
                <p>窗口尺寸: {{ windowSize.width }}x{{ windowSize.height }}</p>
                <p>图片容器: {{ containerSize.width }}x{{ containerSize.height }}</p>
                <p>实际图片区: {{ actualImageSize.width }}x{{ actualImageSize.height }}</p>
              </div>
            </div>
          </div>

          <!-- 按钮编辑对话框（调试） -->
          <div v-if="isEditDialogVisible" class="edit-dialog-overlay" @click.self="cancelEdit">
            <div class="edit-dialog"
              :style="{ transform: `translate(${editDialogPosition.x}px, ${editDialogPosition.y}px)` }">
              <div class="edit-dialog-header" @mousedown.prevent="startDragEditDialog">
                <h3>编辑按钮</h3>
                <button class="close-btn" @click="cancelEdit">×</button>
              </div>
              <div class="edit-dialog-body">
                <div class="form-group">
                  <label>ID:</label>
                  <input type="text" v-model="editingPoint.id" />
                </div>
                <div class="form-group">
                  <label>名称:</label>
                  <input type="text" v-model="editingPoint.name" />
                </div>
                <div class="form-group">
                  <label>X位置(%):</label>
                  <input type="number" v-model.number="editingPoint.xPercent" min="0" max="100" step="0.1"
                    @input="updatePreview" />
                  <input type="range" v-model.number="editingPoint.xPercent" min="0" max="100" step="0.1"
                    class="position-slider" @input="updatePreview" />
                </div>
                <div class="form-group">
                  <label>Y位置(%):</label>
                  <input type="number" v-model.number="editingPoint.yPercent" min="0" max="100" step="0.1"
                    @input="updatePreview" />
                  <input type="range" v-model.number="editingPoint.yPercent" min="0" max="100" step="0.1"
                    class="position-slider" @input="updatePreview" />
                </div>
                <div class="form-group">
                  <label>区域:</label>
                  <input type="text" v-model="editingPoint.area" />
                </div>
              </div>
              <div class="edit-dialog-footer">
                <button class="save-btn" @click="savePointChanges">保存修改</button>
                <button class="delete-btn" @click="confirmDeletePoint">删除按钮</button>
                <button class="cancel-btn" @click="cancelEdit">取消</button>
              </div>
            </div>
          </div>

          <!-- 按钮编辑对话框（非调试） -->
          <div v-if="isEditDialogVisible_norm" class="edit-dialog-overlay" @click.self="cancelEdit">
            <div class="edit-dialog"
              :style="{ transform: `translate(${editDialogPosition.x}px, ${editDialogPosition.y}px)` }">
              <div class="edit-dialog-header" @mousedown.prevent="startDragEditDialog">
                <h3>读写站详情</h3>
                <button class="close-btn" @click="cancelEdit">×</button>
              </div>
              <div class="edit-dialog-body">
                <div class="form-group">
                  <label>ID:</label>
                  <input type="text" v-model="editingPoint.id" />
                </div>
                <div class="form-group">
                  <label>名称:</label>
                  <input type="text" v-model="editingPoint.name" />
                </div>
                <div class="form-group">
                  <label>区域:</label>
                  <input type="text" v-model="editingPoint.area" />
                </div>
              </div>
              <div class="edit-dialog-footer">
                <button class="cancel-btn" @click="cancelEdit">取消</button>
              </div>
            </div>
          </div>



          <!-- 确认删除对话框 -->
          <div v-if="isDeleteConfirmVisible" class="confirm-dialog-overlay" @click.self="cancelDelete">
            <div class="confirm-dialog">
              <h3>确认删除</h3>
              <p>您确定要删除"{{ editingPoint.name }}"按钮吗?</p>
              <div class="confirm-dialog-buttons">
                <button class="cancel-btn" @click="cancelDelete">取消</button>
                <button class="confirm-btn" @click="deletePoint">确认删除</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 全屏弹窗模态框 -->
    <div v-if="isFullscreen" class="fullscreen-modal-overlay" @click.self="closeFullscreen">
      <div class="fullscreen-modal" @click.stop>
        <!-- 弹窗标题栏 -->
        <div class="fullscreen-modal-header">
          <div class="fullscreen-modal-title">
            <el-icon><DataAnalysis /></el-icon>
            <span>车身追踪详细视图</span>
            <el-tag v-if="params.BODY_ID" size="small" type="success" class="fullscreen-header-tag">
              当前车号: {{ params.BODY_ID }}
            </el-tag>
          </div>
          <div class="fullscreen-modal-actions">
            <el-button type="primary" size="small" @click="searchbyfis" :disabled="!params.BODY_ID">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
            <el-button type="info" size="small" @click="closeFullscreen">
              <el-icon><Aim /></el-icon>
              退出全屏
            </el-button>
          </div>
        </div>

        <!-- 弹窗车号输入区域 -->
        <div class="fullscreen-search-area">
          <el-form-item label="车号">
            <div style="display: flex; align-items: center; gap: 10px;">
              <el-input v-model="params.BODY_ID" placeholder="请输入车号" style="flex: 1;"></el-input>
              <el-button type="primary" @click="searchbyfis">
                <el-icon><Search /></el-icon>
                搜索
              </el-button>
              <el-button type="info" @click="toTOP">TOP</el-button>
              <el-button type="info" @click="toTOP">PVC</el-button>
              <el-button type="info" @click="toTOP">PT</el-button>
            </div>
          </el-form-item>
        </div>

        <!-- 弹窗画面内容 -->
        <div class="fullscreen-content">
          <div v-loading="loading1" class="fullscreen-production-line-container">
            <div class="background-image" ref="fullscreenBackgroundRef" @click="handleBackgroundClick($event)">
              <div class="background-actual" ref="fullscreenActualRef">
                <TrackPoints :pointFirst="pointFirst" :pointLast="String(pointLast)" :isDebugMode="isDebugMode"
                  :points="trackPoints" :isEditingIndex="isEditingIndex" :dotSize="12" :dotColor="'#ff0000'"
                  :activeColor="'#ffff00'" @point-click="handlePointClick" />

                <!-- 调试点标记 -->
                <div v-if="isDebugMode" class="debug-marker"
                  :style="{ left: debugPosition.x + '%', top: debugPosition.y + '%' }" @mousedown.stop="startDragMarker">
                </div>
              </div>

              <!-- 调试工具面板 -->
              <div class="debug-panel" :style="debugPanelStyle" @click.stop>
                <div :class="isDebugMode ? 'debug-panel-header' : 'debug-panel-header-hidden'"
                  @mousedown.prevent="startDragPanel">
                  <button @click="toggleDebugMode" class="debug-toggle">
                    {{ isDebugMode ? '关闭调试' : '开启调试' }}
                  </button>
                  <div class="drag-handle">拖动</div>
                </div>

                <div v-if="isDebugMode" class="position-debug-tool">
                  <h3>位置调试工具</h3>
                  <div class="debug-controls">
                    <div>
                      <label>X位置(%):
                        <input type="number" v-model="xPosition" min="0" max="100" step="0.5" />
                      </label>
                    </div>
                    <div>
                      <label>Y位置(%):
                        <input type="number" v-model="yPosition" min="0" max="100" step="0.5" />
                      </label>
                    </div>
                    <div class="debug-info">
                      提示: 点击背景图任意位置可直接定位调试点
                    </div>
                    <div class="debug-info">
                      当前调试点坐标: ({{ debugPosition.x }}%, {{ debugPosition.y }}%)
                    </div>
                    <div>
                      <button @click="addNewPoint" class="add-point-btn">添加当前位置按钮</button>
                    </div>
                    <div>
                      <button @click="savePoints" class="save-points-btn">保存点位</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 调试信息层 -->
            <div v-if="isDebugMode" class="debug-info-overlay">
              <div>
                <h4>当前按钮位置:</h4>
                <ul>
                  <li v-for="(point, index) in trackPoints" :key="'info-' + index">
                    {{ point.id }}: ({{ point.xPercent }}%, {{ point.yPercent }}%)
                  </li>
                </ul>
                <h4>窗口信息:</h4>
                <div>
                  <p>窗口尺寸: {{ windowSize.width }}x{{ windowSize.height }}</p>
                  <p>图片容器: {{ containerSize.width }}x{{ containerSize.height }}</p>
                  <p>实际图片区: {{ actualImageSize.width }}x{{ actualImageSize.height }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed, watch, onUnmounted } from 'vue';
import TrackPoints from './trackPoints/TrackPoints.vue';
import {
  reqtraceSearchByFis,
  reqfirstCarByDateTime,
} from '@/api/bodyTrack'
import { ElMessage } from 'element-plus'
import useLayOutSettingStore from '@/store/modules/setting'
//引入store
import useBodyTrack from '@/views/bodytrack/store/bodytrack'
//获取路由对象
import { useRouter } from 'vue-router'
import { DataLine, Location, Timer, InfoFilled, DataAnalysis, Document, FullScreen, Aim, Search } from '@element-plus/icons-vue'
let $router = useRouter()

let bodyTrackStore = useBodyTrack()
let LayOutSettingStore = useLayOutSettingStore()
//主页面loading
let loading1 = ref(false)
let query = reactive({
  fis: '',
})
//节点计数
let points = ref()
//用时
let timeDetla = ref()
let cal_position_ref = ref()
let cal_position = ref({ top: 0, left: 0, width: 0, height: 0 })
let positionsCollect = ref<{ [key: string]: any }>({})
//计算第一点和最后点
let pointFirst = ref('1')
let pointLast = ref(0)

// 背景图DOM引用
const backgroundImageRef = ref(null);
const actualImageRef = ref(null);

// 全屏模式的背景图DOM引用
const fullscreenBackgroundRef = ref(null);
const fullscreenActualRef = ref(null);

// 窗口和图片尺寸信息
const windowSize = reactive({
  width: window.innerWidth,
  height: window.innerHeight
});

const containerSize = reactive({
  width: 0,
  height: 0
});

const actualImageSize = reactive({
  width: 0,
  height: 0,
  top: 0,
  left: 0
});

// 调试模式标志
const isDebugMode = ref(false);

// 全屏模式标志
const isFullscreen = ref(false);

// 调试位置
const debugPosition = reactive({
  x: 50,
  y: 50
});

// 输入框绑定值（使用ref而不是reactive）
const xPosition = ref(debugPosition.x);
const yPosition = ref(debugPosition.y);

// 监听输入框值变化，更新调试点位置
watch(xPosition, (newValue) => {
  const value = parseFloat(String(newValue));
  if (!isNaN(value)) {
    debugPosition.x = Math.max(0, Math.min(100, value));
    console.log(`X位置已更新: ${debugPosition.x}%`);
  }
});

watch(yPosition, (newValue) => {
  const value = parseFloat(String(newValue));
  if (!isNaN(value)) {
    debugPosition.y = Math.max(0, Math.min(100, value));
    console.log(`Y位置已更新: ${debugPosition.y}%`);
  }
});

// 监听调试点位置变化，更新输入框值
watch(() => debugPosition.x, (newValue) => {
  xPosition.value = newValue;
});

watch(() => debugPosition.y, (newValue) => {
  yPosition.value = newValue;
});

// 开关调试模式
const toggleDebugMode = () => {
  isDebugMode.value = !isDebugMode.value;
  console.log('调试模式: ' + (isDebugMode.value ? '开启' : '关闭'));
};

// 切换全屏模式
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
  console.log('全屏模式: ' + (isFullscreen.value ? '开启' : '关闭'));
  
  // 全屏模式下更新图片尺寸
  if (isFullscreen.value) {
    setTimeout(() => {
      updateFullscreenImageDimensions();
    }, 100);
  }
};

// 关闭全屏模式
const closeFullscreen = () => {
  isFullscreen.value = false;
  console.log('全屏模式已关闭');
};

// 计算背景图实际显示尺寸和位置
const updateImageDimensions = () => {
  if (!backgroundImageRef.value) return;

  // 更新窗口尺寸
  windowSize.width = window.innerWidth;
  windowSize.height = window.innerHeight;

  // 获取容器尺寸
  const container = backgroundImageRef.value;
  containerSize.width = container.offsetWidth;
  containerSize.height = container.offsetHeight;

  // 计算实际图片显示区域
  // 在contain模式下，获取实际图片的显示尺寸
  const imageUrl = getComputedStyle(container).backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
  const img = new Image();
  img.src = imageUrl;

  img.onload = () => {
    const imgRatio = img.width / img.height;
    const containerRatio = containerSize.width / containerSize.height;

    // 初始化图片实际显示区域
    actualImageSize.left = 0;
    actualImageSize.top = 0;

    if (imgRatio > containerRatio) {
      // 图片比容器更宽，上下会有空白
      actualImageSize.width = containerSize.width;
      actualImageSize.height = containerSize.width / imgRatio;
      actualImageSize.top = (containerSize.height - actualImageSize.height) / 2;
    } else {
      // 图片比容器更高，左右会有空白
      actualImageSize.height = containerSize.height;
      actualImageSize.width = containerSize.height * imgRatio;
      actualImageSize.left = (containerSize.width - actualImageSize.width) / 2;
    }

    // 更新虚拟图片容器样式
    if (actualImageRef.value) {
      actualImageRef.value.style.width = `${actualImageSize.width}px`;
      actualImageRef.value.style.height = `${actualImageSize.height}px`;
      actualImageRef.value.style.top = `${actualImageSize.top}px`;
      actualImageRef.value.style.left = `${actualImageSize.left}px`;
    }

    console.log('图片显示尺寸已更新:', actualImageSize);
  };
};

// 计算全屏模式下背景图实际显示尺寸和位置
const updateFullscreenImageDimensions = () => {
  if (!fullscreenBackgroundRef.value) return;

  // 更新窗口尺寸
  windowSize.width = window.innerWidth;
  windowSize.height = window.innerHeight;

  // 获取全屏容器尺寸
  const container = fullscreenBackgroundRef.value;
  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;

  // 计算实际图片显示区域
  const imageUrl = getComputedStyle(container).backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
  const img = new Image();
  img.src = imageUrl;

  img.onload = () => {
    const imgRatio = img.width / img.height;
    const containerRatio = containerWidth / containerHeight;

    let actualWidth, actualHeight, actualTop = 0, actualLeft = 0;

    if (imgRatio > containerRatio) {
      // 图片比容器更宽，上下会有空白
      actualWidth = containerWidth;
      actualHeight = containerWidth / imgRatio;
      actualTop = (containerHeight - actualHeight) / 2;
    } else {
      // 图片比容器更高，左右会有空白
      actualHeight = containerHeight;
      actualWidth = containerHeight * imgRatio;
      actualLeft = (containerWidth - actualWidth) / 2;
    }

    // 更新全屏虚拟图片容器样式
    if (fullscreenActualRef.value) {
      fullscreenActualRef.value.style.width = `${actualWidth}px`;
      fullscreenActualRef.value.style.height = `${actualHeight}px`;
      fullscreenActualRef.value.style.top = `${actualTop}px`;
      fullscreenActualRef.value.style.left = `${actualLeft}px`;
    }

    console.log('全屏模式图片显示尺寸已更新:', { actualWidth, actualHeight, actualTop, actualLeft });
  };
};

// 处理背景点击
const handleBackgroundClick = (event) => {
  if (!isDebugMode.value || !actualImageRef.value) return;

  // 阻止点击事件冒泡
  event.stopPropagation();

  // 计算点击位置相对于实际图片区域的百分比
  const imgRect = actualImageRef.value.getBoundingClientRect();
  const x = ((event.clientX - imgRect.left) / imgRect.width) * 100;
  const y = ((event.clientY - imgRect.top) / imgRect.height) * 100;

  // 更新调试点位置
  debugPosition.x = Math.max(0, Math.min(100, parseFloat(x.toFixed(1))));
  debugPosition.y = Math.max(0, Math.min(100, parseFloat(y.toFixed(1))));

  console.log(`点击背景图，调试点移动到: (${debugPosition.x}%, ${debugPosition.y}%)`);
};

// 拖动标记点
const startDragMarker = (event: any) => {
  if (!isDebugMode.value || !actualImageRef.value) return;

  // 阻止默认行为和事件冒泡
  event.preventDefault();
  event.stopPropagation();

  // 获取实际图片区域
  const imgRect = actualImageRef.value.getBoundingClientRect();

  const updateMarkerPosition = (e: any) => {
    // 计算新位置（相对于实际图片区域）
    const x = ((e.clientX - imgRect.left) / imgRect.width) * 100;
    const y = ((e.clientY - imgRect.top) / imgRect.height) * 100;

    // 限制在0-100范围内并保留一位小数
    debugPosition.x = Math.max(0, Math.min(100, parseFloat(x.toFixed(1))));
    debugPosition.y = Math.max(0, Math.min(100, parseFloat(y.toFixed(1))));
  };

  const stopDragging = () => {
    document.removeEventListener('mousemove', updateMarkerPosition);
    document.removeEventListener('mouseup', stopDragging);
    console.log(`拖动结束，调试点位置: (${debugPosition.x}%, ${debugPosition.y}%)`);
  };

  // 添加全局事件监听
  document.addEventListener('mousemove', updateMarkerPosition);
  document.addEventListener('mouseup', stopDragging);
};

// 添加新的点位
const addNewPoint = () => {
  const newId = `new-point-${trackPoints.length + 1}`;
  trackPoints.push({
    id: newId,
    name: `新增点${trackPoints.length + 1}`,
    xPercent: debugPosition.x,
    yPercent: debugPosition.y,
    area: '自定义',
    //实时数据
    av: { 'fis': '', 'sq': '999', 'dateTime': '' }
  });

  console.log(`已添加新点位: ${newId} 在位置 (${debugPosition.x}%, ${debugPosition.y}%)`);
};

// 定义红点位置数据（根据原始图片的坐标）
const trackPoints = reactive<any>([]);  // 清空初始数据，改为从XML加载
//--------------------------------------------------------------------------------
const returnDatabyFis2: any =
{
  '1': [{ 'fis': 6666, 'sq': 6, 'dateTime': 20200202 }, { 'fis': 888, 'sq': 66, 'dateTime': 20200202 }, { 'fis': 999, 'sq': 666, 'dateTime': 20200202 }],
  '2': [{ 'fis': 7777, 'sq': 7, 'dateTime': 20200202 }],
  '5': [{ 'fis': 8888, 'sq': 9, 'dateTime': 20200202 }],
}
//返回数据
let returnDatabyFis = reactive<any>({})

// 更新点位数据:在trackPoints中更新av
const updateData = () => {
  trackPoints.forEach(item => {
    if (returnDatabyFis[item.id]) {
      item['av'] = returnDatabyFis[item.id]
      //计算进过几个节点
      pointLast.value = item['av'].length + pointLast.value
    }
    else {
      item['av'] = { 'fis': '', 'sq': '999', 'dateTime': '' }
    }

  })
}
//--------------------------------------------------------------------------------

// 计算按钮样式
// const getButtonStyle = (point:any, index:any) => {
//   // 如果当前点位正在编辑中，且有位置变动，则使用编辑中的坐标
//   if (index === isEditingIndex.value && isEditDialogVisible.value) {
//     return {
//       left: `${editingPoint.xPercent}%`,
//       top: `${editingPoint.yPercent}%`,
//     }    
//   }

//   // 如果点位没有sq，且不是调试模式，则隐藏点位
//   if (!isDebugMode.value && (point.av.sq == '999') ) {
//     return {
//       visibility: 'hidden',       
//       left: `${point.xPercent}%`,
//       top: `${point.yPercent}%`,
//     }
//   }
//   // 否则使用原始坐标
//   return {
//     left: `${point.xPercent}%`,
//     top: `${point.yPercent}%`,
//   };
// };

// 按钮编辑对话框状态
const isEditDialogVisible = ref(false);
const isEditDialogVisible_norm = ref(false);
const isDeleteConfirmVisible = ref(false);
const editingPoint = reactive({
  id: '',
  name: '',
  xPercent: 0,
  yPercent: 0,
  area: ''
});
const editingPointIndex = ref(-1);
const isEditingIndex = ref(-1);
const originalPoint = reactive({
  xPercent: 0,
  yPercent: 0
});

// 打开编辑对话框（调试）
const openEditDialog = (point: any, index: any) => {
  resetEditDialogPosition();
  // 保存原始位置，以便取消时恢复
  originalPoint.xPercent = point.xPercent;
  originalPoint.yPercent = point.yPercent;

  // 复制点位数据到编辑对象
  editingPoint.id = point.id;
  editingPoint.name = point.name;
  editingPoint.xPercent = point.xPercent;
  editingPoint.yPercent = point.yPercent;
  editingPoint.area = point.area;
  editingPointIndex.value = index;
  isEditingIndex.value = index;

  // 显示对话框
  isEditDialogVisible.value = true;
};

// 打开编辑对话框(非调试)
const openEditDialog_norm = (point: any, index: any) => {
  resetEditDialogPosition();
  // 保存原始位置，以便取消时恢复
  originalPoint.xPercent = point.xPercent;
  originalPoint.yPercent = point.yPercent;

  // 复制点位数据到编辑对象
  editingPoint.id = point.id;
  editingPoint.name = point.name;
  editingPoint.xPercent = point.xPercent;
  editingPoint.yPercent = point.yPercent;
  editingPoint.area = point.area;
  editingPointIndex.value = index;
  isEditingIndex.value = index;

  // 显示对话框
  isEditDialogVisible_norm.value = true;
};

// 更新预览
const updatePreview = () => {
  // 验证输入，确保是有效数值
  let xPercent = parseFloat(String(editingPoint.xPercent));
  let yPercent = parseFloat(String(editingPoint.yPercent));

  if (!isNaN(xPercent) && !isNaN(yPercent)) {
    // 限制在0-100范围内
    xPercent = Math.max(0, Math.min(100, xPercent));
    yPercent = Math.max(0, Math.min(100, yPercent));

    // 更新编辑对象值
    editingPoint.xPercent = xPercent;
    editingPoint.yPercent = yPercent;
  }
};

// 关闭编辑对话框
const closeEditDialog = () => {
  isEditDialogVisible.value = false;
  isEditDialogVisible_norm.value = false;
  isEditingIndex.value = -1;
};

// 取消编辑
const cancelEdit = () => {
  // 如果有正在编辑的点位，恢复其原始位置
  if (isEditingIndex.value >= 0 && isEditingIndex.value < trackPoints.length) {
    // 如果用户更改了位置但取消了编辑，恢复原始位置
    trackPoints[isEditingIndex.value].xPercent = originalPoint.xPercent;
    trackPoints[isEditingIndex.value].yPercent = originalPoint.yPercent;
  }

  closeEditDialog();
};

// 保存按钮修改
const savePointChanges = () => {
  if (editingPointIndex.value >= 0 && editingPointIndex.value < trackPoints.length) {
    // 验证输入值
    if (!editingPoint.id || !editingPoint.name) {
      alert('ID和名称不能为空!');
      return;
    }

    // 验证位置百分比
    const xPercent = parseFloat(String(editingPoint.xPercent));
    const yPercent = parseFloat(String(editingPoint.yPercent));

    if (isNaN(xPercent) || isNaN(yPercent) || xPercent < 0 || xPercent > 100 || yPercent < 0 || yPercent > 100) {
      alert('X和Y位置必须是0-100之间的数值!');
      return;
    }

    // 更新点位数据
    const point = trackPoints[editingPointIndex.value];
    point.id = editingPoint.id;
    point.name = editingPoint.name;
    point.xPercent = xPercent;
    point.yPercent = yPercent;
    point.area = editingPoint.area || '自定义';

    console.log(`已更新点位 "${point.name}" 的属性`);
    closeEditDialog();
  }
};

// 确认删除点位
const confirmDeletePoint = () => {
  isDeleteConfirmVisible.value = true;
};

// 取消删除
const cancelDelete = () => {
  isDeleteConfirmVisible.value = false;
};

// 删除点位
const deletePoint = () => {
  if (editingPointIndex.value >= 0 && editingPointIndex.value < trackPoints.length) {
    const removedPoint = trackPoints.splice(editingPointIndex.value, 1)[0];
    console.log(`已删除点位: "${removedPoint.name}"`);
    isDeleteConfirmVisible.value = false;
    closeEditDialog();
  }
};

// 按钮点击处理函数
const handlePointClick = (point, index) => {
  if (isDebugMode.value) {
    // 在调试模式下，打开编辑对话框
    openEditDialog(point, index);
  } else {
    // 在非调试模式下，执行正常的点击逻辑
    console.log(`点击了${point.area}区域的${point.name}，ID: ${point.id}`);
    // 这里可以添加更多的点击逻辑
    openEditDialog_norm(point, index);
  }
};

// 监听窗口大小变化
const handleResize = () => {
  updateImageDimensions();
};

// 添加键盘事件处理函数
const handleKeyPress = (event: KeyboardEvent) => {
  
  // 使用 ESC 键关闭全屏
  if (event.key === 'Escape' && isFullscreen.value) {
    event.preventDefault();
    closeFullscreen();
    ElMessage({
      type: 'info',
      message: '已退出全屏模式',
      duration: 2000
    });
    return;
  }
  
  // 使用 Ctrl + M 作为调试模式快捷键
  if (event.ctrlKey && event.key === 'm') {
    console.log("调试模式开启")
    event.preventDefault(); // 阻止默认行为
    isDebugMode.value = !isDebugMode.value;
    ElMessage({
      type: 'info',
      message: `调试模式已${isDebugMode.value ? '开启' : '关闭'}`,
      duration: 2000
    });
  }
};

// 组件挂载时加载数据
onMounted(async () => {
  // 添加键盘事件监听
  window.addEventListener('keydown', handleKeyPress);

  params.datetime_start = moment(shortcuts[0].value()[0]).format(
    'YYYY-MM-DDTHH:mm:ss')
  params.datetime_end = moment(shortcuts[0].value()[1]).format('YYYY-MM-DDTHH:mm:ss')
  dateTimepickUp.value = [params.datetime_start, params.datetime_end]
  GetfirstCarByDateTime(params)

  // 获取背景图容器
  const bgContainer = backgroundImageRef.value;
  if (!bgContainer) return;

  console.log('组件已挂载，背景容器:', bgContainer);

  // 加载XML数据
  await loadPointsFromXML();

  // 初始化图片尺寸
  updateImageDimensions();

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize);

  // 获取实际图片尺寸和容器尺寸比例
  try {
    const img = new Image();
    // 使用import方式加载图片
    const layoutImage = await import('@/assets/Layout.png');
    img.src = layoutImage.default;
    img.onload = () => {
      console.log(`图片加载成功，实际尺寸: ${img.width}x${img.height}`);
      console.log(`容器尺寸: ${bgContainer.offsetWidth}x${bgContainer.offsetHeight}`);
      updateImageDimensions();
    };
    img.onerror = (err) => {
      console.error('图片加载失败:', err);
    };
  } catch (error) {
    console.error('加载图片时出错:', error);
  }
});

// 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  // 移除键盘事件监听
  window.removeEventListener('keydown', handleKeyPress);
});

// 调试面板位置
const debugPanelPosition = reactive({
  x: 10,
  y: 10
});

// 计算调试面板样式
const debugPanelStyle = computed(() => ({
  transform: `translate(${debugPanelPosition.x}px, ${debugPanelPosition.y}px)`
}));

// 拖动调试面板
const startDragPanel = (event) => {
  const panel = event.currentTarget.parentElement;
  const startX = event.clientX - debugPanelPosition.x;
  const startY = event.clientY - debugPanelPosition.y;

  const handleDrag = (e) => {
    // 计算新位置
    let newX = e.clientX - startX;
    let newY = e.clientY - startY;

    // 获取窗口尺寸
    const maxX = window.innerWidth - panel.offsetWidth;
    const maxY = window.innerHeight - panel.offsetHeight;

    // 限制面板在窗口内
    newX = Math.max(0, Math.min(maxX, newX));
    newY = Math.max(0, Math.min(maxY, newY));

    // 更新位置
    debugPanelPosition.x = newX;
    debugPanelPosition.y = newY;
  };

  const stopDrag = () => {
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
  };

  document.addEventListener('mousemove', handleDrag);
  document.addEventListener('mouseup', stopDrag);
};

// 从XML字符串解析点位数据
const parseXMLString = (xmlString) => {
  try {
    console.log('从字符串解析XML数据');

    // 确保XML字符串有效
    if (!xmlString || !xmlString.trim().startsWith('<')) {
      throw new Error('无效的XML字符串');
    }

    // 清理XML字符串中的常见格式问题
    let cleanXml = xmlString.trim();

    // 修复开头重复的 <
    if (cleanXml.startsWith('<<')) {
      cleanXml = cleanXml.replace('<<', '<');
    }

    // 修复结尾多余的 >
    if (cleanXml.endsWith('>>')) {
      cleanXml = cleanXml.substring(0, cleanXml.length - 1);
    }

    // 处理其他可能的XML格式问题
    cleanXml = cleanXml.replace(/\s+</g, '<').replace(/>\s+/g, '>');

    console.log('清理后的XML:', cleanXml.substring(0, 100) + '...');

    const parser = new DOMParser();
    let xmlDoc = parser.parseFromString(cleanXml, 'text/xml');

    // 检查解析错误
    const parseError = xmlDoc.getElementsByTagName('parsererror');
    if (parseError.length > 0) {
      console.error('XML解析错误:', parseError[0].textContent);

      // 尝试更强力的修复 - 提取核心内容
      if (cleanXml.includes('<trackPoints>') && cleanXml.includes('</trackPoints>')) {
        console.log('尝试提取核心内容进行解析...');
        const startIdx = cleanXml.indexOf('<trackPoints>');
        const endIdx = cleanXml.lastIndexOf('</trackPoints>') + '</trackPoints>'.length;
        if (startIdx >= 0 && endIdx > startIdx) {
          const coreXml = cleanXml.substring(startIdx, endIdx);
          const retryDoc = parser.parseFromString(coreXml, 'text/xml');
          if (retryDoc.getElementsByTagName('parsererror').length === 0) {
            xmlDoc = retryDoc;
            console.log('成功提取核心内容解析');
          } else {
            throw new Error('XML解析错误: ' + parseError[0].textContent);
          }
        } else {
          throw new Error('XML解析错误: ' + parseError[0].textContent);
        }
      } else {
        throw new Error('XML解析错误: ' + parseError[0].textContent);
      }
    }

    // 清空现有数据
    trackPoints.length = 0;

    // 解析所有点位
    const points = xmlDoc.getElementsByTagName('point');
    console.log(`找到 ${points.length} 个点位数据`);

    if (points.length === 0) {
      throw new Error('XML数据中没有找到点位');
    }

    Array.from(points).forEach((point, index) => {
      try {
        const pointData = {
          id: point.getElementsByTagName('id')[0]?.textContent || `point-${index}`,
          name: point.getElementsByTagName('name')[0]?.textContent || `点位${index}`,
          xPercent: parseFloat(point.getElementsByTagName('xPercent')[0]?.textContent || '0'),
          yPercent: parseFloat(point.getElementsByTagName('yPercent')[0]?.textContent || '0'),
          area: point.getElementsByTagName('area')[0]?.textContent || '自定义'
        };
        trackPoints.push(pointData);
        console.log(`成功解析点位: ${pointData.id} (${pointData.xPercent}, ${pointData.yPercent})`);
      } catch (err) {
        console.error(`解析第 ${index} 个点位时出错:`, err);
      }
    });

    console.log('成功从XML字符串解析点位数据，共加载', trackPoints.length, '个点位');

    return {
      success: true,
      message: `成功加载 ${trackPoints.length} 个点位数据`
    };
  } catch (error) {
    console.error('解析XML字符串失败:', error);
    return {
      success: false,
      message: error.message
    };
  }
};

// 从XML文件加载点位数据
const loadPointsFromXML = async () => {
  try {
    console.log('尝试加载XML点位数据...');

    //   // 首先尝试根据用户提供的示例XML直接解析
    //   const sampleXML = `<trackPoints>
    //   <point>
    //     <id>new-point-1</id>
    //     <name>新增点1</name>
    //     <xPercent>28</xPercent>
    //     <yPercent>5.5</yPercent>
    //     <area>自定义</area>
    //   </point>
    //   <point>
    //     <id>new-point-2</id>
    //     <name>新增点2</name>
    //     <xPercent>8.3</xPercent>
    //     <yPercent>77.9</yPercent>
    //     <area>自定义</area>
    //   </point>
    // </trackPoints>`;

    //   const result = parseXMLString(sampleXML);
    //   if (result.success) {
    //     console.log('使用示例XML数据成功');
    //     return;
    //   }

    // 如果示例数据解析失败，尝试从文件加载
    console.log('尝试从文件加载XML数据...');
    const response = await fetch('/trackPoints.xml');

    if (!response.ok) {
      console.log(`XML文件不存在或无法访问 (状态码: ${response.status})，使用默认数据`);
      // 使用默认数据
      trackPoints.push(
        { id: 'l100-pt1-start', name: 'PT1起点', xPercent: 15.5, yPercent: 12, area: 'L100' },
        { id: 'l100-pt1-end', name: 'PT1终点', xPercent: 27, yPercent: 12, area: 'L100' }
      );
      return;
    }

    const xmlText = await response.text();
    console.log('成功获取XML数据:', xmlText.substring(0, 500) + '...');

    // 解析文件内容
    const fileResult = parseXMLString(xmlText);

    if (!fileResult.success) {
      throw new Error('从文件解析XML失败: ' + fileResult.message);
    }

  } catch (error) {
    console.error('加载XML文件失败:', error);
    alert('加载XML文件失败: ' + error.message);

    // 如果都失败，使用默认数据
    if (trackPoints.length === 0) {
      trackPoints.push(
        { id: 'l100-pt1-start', name: 'PT1起点', xPercent: 15.5, yPercent: 12, area: 'L100' },
        { id: 'l100-pt1-end', name: 'PT1终点', xPercent: 27, yPercent: 12, area: 'L100' }
      );
    }
  }
};

// XML保存相关函数
const formatXML = (xml) => {
  // 添加XML声明
  if (xml.indexOf('<?xml') !== 0) {
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n' + xml;
  }

  // 使用正则表达式添加换行和缩进
  let formatted = '';
  let indent = '';
  const tab = '  '; // 两个空格作为缩进单位

  xml.split(/>\s*</).forEach(node => {
    if (node.indexOf('/') === 0) {
      // 结束标签，减少缩进
      indent = indent.substring(tab.length);
    }

    formatted += indent + '<' + node + '>\n';

    if (node.indexOf('/') === node.length - 1 || node.indexOf('/>') === node.length - 2) {
      // 自闭合标签，不增加缩进
    } else if (node.indexOf('/') === -1) {
      // 开始标签，增加缩进
      indent += tab;
    }
  });

  // 修复第一行和最后一行
  formatted = formatted.substring(0, formatted.length - 1).replace(/\n</g, '\n<');

  // 修复CDATA和注释
  formatted = formatted
    .replace(/&lt;!\[CDATA\[/g, '<![CDATA[')
    .replace(/\]\]&gt;/g, ']]>')
    .replace(/&lt;!--/g, '<!--')
    .replace(/--&gt;/g, '-->');

  return formatted;
};

// 保存XML文件
const savePointsToXML = () => {
  // 创建XML文档
  const xmlDoc = document.implementation.createDocument(null, "trackPoints", null);

  // 添加所有点位数据
  trackPoints.forEach(point => {
    const pointElement = xmlDoc.createElement("point");

    // 创建并添加各个属性节点
    const fields = ['id', 'name', 'xPercent', 'yPercent', 'area'];
    fields.forEach(field => {
      const element = xmlDoc.createElement(field);
      element.textContent = point[field];
      pointElement.appendChild(element);
    });

    xmlDoc.documentElement.appendChild(pointElement);
  });

  // 转换为XML字符串
  const serializer = new XMLSerializer();
  let xmlString = serializer.serializeToString(xmlDoc);

  // 格式化XML字符串，添加缩进
  xmlString = formatXML(xmlString);

  // 创建Blob并下载
  const blob = new Blob([xmlString], { type: 'text/xml' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'trackPoints.xml';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);

  console.log('trackPoints.xml文件已生成，请将其放到合适的位置以供加载');
};

// 保存点位按钮点击处理函数
const savePoints = () => {
  savePointsToXML();
  console.log('点位数据已保存为XML文件');
};

const editDialogPosition = reactive({
  x: window.innerWidth / 2 - 200, // 默认位置在屏幕中央（假设对话框宽度为400px）
  y: window.innerHeight / 2 - 150  // 假设对话框高度约300px
});

// 拖动编辑对话框
const startDragEditDialog = (event) => {
  const dialog = event.currentTarget.parentElement;
  const startX = event.clientX - editDialogPosition.x;
  const startY = event.clientY - editDialogPosition.y;

  const handleDrag = (e) => {
    // 计算新位置
    let newX = e.clientX - startX;
    let newY = e.clientY - startY;

    // 获取窗口尺寸
    const maxX = window.innerWidth - dialog.offsetWidth;
    const maxY = window.innerHeight - dialog.offsetHeight;

    // 限制对话框在窗口内
    newX = Math.max(0, Math.min(maxX, newX));
    newY = Math.max(0, Math.min(maxY, newY));

    // 更新位置
    editDialogPosition.x = newX;
    editDialogPosition.y = newY;
  };

  const stopDrag = () => {
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
  };

  document.addEventListener('mousemove', handleDrag);
  document.addEventListener('mouseup', stopDrag);
};

// 重置对话框位置到中央
const resetEditDialogPosition = () => {
  editDialogPosition.x = window.innerWidth / 2 - 200;
  editDialogPosition.y = window.innerHeight / 2 - 150;
};


///


//以下新增

//转为List sq编号需要保证从小到大按顺序排序
let positionsCollectList = computed(() => {
  return Object.values(positionsCollect.value)
})



//
const GetreqtraceSearchByFis = async (fis: any) => {
  //需要清除缓存(需要测试下)
  Object.assign(returnDatabyFis, {})
  updateData()
  //
  pointLast.value = 0
  loading1.value = true
  //输入框回显
  params.BODY_ID = fis
  //调用store
  bodyTrackStore.query.fis = fis


  let result = await reqtraceSearchByFis(fis)
  if (result.code == 200) {
    if (result.data.data) {
      returnDatabyFis = result.data.data
      updateData()
      //时间和节点计数
      points.value = result.data['points']
      timeDetla.value = result.data['timeDetla']
      loading1.value = false
      ElMessage({
        type: 'success',
        message: 'FIS过点数据获取成功',
      })
    } else {
      ElMessage({
        type: 'error',
        message: '没有发现经过预选节点或者FIS错误！',
      })
      loading1.value = false
    }
  }
}
const search = () => {
  //好像没有起作用
  Object.assign(resultData.value,'')
  GetfirstCarByDateTime(params)
}
const searchbyfis = () => {
  if (params.BODY_ID) {
    GetreqtraceSearchByFis(params.BODY_ID)
  }
}

const reset = () => {
  //重置搜索
  Object.assign(query, {
    fis: '',
  })
  //刷新页面
  LayOutSettingStore.refsh = !LayOutSettingStore.refsh
  Object.assign(params, {
    RW_STATION_ID: '',
    BODY_ID: '',
    datetime_start: '',
    datetime_end: '',
    BODY_TYPE: '',
    COLOR: '',
  })
  const [start, end] = shortcuts[0].value()
  params.datetime_start = moment(start).format('YYYY-MM-DDTHH:mm:ss')
  params.datetime_end = moment(end).format('YYYY-MM-DDTHH:mm:ss')
  dateTimepickUp.value = [params.datetime_start, params.datetime_end]
}

// 颜色配置选项
const colorOptions = [
  { label: '2T2T', value: '白色', type: 'primary', plain: true },
]

// 车型配置选项
const bodyTypeOptions = [
  { label: 'Purple', value: 'XV', type: 'success', plain: true },
  { label: 'A7', value: 'SS', type: 'warning', plain: true },
  { label: 'A5', value: 'V', type: 'danger', plain: true },  
  { label: 'E5', value: 'X', type: 'warning', plain: true },  
  { label: 'Q4', value: '8', type: 'success', plain: true },
]

// 快速选择颜色
const selectColor = (color: string) => {
  params.COLOR = color;
}

// 快速选择车型
const selectBodyType = (type: string) => {
  params.BODY_TYPE = type;
}

import moment from 'moment'
let dateTimepickUp = ref<string[]>([])
let params = reactive({
  RW_STATION_ID: '',
  BODY_ID: '',
  datetime_start: '',
  datetime_end: '', //22/12/2024 11:16:06.773
  BODY_TYPE: 'V',
  COLOR: '',
})

let resultData = ref()
let loading2 = ref(false)
let pageNo = ref<number>(1)
let pageSize = ref(10)
let total = ref<number | null>(null)
// 存储所有数据的数组
let allResultData = ref([])

// 计算当前页数据的计算属性
const paginatedData = computed(() => {
  const start = (pageNo.value - 1) * pageSize.value
  const end = start + pageSize.value
  return allResultData.value.slice(start, end)
})



const GetfirstCarByDateTime = async (params: any) => {
  loading2.value = true
  let result = await reqfirstCarByDateTime(params)
  if (result.code == 200) {
    // 保存所有数据
    allResultData.value = result.data.records || []
    // 设置总数据量
    total.value = allResultData.value.length
    // 使用计算后的分页数据
    resultData.value = paginatedData.value
    loading2.value = false
  } else {
    ElMessage({
      type: 'error',
      message: '网络问题！',
    })
    loading2.value = false
  }
}
const datatimeformat = (value: string) => {
  // const inputFormat = 'DD/MM/YYYY HH:mm:ss.SSS';
  const inputFormat = 'YYYY-MM-DD HH:mm:ss.SSS';
  const outputFormat = 'YYYY-MM-DD HH:mm:ss';
  return moment(value, inputFormat).format(outputFormat);
}

const datepickup = (value: string[]) => {
  if (value && value.length === 2) {
    // 将本地时间转换为UTC时间字符串，但保留当前选择的表示时间
    // 使用moment处理时区转换
    params.datetime_start = moment(value[0]).format('YYYY-MM-DDTHH:mm:ss')
    params.datetime_end = moment(value[1]).format('YYYY-MM-DDTHH:mm:ss')
    console.log('选择的时间范围:', value)
    console.log('处理后的查询参数:', params)
  } else {
    params.datetime_start = ''
    params.datetime_end = ''
  }
}
const shortcuts = [
  {
    text: '昨天',
    value: () => [moment().subtract(1, 'day').toDate(), new Date()],
  },
  {
    text: '上周',
    value: () => [moment().subtract(7, 'days').toDate(), new Date()],
  },
  {
    text: '上月',
    value: () => [moment().subtract(30, 'days').toDate(), new Date()],
  },
  {
    text: '上3个月',
    value: () => [moment().subtract(90, 'days').toDate(), new Date()],
  },
]
const headerCellStyle = () => ({
  backgroundColor: '#e8f3ff',
  color: '#333',
})


//调到TOP详细页
const toTOP = () => {
  $router.push('/bodytrack/top')
}

const handleSizeChange = () => {
  // 只更新本地分页，无需重新请求数据
  resultData.value = paginatedData.value
}

const handleCurrentChange = () => {
  // 只更新本地分页，无需重新请求数据
  resultData.value = paginatedData.value
}

</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  height: 90vh;
  width: 100%;
}

.search-area {
  padding: 8px;
  background-color: #f5f7fa;
}

.search-content {
  max-width: 100%;
  padding: 0 0px;
}

.search-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 0px;
  overflow: hidden;
}

.right-content-col {
  border-left: 1px solid #eee;
  background-color: #f9f9f9;
}

.content-box {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
}

.custom-form-item {
  margin-bottom: 8px;
}

.input-button-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.custom-input {
  flex: 1;
  max-width: 300px;
}

.button-group {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.custom-button {
  transition: all 0.3s ease;
  padding: 6px 12px;
}

.custom-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.date-picker-item {
  margin-bottom: 0;
}

.action-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.custom-date-picker {
  width: 400px;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.action-button {
  min-width: 80px;
  transition: all 0.3s ease;
  padding: 6px 12px;
}

.action-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@media screen and (max-width: 768px) {
  .search-area {
    padding: 4px;
  }

  .search-card {
    padding: 8px;
  }

  .input-button-group {
    gap: 6px;
  }

  .action-group {
    gap: 6px;
  }
}

.main-content {
  flex: 1;
  display: flex;
  margin-top: 10px;
  overflow: hidden;
}

.left-sidebar {
  width: 35%;  
  background-color: #f5f5f5;
  padding: 10px;
  overflow-y: auto;
  transition: width 0.3s ease;
}

.main-area {
  width: 65%;
  padding: 10px;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  /* 改为hidden以移除滚动条 */
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
  .left-sidebar {
    width: 30%;
  }
}

@media screen and (max-width: 576px) {
  .main-content {
    flex-direction: column;
  }

  .left-sidebar {
    width: 100%;
    height: auto;
    max-height: 200px;
  }

  .main-area {
    width: 100%;
  }
}



/* 主要 -------------------------------------------------------*/
.production-line-container {
  flex: 1;
  /* 让容器占据剩余空间 */
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  margin-top: 10px;
  /* 与上方表单保持间距 */
}

.background-image {
  flex: 1;
  /* 让背景图占据剩余空间 */
  width: 100%;
  background-image: url('@/assets/Layout.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  cursor: crosshair;
}

/* 实际显示的图片区域容器 */
.background-actual {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.track-btn {
  position: absolute;
  padding: 5px 10px;
  border-radius: 20px;
  background-color: blue;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.8);
  cursor: pointer;
  font-size: 10px;
  transition: all 0.3s;
  white-space: nowrap;
  transform: translate(-50%, -50%);
  /* 使按钮中心与定位点对齐 */
  z-index: 10;
  pointer-events: auto;
  /* 确保按钮可点击 */
}

.track-btn.editing {
  background-color: rgba(255, 165, 0, 0.8);
  /* 橙色，表示正在编辑 */
  border: 3px solid yellow;
  box-shadow: 0 0 15px rgba(255, 255, 0, 0.8);
  z-index: 15;
  /* 确保编辑中的按钮在最上层 */
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 5px rgba(255, 255, 0, 0.8);
  }

  50% {
    box-shadow: 0 0 20px rgba(255, 255, 0, 1);
  }

  100% {
    box-shadow: 0 0 5px rgba(255, 255, 0, 0.8);
  }
}

/* 调试面板 */
.debug-panel {
  position: fixed;
  z-index: 1000;
  user-select: none;
  /* 防止拖动时选中文本 */
}

.debug-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5px;
  cursor: move;
  background: #2c3e50;
  border-radius: 5px;
  margin-bottom: 5px;
}

.debug-panel-header-hidden {
  display: none;
}

.drag-handle {
  color: #fff;
  font-size: 12px;
  padding: 8px 10px;
  opacity: 0.7;
}

.debug-toggle {
  background: transparent;
  color: white;
  border: none;
  padding: 8px 15px;
  cursor: pointer;
  font-weight: bold;
}

.debug-toggle:hover {
  opacity: 0.8;
}

.position-debug-tool {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px;
  border-radius: 8px;
  width: 280px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.position-debug-tool h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #42b983;
}

.debug-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.debug-controls label {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.position-debug-tool input {
  width: 70px;
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #666;
  background: #333;
  color: white;
}

.debug-info {
  margin-top: 5px;
  font-size: 12px;
  color: #bbb;
}

.add-point-btn,
.save-points-btn {
  background: #42b983;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  margin-top: 5px;
  cursor: pointer;
  width: 100%;
}

.save-points-btn {
  background: #4a90e2;
  margin-top: 10px;
}

.debug-marker {
  position: absolute;
  width: 16px;
  height: 16px;
  background: yellow;
  border: 3px solid black;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: move;
  box-shadow: 0 0 0 2px rgba(255, 255, 0, 0.5), 0 0 10px rgba(255, 255, 0, 0.8);
  z-index: 999;
  pointer-events: auto;
  /* 确保可以接收鼠标事件 */
}

/* 调试信息覆层 */
.debug-info-overlay {
  position: fixed;
  bottom: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  border-radius: 5px;
  max-height: 300px;
  overflow-y: auto;
  font-size: 12px;
  z-index: 1000;
}

.debug-info-overlay h4 {
  margin: 5px 0;
  color: #42b983;
}

.debug-info-overlay ul,
.debug-info-overlay p {
  margin: 5px 0;
  padding-left: 15px;
}

/* 响应式布局调整 */
@media screen and (max-width: 1024px) {
  .track-btn {
    padding: 4px 8px;
    font-size: 9px;
  }
}

@media screen and (max-width: 768px) {
  .track-btn {
    padding: 3px 6px;
    font-size: 8px;
  }

  .position-debug-tool {
    width: 220px;
  }

  .debug-panel-header {
    padding: 0 3px;
  }

  .drag-handle {
    padding: 8px 5px;
  }

  .debug-toggle {
    padding: 8px 10px;
  }
}

/* 编辑对话框样式 */
.edit-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.edit-dialog {
  position: fixed;
  background-color: #fff;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  cursor: default;
  top: 0;
  left: 0;
}

.edit-dialog-header {
  background-color: #2c3e50;
  color: white;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: move;
  user-select: none;
}

.edit-dialog-header:hover {
  background-color: #34495e;
}

.edit-dialog-header:active {
  cursor: grabbing;
}

.edit-dialog-header h3 {
  margin: 0;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0 4px;
}

.edit-dialog-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: bold;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.edit-dialog-footer {
  padding: 12px 20px;
  background-color: #f5f5f5;
  display: flex;
  justify-content: space-between;
}

.save-btn {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.cancel-btn {
  background-color: #95a5a6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

/* 确认删除对话框样式 */
.confirm-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2100;
}

.confirm-dialog {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  width: 300px;
  max-width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  text-align: center;
}

.confirm-dialog h3 {
  margin-top: 0;
  color: #e74c3c;
}

.confirm-dialog-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 12px;
}

.confirm-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.position-slider {
  width: 100%;
  margin-top: 5px;
  height: 10px;
}

.statistic-card {
  width: 100%;
  border: none;
}

.statistic-card :deep(.el-card__header) {
  padding: 10px 15px;
  background-color: #f5f7fa;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: bold;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-left .el-icon {
  margin-right: 8px;
  color: #409EFF;
}

.header-count {
  margin-left: 10px;
}

.compact-pagination {
  font-size: 12px;
  transform: scale(0.9);
  transform-origin: right center;
}

.compact-pagination :deep(.el-pagination__sizes) {
  margin-right: 5px;
}

.compact-pagination :deep(.el-select .el-input) {
  width: 80px;
}

.compact-pagination :deep(.el-pagination__jump) {
  margin-left: 5px;
}

.compact-pagination :deep(.el-pager li) {
  min-width: 24px;
}

.car-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.tag-group {
  display: flex;
  justify-content: center;
  gap: 5px;
}

.station-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.time-text {
  font-size: 12px;
  color: #909399;
  cursor: help;
}

.time-hint {
  margin-top: 8px;
  text-align: center;
  color: #909399;
}

.time-hint .el-icon {
  cursor: pointer;
  font-size: 16px;
  color: #909399;
}

.time-hint .el-icon:hover {
  color: #409EFF;
}

.table-card {
  margin-bottom: 10px;
}

.table-card :deep(.el-card__header) {
  padding: 10px 15px;
  background-color: #f5f7fa;
}

.header-tag {
  margin-left: auto;
}

.total-count-display {
  margin-left: 15px;
  display: flex;
  align-items: center;
}

.total-count-tag {
  font-weight: bold;
  padding: 4px 10px;
  border-radius: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.total-count-tag:hover {
  transform: scale(1.05);
}

.total-count-tag .el-icon {
  margin-right: 5px;
  font-size: 16px;
  vertical-align: middle;
}

.total-text {
  font-size: 12px;
  vertical-align: right;
}
.total-count-row{
  display: flex;
  /* align-self:first baseline; */
}

/* 全屏弹窗样式 */
.fullscreen-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(5px);
}

.fullscreen-modal {
  width: 95vw;
  height: 95vh;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.fullscreen-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom: 1px solid #e0e6ed;
}

.fullscreen-modal-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: bold;
}

.fullscreen-modal-title .el-icon {
  font-size: 20px;
}

.fullscreen-header-tag {
  margin-left: 15px;
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
}

.fullscreen-modal-actions {
  display: flex;
  gap: 10px;
}

.fullscreen-search-area {
  padding: 15px 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.fullscreen-content {
  flex: 1;
  padding: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.fullscreen-production-line-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  background-color: #f5f5f5;
  border-radius: 8px;
}

/* 全屏模式下的背景图样式 */
.fullscreen-modal .background-image {
  flex: 1;
  width: 100%;
  background-image: url('@/assets/Layout.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  cursor: crosshair;
  border-radius: 8px;
  overflow: hidden;
}

/* 响应式适配 */
@media screen and (max-width: 1024px) {
  .fullscreen-modal {
    width: 95vw;
    height: 95vh;
  }
  
  .fullscreen-modal-header {
    padding: 12px 15px;
  }
  
  .fullscreen-modal-title {
    font-size: 16px;
  }
  
  .fullscreen-search-area {
    padding: 12px 15px;
  }
  
  .fullscreen-content {
    padding: 15px;
  }
}

@media screen and (max-width: 768px) {
  .fullscreen-modal {
    width: 98vw;
    height: 98vh;
  }
  
  .fullscreen-modal-header {
    flex-direction: column;
    gap: 10px;
    padding: 10px 12px;
  }
  
  .fullscreen-modal-actions {
    width: 100%;
    justify-content: center;
  }
  
  .fullscreen-search-area {
    padding: 10px 12px;
  }
  
  .fullscreen-content {
    padding: 12px;
  }
}

/* 车号输入区域布局样式 */
.custom-form-item-layout :deep(.el-form-item__content) {
  width: 100% !important;
}

.form-content-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 40px;
}

.left-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.car-input {
  flex: 1;
  max-width: 300px;
}

.right-controls {
  display: flex;
  align-items: center;
  margin-left: 20px;
}
</style>
