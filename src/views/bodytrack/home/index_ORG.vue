<!--
 * @LastEditTime: 2024-03-20 10:30
 -->
<template>
  <div class="production-line-container">
    <div class="background-image" ref="backgroundImageRef" @click="handleBackgroundClick($event)">
      <div class="background-actual" ref="actualImageRef">
        <TrackPoints :isDebugMode="isDebugMode" :points="trackPoints" :isEditingIndex="isEditingIndex" :dotSize="12" :dotColor="'#ff0000'"
          :activeColor="'#ffff00'" @point-click="handlePointClick" />

        <!-- 调试点标记 -->
        <div v-if="isDebugMode" class="debug-marker"
          :style="{ left: debugPosition.x + '%', top: debugPosition.y + '%' }" @mousedown.stop="startDragMarker"></div>
      </div>

      <!-- 调试工具面板 -->
      <div class="debug-panel" :style="debugPanelStyle" @click.stop>
        <div class="debug-panel-header" @mousedown.prevent="startDragPanel">
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

    <!-- 按钮编辑对话框 -->
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
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed, watch, onUnmounted } from 'vue';
import TrackPoints from '@/components/TrackPoints.vue';

// 背景图DOM引用
const backgroundImageRef = ref(null);
const actualImageRef = ref(null);

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
const isDebugMode = ref(true);

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
  const value = parseFloat(newValue);
  if (!isNaN(value)) {
    debugPosition.x = Math.max(0, Math.min(100, value));
    console.log(`X位置已更新: ${debugPosition.x}%`);
  }
});

watch(yPosition, (newValue) => {
  const value = parseFloat(newValue);
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
const startDragMarker = (event) => {
  if (!isDebugMode.value || !actualImageRef.value) return;

  // 阻止默认行为和事件冒泡
  event.preventDefault();
  event.stopPropagation();

  // 获取实际图片区域
  const imgRect = actualImageRef.value.getBoundingClientRect();

  const updateMarkerPosition = (e) => {
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
    area: '自定义'
  });

  console.log(`已添加新点位: ${newId} 在位置 (${debugPosition.x}%, ${debugPosition.y}%)`);
};

// 定义红点位置数据（根据原始图片的坐标）
const trackPoints = reactive([]);  // 清空初始数据，改为从XML加载
//--------------------------------------------------------------------------------
const testData: any =
{
  '1': [{ 'fis': 6666, 'sq': 6, 'dateTime': 20200202 }, { 'fis': 888, 'sq': 66, 'dateTime': 20200202 }, { 'fis': 999, 'sq': 666, 'dateTime': 20200202 }],
  '2': [{ 'fis': 7777, 'sq': 7, 'dateTime': 20200202 }],
  '5': [{ 'fis': 8888, 'sq': 9, 'dateTime': 20200202 }],
}
const updateData = () => {
  trackPoints.forEach(item => {
    if (testData[item.id]) {
      item['av'] = testData[item.id]
    }
    else {
      item['av'] = [{ 'fis': '', 'sq': '999', 'dateTime': '' }]
    }

  })
}
//--------------------------------------------------------------------------------
// 计算按钮样式
const getButtonStyle = (point, index) => {
  // 如果当前点位正在编辑中，且有位置变动，则使用编辑中的坐标
  if (index === isEditingIndex.value && isEditDialogVisible.value) {
    return {
      left: `${editingPoint.xPercent}%`,
      top: `${editingPoint.yPercent}%`,
    };
  }

  // 否则使用原始坐标
  return {
    left: `${point.xPercent}%`,
    top: `${point.yPercent}%`,
  };
};

// 按钮编辑对话框状态
const isEditDialogVisible = ref(false);
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

// 打开编辑对话框
const openEditDialog = (point, index) => {
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

// 更新预览
const updatePreview = () => {
  // 验证输入，确保是有效数值
  let xPercent = parseFloat(editingPoint.xPercent);
  let yPercent = parseFloat(editingPoint.yPercent);

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
    const xPercent = parseFloat(editingPoint.xPercent);
    const yPercent = parseFloat(editingPoint.yPercent);

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
  }
};

// 监听窗口大小变化
const handleResize = () => {
  updateImageDimensions();
};

// 组件挂载时加载数据
onMounted(async () => {
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
    img.src = require('@/assets/pp.png');
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
    const xmlDoc = parser.parseFromString(cleanXml, 'text/xml');

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
    setTimeout(() => {
      updateData();
    }, 3000);
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
</script>

<style scoped>
.production-line-container {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.background-image {
  width: 100%;
  height: 100%;
  background-image: url('@/assets/pp.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  cursor: crosshair;
  /* 在调试模式下使用十字光标 */
}

/* 实际显示的图片区域容器 */
.background-actual {
  position: absolute;
  /* 尺寸和位置将通过JavaScript动态设置 */
  top: 0;
  left: 0;
  pointer-events: none;
  /* 使点击事件穿透到实际背景 */
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

@media screen and (max-width: 768px) {
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
</style>