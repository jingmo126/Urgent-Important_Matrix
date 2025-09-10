<template>
  <div class="relative w-full h-full bg-gradient-to-br from-pink-50 via-white to-purple-50 rounded-3xl shadow-2xl overflow-hidden border-4 border-pink-200" style="background-image: radial-gradient(circle at 20% 80%, rgba(255, 182, 193, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(221, 160, 221, 0.1) 0%, transparent 50%);">
    <!-- 坐标系 -->
    <div class="absolute inset-0 p-8" @click="handleCoordinateClick($event)">
      <!-- 坐标轴 -->
      <svg class="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <!-- 水平十字线 (扩大到整个区域) -->
        <line 
          x1="5%" y1="50%" x2="95%" y2="50%" 
          stroke="#EC4899" stroke-width="1" stroke-dasharray="4" 
          class="transition-all duration-300 animate-pulse-slow"
        />
        
        <!-- 垂直十字线 (扩大到整个区域) -->
        <line 
          x1="50%" y1="5%" x2="50%" y2="95%" 
          stroke="#EC4899" stroke-width="1" stroke-dasharray="4" 
          class="transition-all duration-300 animate-pulse-slow"
        />
        
        <!-- 象限标签 - 默认状态 -->
        <g v-if="activeQuadrant === 0">
          <text 
            x="25%" y="25%" 
            class="text-sm font-medium fill-important transition-all duration-500"
          >重要不紧急</text>
          <text 
            x="25%" y="75%" 
            class="text-sm font-medium fill-gray-500 transition-all duration-500"
          >不重要不紧急</text>
          <text 
            x="75%" y="25%" 
            class="text-sm font-medium fill-danger transition-all duration-500"
          >重要紧急</text>
          <text 
            x="75%" y="75%" 
            class="text-sm font-medium fill-urgent transition-all duration-500"
          >不重要但紧急</text>
        </g>
        
        <!-- 象限标签 - 放大状态 -->
        <text 
          v-if="activeQuadrant === 1"
          x="50%" y="15%" 
          text-anchor="middle"
          class="text-xl font-bold fill-danger transition-all duration-700 animate-pulse-slow"
        >重要紧急</text>
        <text 
          v-if="activeQuadrant === 2"
          x="50%" y="15%" 
          text-anchor="middle"
          class="text-xl font-bold fill-important transition-all duration-700 animate-pulse-slow"
        >重要不紧急</text>
        <text 
          v-if="activeQuadrant === 3"
          x="50%" y="15%" 
          text-anchor="middle"
          class="text-xl font-bold fill-gray-500 transition-all duration-700 animate-pulse-slow"
        >不重要不紧急</text>
        <text 
          v-if="activeQuadrant === 4"
          x="50%" y="15%" 
          text-anchor="middle"
          class="text-xl font-bold fill-urgent transition-all duration-700 animate-pulse-slow"
        >不重要但紧急</text>
      </svg>
      
      <!-- 目标点组 -->
      <div 
        v-for="group in goalGroups" 
        :key="`group-${group.x}-${group.y}`"
        class="absolute rounded-full shadow-md transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-700 hover:scale-125 z-10 animate-pop-in"
        :class="[
          group.goals.length === 1 ? getGoalColor(group.goals[0]) : 'bg-blue-500'
        ]"
        :style="{
            left: group.x,
            top: group.y,
            width: '24px',
            height: '24px',
            'animation-delay': group.goals[0].id * 100 + 'ms'
          }"
        @click.stop="group.goals.length === 1 ? enterGoalTodoList(group.goals[0]) : null"
        @mousedown.stop="group.goals.length === 1 ? startDrag($event, group.goals[0]) : null"
      >
        <!-- 单个目标显示图标 -->
        <span v-if="group.goals.length === 1" class="absolute top-0 left-0 w-full h-full flex items-center justify-center text-lg">
          {{ group.goals[0].marked ? '⭐' : '📌' }}
        </span>
        <!-- 多个目标显示数量 -->
        <span v-else class="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs font-bold text-white">
          {{ group.goals.length }}
        </span>
        <!-- 目标标题 -->
        <div v-if="group.goals.length === 1" 
          class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-white/80 px-2 py-0.5 rounded-full text-2xs shadow-sm max-w-[100px] overflow-hidden text-center cursor-pointer hover:bg-white hover:shadow-md transition-all duration-300"
          @click.stop.prevent="editGoalTitle(group.goals[0], $event)"
          @mousedown.stop.prevent
          :title="'点击编辑目标名称'"
        >
          {{ group.goals[0].title }}
        </div>
        <!-- 优先级指示器 -->
        <div 
          class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 rounded-full transition-all duration-700"
          :class="group.goals.length === 1 ? getGoalColor(group.goals[0]) : 'bg-blue-300'"
          :style="{width: `${Math.max(20, group.goals.length === 1 ? group.goals[0].priority * 4 : 32)}px`}"
        ></div>
      </div>
      
      <!-- 底部提示信息 -->
      <div 
        class="absolute bottom-4 left-0 right-0 text-center text-sm text-blue-600 font-medium bg-blue-50 py-2 px-4 rounded-md mx-auto w-auto max-w-xs animate-fade-in shadow-md flex items-center justify-center space-x-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 animate-pulse-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>点击目标进入ToDoList | 点击空白区域创建目标</span>
      </div>
    </div>
    

    
    <!-- 拖拽提示 -->
    <div class="absolute bottom-4 right-4 bg-white/90 rounded-lg shadow-md px-3 py-2 text-xs text-gray-700 max-w-xs z-30 border-l-4 border-blue-400 animate-fade-in">
      <div class="font-medium mb-1 text-blue-600">💡 小提示</div>
      <ul class="list-disc pl-4 space-y-1">
        <li>点击目标下方的文本可以直接修改目标名称</li>
        <li>长按并拖动目标可以修改其重要度和紧急度</li>
      </ul>
    </div>
    

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useTaskStore } from '../store/taskStore';

const props = defineProps({
  goals: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['enter-todo-list', 'create-goal']);

const taskStore = useTaskStore();

// 拖拽相关状态
const isDragging = ref(false);
const draggedGoal = ref(null);
const dragStartX = ref(0);
const dragStartY = ref(0);
const dragStartTime = ref(0); // 记录鼠标按下的时间
const dragThreshold = 5; // 拖拽阈值（像素）
const clickThreshold = 300; // 点击阈值（毫秒）
const dragContainer = ref(null); // 拖拽容器引用
const dragIconElement = ref(null); // 拖拽时跟随鼠标的图标元素
const isClick = ref(true); // 标记当前操作是否为点击
const isDragEndedRecently = ref(false); // 标记最近是否结束拖拽

// 计算重叠目标组
const goalGroups = computed(() => {
  const groups = new Map();
  
  props.goals.forEach(goal => {
    const x = getGoalPositionX(goal);
    const y = getGoalPositionY(goal);
    const key = `${x}-${y}`;
    
    if (!groups.has(key)) {
      groups.set(key, {
        x,
        y,
        goals: [],
        position: { x, y }
      });
    }
    groups.get(key).goals.push(goal);
  });
  
  return Array.from(groups.values());
});

// 根据目标的优先级获取颜色
function getGoalColor(goal) {
  const priority = goal.priority;
  
  if (priority >= 8) return 'bg-danger';
  if (priority >= 6) return 'bg-warning';
  if (priority >= 4) return 'bg-primary';
  return 'bg-gray-500';
}

// 获取目标X坐标位置 - 支持浮点数坐标
  // 坐标系原点（0，0）为矩阵左下角，（10，10）为矩阵右上角
  function getGoalPositionX(goal) {
    // 从5%到95%的区域，映射0-10的紧急度值
    return `${5 + goal.urgency * 9}%`;
  }
  
  // 获取目标Y坐标位置 - 支持浮点数坐标
  // 坐标系原点（0，0）为矩阵左下角，（10，10）为矩阵右上角
  function getGoalPositionY(goal) {
    // 从95%到5%的区域（Y轴反向），映射0-10的重要度值
    return `${95 - goal.importance * 9}%`;
  }

// 进入目标的ToDoList清单
function enterGoalTodoList(goal) {
  emit('enter-todo-list', goal);
}

// 编辑目标标题
function editGoalTitle(goal, event) {
  // 阻止默认行为和冒泡，防止页面刷新
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  // 使用更安全的方式获取新标题
  const newTitle = window.prompt('请输入新的目标名称:', goal.title);
  
  // 只有当用户输入了有效的新标题时才更新
  if (newTitle !== null && newTitle.trim() !== '' && newTitle !== goal.title) {
    const updatedGoal = { ...goal, title: newTitle.trim() };
    taskStore.updateGoal(updatedGoal);
  }
}

// 处理坐标系空白区域点击
// 点击坐标系空白区域创建新目标
function handleCoordinateClick(event) {
  // 只有当点击的是背景元素、不在拖拽状态且不是刚刚结束拖拽时才创建新目标
  if ((event.target === event.currentTarget || 
       event.target.tagName === 'svg' || 
       event.target.tagName === 'rect' || 
       event.target.tagName === 'line' || 
       event.target.tagName === 'text') && 
      !isDragging.value && 
      !isDragEndedRecently.value) {
    
    // 获取坐标系容器的位置和尺寸
    const container = event.currentTarget;
    const rect = container.getBoundingClientRect();
    
    // 计算鼠标在容器内的相对位置（百分比）
    const relativeX = (event.clientX - rect.left) / rect.width;
    const relativeY = (event.clientY - rect.top) / rect.height;
    
    // 将相对位置转换为重要度和紧急度（0-10范围）
    // X轴对应紧急度，Y轴对应重要度（反向）
    // 保留浮点数以提高精度
    // 坐标系原点（0，0）为矩阵左下角，（10，10）为矩阵右上角
    let urgency = relativeX * 10;
    let importance = (1 - relativeY) * 10;
    
    // 确保值在0-10范围内
    urgency = Math.max(0, Math.min(10, urgency));
    importance = Math.max(0, Math.min(10, importance));
    
    // 触发创建目标事件
    emit('create-goal', { urgency, importance });
  }
}

// 开始拖拽
function startDrag(event, goal) {
  // 阻止默认行为和冒泡
  event.preventDefault();
  event.stopPropagation();
  
  // 设置拖拽状态
  isDragging.value = true;
  isClick.value = true; // 初始状态假设是点击
  draggedGoal.value = { ...goal };
  dragStartX.value = event.clientX;
  dragStartY.value = event.clientY;
  dragStartTime.value = Date.now(); // 记录鼠标按下的时间
  
  // 创建跟随鼠标的图标元素，但暂时不显示
  // 只有确认是拖拽操作时才显示
  const icon = goal.marked ? '⭐' : '📌';
  dragIconElement.value = document.createElement('div');
  dragIconElement.value.textContent = icon;
  dragIconElement.value.style.position = 'fixed';
  dragIconElement.value.style.left = `${event.clientX}px`;
  dragIconElement.value.style.top = `${event.clientY}px`;
  // 移除transform居中，使拖拽图标与实际落点位置一致
  dragIconElement.value.style.fontSize = '24px';
  dragIconElement.value.style.opacity = '0'; // 初始设为不可见
  dragIconElement.value.style.pointerEvents = 'none';
  dragIconElement.value.style.zIndex = '9999';
  dragIconElement.value.style.transition = 'opacity 0.2s';
  dragIconElement.value.style.willChange = 'left, top'; // 提高性能
  document.body.appendChild(dragIconElement.value);
  
  // 添加全局事件监听
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
  
  // 显示拖拽提示
  document.body.style.cursor = 'grabbing';
}

// 拖拽中
function onDrag(event) {
  if (!isDragging.value || !draggedGoal.value) return;
  
  // 计算鼠标移动距离
  const deltaX = Math.abs(event.clientX - dragStartX.value);
  const deltaY = Math.abs(event.clientY - dragStartY.value);
  
  // 如果移动距离超过阈值，则认为是拖拽而非点击
  if (isClick.value && (deltaX > dragThreshold || deltaY > dragThreshold)) {
    isClick.value = false;
    
    // 显示拖拽图标
    if (dragIconElement.value) {
      dragIconElement.value.style.opacity = '0.5';
    }
  }
  
  // 获取坐标系容器的位置和尺寸
  const container = document.querySelector('.relative.w-full.h-full');
  if (!container) return;
  
  const rect = container.getBoundingClientRect();
  
  // 获取坐标系绘图区域（考虑内边距）
  const drawingArea = document.querySelector('.absolute.inset-0.p-8');
  if (!drawingArea) return;
  
  const drawingRect = drawingArea.getBoundingClientRect();
  
  // 图标的尺寸
  const iconWidth = 24;
  const iconHeight = 24;
  const iconHalfWidth = iconWidth / 2;
  const iconHalfHeight = iconHeight / 2;
  
  // 限制鼠标位置在绘图区域内
  const clampedClientX = Math.max(drawingRect.left + iconHalfWidth, 
                                 Math.min(drawingRect.right - iconHalfWidth, event.clientX));
  const clampedClientY = Math.max(drawingRect.top + iconHalfHeight, 
                                 Math.min(drawingRect.bottom - iconHalfHeight, event.clientY));
  
  // 关键修改：基于限制后的鼠标位置计算相对坐标
  // 确保拖拽图标的视觉落点与实际保存的坐标值完全匹配
  const relativeX = (clampedClientX - drawingRect.left) / drawingRect.width;
  const relativeY = (clampedClientY - drawingRect.top) / drawingRect.height;
  
  // 将相对位置转换为重要度和紧急度（0-10范围）
  // X轴对应紧急度，Y轴对应重要度（反向）
  // 保留浮点数以提高精度
  // 坐标系原点（0，0）为矩阵左下角，（10，10）为矩阵右上角
  let newUrgency = relativeX * 10;
  let newImportance = (1 - relativeY) * 10;
  
  // 确保值在0-10范围内
  newUrgency = Math.max(0, Math.min(10, newUrgency));
  newImportance = Math.max(0, Math.min(10, newImportance));
  
  // 更新拖拽目标的值（但不立即保存到数据库）
  // 我们仍然需要更新draggedGoal.value，以便在stopDrag时使用正确的坐标
  draggedGoal.value.urgency = newUrgency;
  draggedGoal.value.importance = newImportance;
  
  // 更新跟随鼠标的图标位置
  if (dragIconElement.value) {
    // 关键修改：使用限制后的坐标，并确保图标的中心点与鼠标位置对齐
    // 这样可以确保视觉引导的图标落点与用户实际看到的鼠标位置完全一致
    // 同时限制图标在可落下的范围内
    dragIconElement.value.style.left = `${clampedClientX - iconHalfWidth}px`;
    dragIconElement.value.style.top = `${clampedClientY - iconHalfHeight}px`;
  }
}

// 停止拖拽
function stopDrag(event) {
  if (!isDragging.value || !draggedGoal.value) return;
  
  // 计算时间差
  const timeDiff = Date.now() - dragStartTime.value;
  
  // 如果是点击操作（移动距离小且时间短），则编辑目标标题
  if (isClick.value && timeDiff < clickThreshold) {
    // 移除拖拽相关元素和事件
    cleanupDrag();
    
    // 调用编辑目标标题函数
    editGoalTitle(draggedGoal.value, event);
    return;
  }
  
  // 如果是拖拽操作，则更新目标位置
  // 注意：我们直接使用onDrag函数中已经计算好的urgency和importance值
  // 这样可以避免再次计算时可能出现的偏差，解决拖拽图标与实际落点位置不一致的问题
  // 计算新的优先级（使用与store中相同的加权算法）
  draggedGoal.value.priority = draggedGoal.value.importance * 0.4 + draggedGoal.value.urgency * 0.6;
  
  // 保存当前拖拽目标，因为cleanupDrag会将其设为null
  const updatedGoal = draggedGoal.value;
  
  // 清理拖拽相关元素和事件
  cleanupDrag();
  
  // 为了解决页面刷新导致的空白问题，我们使用requestAnimationFrame来确保DOM更新完成后再保存
  // 这可以防止拖拽结束后的页面闪烁
  requestAnimationFrame(() => {
    // 我们使用Vue的nextTick进一步确保DOM更新完成
    nextTick(() => {
      taskStore.updateGoal(updatedGoal);
    });
  });
}

// 清理拖拽相关元素和事件
function cleanupDrag() {
  // 移除跟随鼠标的图标
  if (dragIconElement.value && dragIconElement.value.parentNode) {
    dragIconElement.value.parentNode.removeChild(dragIconElement.value);
    dragIconElement.value = null;
  }
  
  // 重置拖拽状态
  isDragging.value = false;
  draggedGoal.value = null;
  isClick.value = true;
  
  // 设置拖拽最近结束标志，防止立即点击创建新目标
  isDragEndedRecently.value = true;
  
  // 300毫秒后重置拖拽最近结束标志
  setTimeout(() => {
    isDragEndedRecently.value = false;
  }, 300);
  
  // 移除全局事件监听
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
  
  // 恢复鼠标样式
  document.body.style.cursor = 'default';
}

// 组件挂载和卸载时的事件处理
onMounted(() => {
  // 获取拖拽容器引用
  dragContainer.value = document.querySelector('.relative.w-full.h-full');
});

onUnmounted(() => {
  // 确保移除所有事件监听
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
  
  // 确保清理拖拽图标
  if (dragIconElement.value && dragIconElement.value.parentNode) {
    dragIconElement.value.parentNode.removeChild(dragIconElement.value);
    dragIconElement.value = null;
  }
});
</script>

<style>
/* 动画效果 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes popIn {
  0% { transform: scale(0) translate(-50%, -50%); }
  70% { transform: scale(1.2) translate(-50%, -50%); }
  100% { transform: scale(1) translate(-50%, -50%); }
}

/* 超小号文本 */
.text-2xs {
  font-size: 0.65rem;
  line-height: 0.9rem;
}

@keyframes drawX {
  from { stroke-dasharray: 1000; stroke-dashoffset: 1000; }
  to { stroke-dasharray: 1000; stroke-dashoffset: 0; }
}

@keyframes drawY {
  from { stroke-dasharray: 1000; stroke-dashoffset: 1000; }
  to { stroke-dasharray: 1000; stroke-dashoffset: 0; }
}

@keyframes pulseSlow {
  0% { opacity: 0.7; }
  50% { opacity: 1; }
  100% { opacity: 0.7; }
}

@keyframes bounceSlow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes glow {
  0% { filter: drop-shadow(0 0 2px rgba(59, 130, 246, 0.3)); }
  50% { filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.6)); }
  100% { filter: drop-shadow(0 0 2px rgba(59, 130, 246, 0.3)); }
}

@keyframes zoomIn {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.animate-fadeIn {
  animation: fadeIn 1s ease-out;
}

.animate-pop-in {
  animation: popIn 0.5s ease-out forwards;
}

.animate-draw-x {
  animation: drawX 1.5s ease-out forwards;
}

.animate-draw-y {
  animation: drawY 1.5s ease-out forwards;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

.animate-pulse-slow {
  animation: pulseSlow 3s infinite;
}

.animate-bounce-slow {
  animation: bounceSlow 2s infinite;
}

.animate-glow {
  animation: glow 3s infinite;
}

.animate-zoom-in {
  animation: zoomIn 0.7s ease-out forwards;
}

/* 拖拽相关样式 */
.task-draggable {
  cursor: grab;
}

.task-draggable:active {
  cursor: grabbing;
}
</style>