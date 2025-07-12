<template>
  <div class="relative w-full h-full bg-white rounded-lg shadow-md overflow-hidden">
    <!-- 坐标系 -->
    <div class="absolute inset-0 p-8" @mouseleave="activeQuadrant.value !== 0 && resetActiveQuadrant()">
      <!-- Y轴标签 (重要度) - 默认状态 -->
      <div v-if="activeQuadrant === 0" class="absolute top-0 left-0 h-full flex items-center">
        <div class="transform -rotate-90 origin-center whitespace-nowrap text-sm font-medium text-blue-500 animate-fadeIn">
          重要度
        </div>
      </div>
      
      <!-- X轴标签 (紧急度) - 默认状态 -->
      <div v-if="activeQuadrant === 0" class="absolute bottom-0 left-0 w-full flex justify-center">
        <div class="text-sm font-medium text-blue-500 animate-fadeIn">紧急度</div>
      </div>
      
      <!-- Y轴标签 (重要度) - 放大状态 -->
      <div v-if="activeQuadrant !== 0" class="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
        <div class="text-lg font-bold text-blue-500 animate-zoom-in bg-white/80 px-3 py-1 rounded-full shadow-md">
          重要度
        </div>
      </div>
      
      <!-- X轴标签 (紧急度) - 放大状态 -->
      <div v-if="activeQuadrant !== 0" class="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-20">
        <div class="text-lg font-bold text-blue-500 animate-zoom-in bg-white/80 px-3 py-1 rounded-full shadow-md">紧急度</div>
      </div>
      
      <!-- 坐标轴 -->
      <svg class="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <!-- 象限背景 - 默认状态 -->
        <g v-if="activeQuadrant === 0">
          <rect 
            x="10%" y="5%" width="40%" height="45%" 
            class="fill-blue-50 transition-all duration-500 cursor-pointer opacity-30 hover:opacity-50 stroke-blue-200 stroke-1"
            @mouseenter="setActiveQuadrant(1)" 
          />
          <rect 
            x="50%" y="5%" width="45%" height="45%" 
            class="fill-blue-50 transition-all duration-500 cursor-pointer opacity-30 hover:opacity-50 stroke-blue-200 stroke-1"
            @mouseenter="setActiveQuadrant(2)" 
          />
          <rect 
            x="10%" y="50%" width="40%" height="40%" 
            class="fill-blue-50 transition-all duration-500 cursor-pointer opacity-30 hover:opacity-50 stroke-blue-200 stroke-1"
            @mouseenter="setActiveQuadrant(3)" 
          />
          <rect 
            x="50%" y="50%" width="45%" height="40%" 
            class="fill-blue-50 transition-all duration-500 cursor-pointer opacity-30 hover:opacity-50 stroke-blue-200 stroke-1"
            @mouseenter="setActiveQuadrant(4)" 
          />
        </g>
        
        <!-- 象限背景 - 放大状态 -->
        <rect 
          v-if="activeQuadrant === 1"
          x="5%" y="5%" width="90%" height="85%" 
          class="fill-blue-50 transition-all duration-700 cursor-pointer opacity-80 animate-zoom-in stroke-blue-200 stroke-1"
        />
        <rect 
          v-if="activeQuadrant === 2"
          x="5%" y="5%" width="90%" height="85%" 
          class="fill-blue-50 transition-all duration-700 cursor-pointer opacity-80 animate-zoom-in stroke-blue-200 stroke-1"
        />
        <rect 
          v-if="activeQuadrant === 3"
          x="5%" y="5%" width="90%" height="85%" 
          class="fill-blue-50 transition-all duration-700 cursor-pointer opacity-80 animate-zoom-in stroke-blue-200 stroke-1"
        />
        <rect 
          v-if="activeQuadrant === 4"
          x="5%" y="5%" width="90%" height="85%" 
          class="fill-blue-50 transition-all duration-700 cursor-pointer opacity-80 animate-zoom-in stroke-blue-200 stroke-1"
        />
        
        <!-- 水平中线 (Y=5) -->
        <line 
          x1="10%" y1="50%" x2="95%" y2="50%" 
          stroke="#3B82F6" stroke-width="1.5" stroke-dasharray="4" 
          class="transition-all duration-300 animate-pulse-slow"
          :class="{'opacity-0': activeQuadrant !== 0}"
        />
        
        <!-- 垂直中线 (X=5) -->
        <line 
          x1="50%" y1="5%" x2="50%" y2="90%" 
          stroke="#3B82F6" stroke-width="1.5" stroke-dasharray="4" 
          class="transition-all duration-300 animate-pulse-slow"
          :class="{'opacity-0': activeQuadrant !== 0}"
        />
        
        <!-- X轴 - 始终显示 -->
        <line 
          x1="10%" y1="90%" x2="95%" y2="90%" 
          stroke="#3B82F6" stroke-width="2"
          class="transition-all duration-500 animate-glow"
        />
        
        <!-- Y轴 - 始终显示 -->
        <line 
          x1="10%" y1="90%" x2="10%" y2="5%" 
          stroke="#3B82F6" stroke-width="2"
          class="transition-all duration-500 animate-glow"
        />
        
        <!-- X轴刻度线 -->
        <g>
          <!-- 刻度线 1 -->
          <line x1="10%" y1="90%" x2="10%" y2="92%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="10%" y="96%" text-anchor="middle" class="text-xs fill-blue-500">0</text>
          
          <!-- 刻度线 2 -->
          <line x1="27%" y1="90%" x2="27%" y2="92%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="27%" y="96%" text-anchor="middle" class="text-xs fill-blue-500">2</text>
          
          <!-- 刻度线 5 -->
          <line x1="53%" y1="90%" x2="53%" y2="92%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="53%" y="96%" text-anchor="middle" class="text-xs fill-blue-500">5</text>
          
          <!-- 刻度线 8 -->
          <line x1="78%" y1="90%" x2="78%" y2="92%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="78%" y="96%" text-anchor="middle" class="text-xs fill-blue-500">8</text>
          
          <!-- 刻度线 10 -->
          <line x1="95%" y1="90%" x2="95%" y2="92%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="95%" y="96%" text-anchor="middle" class="text-xs fill-blue-500">10</text>
        </g>
        
        <!-- Y轴刻度线 -->
        <g>
          <!-- 刻度线 1 -->
          <line x1="8%" y1="90%" x2="10%" y2="90%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="6%" y="90%" text-anchor="middle" dominant-baseline="middle" class="text-xs fill-blue-500">0</text>
          
          <!-- 刻度线 2 -->
          <line x1="8%" y1="73%" x2="10%" y2="73%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="6%" y="73%" text-anchor="middle" dominant-baseline="middle" class="text-xs fill-blue-500">2</text>
          
          <!-- 刻度线 5 -->
          <line x1="8%" y1="48%" x2="10%" y2="48%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="6%" y="48%" text-anchor="middle" dominant-baseline="middle" class="text-xs fill-blue-500">5</text>
          
          <!-- 刻度线 8 -->
          <line x1="8%" y1="22%" x2="10%" y2="22%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="6%" y="22%" text-anchor="middle" dominant-baseline="middle" class="text-xs fill-blue-500">8</text>
          
          <!-- 刻度线 10 -->
          <line x1="8%" y1="5%" x2="10%" y2="5%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="6%" y="5%" text-anchor="middle" dominant-baseline="middle" class="text-xs fill-blue-500">10</text>
        </g>
        
        <!-- 象限标签 - 默认状态 -->
        <g v-if="activeQuadrant === 0">
          <text 
            x="75%" y="25%" 
            class="text-sm font-medium fill-important transition-all duration-500"
          >重要不紧急</text>
          <text 
            x="75%" y="75%" 
            class="text-sm font-medium fill-gray-500 transition-all duration-500"
          >不重要不紧急</text>
          <text 
            x="25%" y="25%" 
            class="text-sm font-medium fill-danger transition-all duration-500"
          >重要且紧急</text>
          <text 
            x="25%" y="75%" 
            class="text-sm font-medium fill-urgent transition-all duration-500"
          >不重要但紧急</text>
        </g>
        
        <!-- 象限标签 - 放大状态 -->
        <text 
          v-if="activeQuadrant === 1"
          x="50%" y="15%" 
          text-anchor="middle"
          class="text-xl font-bold fill-danger transition-all duration-700 animate-pulse-slow"
        >重要且紧急</text>
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
          class="text-xl font-bold fill-urgent transition-all duration-700 animate-pulse-slow"
        >不重要但紧急</text>
        <text 
          v-if="activeQuadrant === 4"
          x="50%" y="15%" 
          text-anchor="middle"
          class="text-xl font-bold fill-gray-500 transition-all duration-700 animate-pulse-slow"
        >不重要不紧急</text>
      </svg>
      
      <!-- 任务点 -->
      <div 
        v-for="task in tasks" 
        :key="task.id"
        class="absolute rounded-full shadow-md transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-700 hover:scale-125 z-10 animate-pop-in"
        :class="[
          getTaskColor(task),
          isTaskInActiveQuadrant(task) ? 'scale-150 z-20 ring-2 ring-white' : 'scale-100',
          activeQuadrant !== 0 && !isTaskInActiveQuadrant(task) ? 'opacity-0' : 'opacity-100'
        ]"
        :style="{
          left: getTaskPositionX(task),
          top: getTaskPositionY(task),
          width: isTaskInActiveQuadrant(task) ? '36px' : '24px',
          height: isTaskInActiveQuadrant(task) ? '36px' : '24px',
          'animation-delay': task.id * 100 + 'ms'
        }"
        @click="editTask(task)"
        @mouseenter="hoveredTask = task"
        @mouseleave="hoveredTask = null"
      >
        <span class="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs font-bold text-white">
          {{ task.id }}
        </span>
        <!-- 优先级指示器 -->
        <div 
          class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 rounded-full transition-all duration-700"
          :class="getPriorityBarColor(task)"
          :style="{width: `${Math.max(20, task.priority * 4)}px`}"
        ></div>
      </div>
      
      <!-- 底部提示信息 -->
      <div 
        v-if="activeQuadrant !== 0" 
        class="absolute bottom-4 left-0 right-0 text-center text-sm text-blue-600 font-medium bg-blue-50 py-2 px-4 rounded-md mx-auto w-auto max-w-xs animate-fade-in shadow-md flex items-center justify-center space-x-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 animate-pulse-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>当前正在查看<span class="font-bold">{{ getQuadrantName(activeQuadrant) }}</span>象限，<span class="font-bold">将鼠标移出整个坐标系</span>可返回全局视图</span>
      </div>
      
      <!-- 任务信息提示框 -->
      <div 
        v-if="hoveredTask && (activeQuadrant === 0 || isTaskInActiveQuadrant(hoveredTask))" 
        class="absolute z-30 bg-white rounded-md shadow-lg p-4 w-64 text-sm animate-fade-in border-l-4 transition-all duration-700"
        :class="getTaskBorderColor(hoveredTask)"
        :style="{
          left: getTooltipPositionX(hoveredTask),
          top: getTooltipPositionY(hoveredTask)
        }"
      >
        <div class="font-medium text-gray-900 text-base">{{ hoveredTask.title }}</div>
        <div v-if="hoveredTask.description" class="text-gray-600 mt-2 text-xs">{{ hoveredTask.description }}</div>
        <div class="flex justify-between mt-3 text-xs font-medium">
          <span class="px-2 py-1 rounded-full bg-blue-100 text-blue-800">重要度: {{ hoveredTask.importance }}</span>
          <span class="px-2 py-1 rounded-full bg-blue-100 text-blue-800">紧急度: {{ hoveredTask.urgency }}</span>
        </div>
        <div class="text-xs font-medium mt-2 flex items-center">
          <span class="mr-2">优先级:</span>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="h-2 rounded-full transition-all duration-500 animate-pulse-slow"
              :class="getPriorityBarColor(hoveredTask)"
              :style="{width: `${hoveredTask.priority * 10}%`}"
            ></div>
          </div>
          <span class="ml-2">{{ hoveredTask.priority.toFixed(1) }}</span>
        </div>
      </div>
    </div>
    
    <!-- 添加按钮 -->
    <button 
      v-if="editMode"
      @click="$emit('add-task')"
      class="absolute bottom-4 right-4 bg-primary text-white rounded-full p-3 shadow-lg hover:bg-blue-600 transition-all duration-300 hover:scale-110 z-30 animate-bounce-slow"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </button>
    
    <!-- 缩放控制按钮 -->
    <div class="absolute top-4 right-4 flex space-x-2 z-30">
      <button 
        @click="resetActiveQuadrant"
        class="bg-white text-gray-700 rounded-full p-2 shadow-md hover:bg-gray-100 transition-all duration-300 hover:scale-110"
        :class="{'bg-primary text-white': activeQuadrant === 0}"
        title="重置视图"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      </button>
      
      <!-- 鼠标悬停放大开关 -->
      <button 
        @click="hoverZoomEnabled = !hoverZoomEnabled"
        class="bg-white text-gray-700 rounded-full p-2 shadow-md hover:bg-gray-100 transition-all duration-300 hover:scale-110"
        :class="{'bg-primary text-white': hoverZoomEnabled}"
        title="鼠标悬停放大开关"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  tasks: {
    type: Array,
    default: () => []
  },
  editMode: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['edit-task', 'add-task']);
const hoveredTask = ref(null);
const activeQuadrant = ref(0); // 0表示无活动象限，1-4表示四个象限
const hoverZoomEnabled = ref(false); // 控制鼠标悬停放大象限事件的开关

// 设置活动象限
function setActiveQuadrant(quadrant) {
  // 只有当开关启用时，才允许通过鼠标悬停设置活动象限
  if (hoverZoomEnabled.value || activeQuadrant.value !== 0) {
    activeQuadrant.value = quadrant;
  }
}

// 重置活动象限
function resetActiveQuadrant() {
  activeQuadrant.value = 0;
}

// 判断任务是否在活动象限中
function isTaskInActiveQuadrant(task) {
  if (activeQuadrant.value === 0) return false;
  
  const quadrant = getTaskQuadrant(task);
  return quadrant === activeQuadrant.value;
}

// 获取任务所在象限
function getTaskQuadrant(task) {
  const importance = task.importance;
  const urgency = task.urgency;
  
  if (importance >= 5 && urgency >= 5) return 1; // 重要且紧急
  if (importance >= 5 && urgency < 5) return 2; // 重要不紧急
  if (importance < 5 && urgency >= 5) return 3; // 不重要但紧急
  return 4; // 不重要不紧急
}

// 根据任务的优先级获取颜色
function getTaskColor(task) {
  const priority = task.priority;
  
  if (priority >= 8) return 'bg-danger';
  if (priority >= 6) return 'bg-warning';
  if (priority >= 4) return 'bg-primary';
  return 'bg-gray-500';
}

// 获取任务边框颜色
function getTaskBorderColor(task) {
  const priority = task.priority;
  
  if (priority >= 8) return 'border-danger';
  if (priority >= 6) return 'border-warning';
  if (priority >= 4) return 'border-primary';
  return 'border-gray-500';
}

// 获取优先级进度条颜色
function getPriorityBarColor(task) {
  const priority = task.priority;
  
  if (priority >= 8) return 'bg-danger';
  if (priority >= 6) return 'bg-warning';
  if (priority >= 4) return 'bg-primary';
  return 'bg-gray-500';
}

// 获取任务X坐标位置
function getTaskPositionX(task) {
  if (activeQuadrant.value === 0) {
    // 默认视图下的位置
    return `${10 + (task.urgency - 1) * 8.5}%`;
  } else if (isTaskInActiveQuadrant(task)) {
    // 放大视图下的位置
    const quadrant = getTaskQuadrant(task);
    
    // 在放大视图中，将任务点映射到整个可见区域（5%-95%）
    // 对于左侧象限（1和3），urgency值从1到5
    // 对于右侧象限（2和4），urgency值从6到10
    if (quadrant === 1 || quadrant === 3) { // 左侧象限
      // 将urgency 1-5映射到5%-95%
      return `${5 + (task.urgency - 1) * (90 / 5)}%`;
    } else { // 右侧象限
      // 将urgency 6-10映射到5%-95%
      return `${5 + (task.urgency - 6) * (90 / 5)}%`;
    }
  }
  
  return `${10 + (task.urgency - 1) * 8.5}%`; // 默认返回
}

// 获取任务Y坐标位置
function getTaskPositionY(task) {
  if (activeQuadrant.value === 0) {
    // 默认视图下的位置
    return `${90 - (task.importance - 1) * 8.5}%`;
  } else if (isTaskInActiveQuadrant(task)) {
    // 放大视图下的位置
    const quadrant = getTaskQuadrant(task);
    
    // 在放大视图中，将任务点映射到整个可见区域（5%-90%）
    // 对于上方象限（1和2），importance值从6到10
    // 对于下方象限（3和4），importance值从1到5
    if (quadrant === 1 || quadrant === 2) { // 上方象限
      // 将importance 6-10映射到5%-90%
      return `${5 + (10 - task.importance) * (85 / 5)}%`;
    } else { // 下方象限
      // 将importance 1-5映射到5%-90%
      return `${5 + (5 - task.importance) * (85 / 5)}%`;
    }
  }
  
  return `${90 - (task.importance - 1) * 8.5}%`; // 默认返回
}

// 获取提示框X坐标位置
function getTooltipPositionX(task) {
  if (activeQuadrant.value === 0) {
    return `${Math.min(85, 10 + (task.urgency - 1) * 8.5)}%`;
  } else {
    // 放大视图下，提示框位置需要调整
    const quadrant = getTaskQuadrant(task);
    
    if (quadrant === 1 || quadrant === 3) { // 左侧象限
      // 将urgency 1-5映射到提示框位置
      const position = 5 + (task.urgency - 1) * (90 / 5);
      // 确保提示框不会超出边界
      return `${Math.min(70, position + 10)}%`;
    } else { // 右侧象限
      // 将urgency 6-10映射到提示框位置
      const position = 5 + (task.urgency - 6) * (90 / 5);
      // 确保提示框不会超出边界
      return `${Math.min(70, position + 10)}%`;
    }
  }
}

// 获取提示框Y坐标位置
function getTooltipPositionY(task) {
  if (activeQuadrant.value === 0) {
    return `${Math.min(80, 90 - (task.importance - 1) * 8.5)}%`;
  } else {
    // 放大视图下，提示框位置需要调整
    const quadrant = getTaskQuadrant(task);
    
    if (quadrant === 1 || quadrant === 2) { // 上方象限
      // 将importance 6-10映射到提示框位置
      const position = 5 + (10 - task.importance) * (85 / 5);
      // 确保提示框不会超出边界
      return `${Math.min(70, position + 10)}%`;
    } else { // 下方象限
      // 将importance 1-5映射到提示框位置
      const position = 5 + (5 - task.importance) * (85 / 5);
      // 确保提示框不会超出边界
      return `${Math.min(70, position + 10)}%`;
    }
  }
}

// 获取象限名称
function getQuadrantName(quadrant) {
  switch (quadrant) {
    case 1: return '重要且紧急';
    case 2: return '重要不紧急';
    case 3: return '不重要但紧急';
    case 4: return '不重要不紧急';
    default: return '';
  }
}

// 编辑任务
function editTask(task) {
  if (!props.editMode) return;
  emit('edit-task', task);
}
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
</style>