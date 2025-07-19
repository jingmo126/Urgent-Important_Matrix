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
            x="50%" y="5%" width="45%" height="45%" 
            class="fill-blue-50 transition-all duration-500 cursor-pointer opacity-30 hover:opacity-50 stroke-blue-200 stroke-1"
            @mouseenter="setActiveQuadrant(1)" 
          />
          <rect 
            x="10%" y="5%" width="40%" height="45%" 
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
        
        <!-- X轴刻度线 - 默认状态 -->
        <g v-if="activeQuadrant === 0">
          <!-- 刻度线 1 -->
          <line x1="10%" y1="90%" x2="10%" y2="92%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="10%" y="96%" text-anchor="middle" class="text-xs fill-blue-500">0</text>
          
          <!-- 刻度线 2 -->
          <line x1="27%" y1="90%" x2="27%" y2="92%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="27%" y="96%" text-anchor="middle" class="text-xs fill-blue-500">2</text>
          
          <!-- 刻度线 5 -->
          <line x1="50%" y1="90%" x2="50%" y2="92%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="50%" y="96%" text-anchor="middle" class="text-xs fill-blue-500">5</text>
          
          <!-- 刻度线 8 -->
          <line x1="78%" y1="90%" x2="78%" y2="92%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="78%" y="96%" text-anchor="middle" class="text-xs fill-blue-500">8</text>
          
          <!-- 刻度线 10 -->
          <line x1="95%" y1="90%" x2="95%" y2="92%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="95%" y="96%" text-anchor="middle" class="text-xs fill-blue-500">10</text>
        </g>
        
        <!-- X轴刻度线 - 第一象限放大状态 (紧急度 5-10) -->
        <g v-if="activeQuadrant === 1">
          <!-- 刻度线 5 -->
          <line x1="5%" y1="90%" x2="5%" y2="92%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="5%" y="96%" text-anchor="middle" class="text-xs fill-blue-500">5</text>
          
          <!-- 刻度线 6 -->
          <line x1="23%" y1="90%" x2="23%" y2="92%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="23%" y="96%" text-anchor="middle" class="text-xs fill-blue-500">6</text>
          
          <!-- 刻度线 7 -->
          <line x1="41%" y1="90%" x2="41%" y2="92%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="41%" y="96%" text-anchor="middle" class="text-xs fill-blue-500">7</text>
          
          <!-- 刻度线 8 -->
          <line x1="59%" y1="90%" x2="59%" y2="92%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="59%" y="96%" text-anchor="middle" class="text-xs fill-blue-500">8</text>
          
          <!-- 刻度线 9 -->
          <line x1="77%" y1="90%" x2="77%" y2="92%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="77%" y="96%" text-anchor="middle" class="text-xs fill-blue-500">9</text>
          
          <!-- 刻度线 10 -->
          <line x1="95%" y1="90%" x2="95%" y2="92%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="95%" y="96%" text-anchor="middle" class="text-xs fill-blue-500">10</text>
        </g>
        
        <!-- X轴刻度线 - 第二象限放大状态 (紧急度 6-10) -->
        <g v-if="activeQuadrant === 2">
          <!-- 刻度线 6 -->
          <line x1="5%" y1="90%" x2="5%" y2="92%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="5%" y="96%" text-anchor="middle" class="text-xs fill-blue-500">6</text>
          
          <!-- 刻度线 7 -->
          <line x1="23%" y1="90%" x2="23%" y2="92%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="23%" y="96%" text-anchor="middle" class="text-xs fill-blue-500">7</text>
          
          <!-- 刻度线 8 -->
          <line x1="41%" y1="90%" x2="41%" y2="92%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="41%" y="96%" text-anchor="middle" class="text-xs fill-blue-500">8</text>
          
          <!-- 刻度线 9 -->
          <line x1="59%" y1="90%" x2="59%" y2="92%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="59%" y="96%" text-anchor="middle" class="text-xs fill-blue-500">9</text>
          
          <!-- 刻度线 10 -->
          <line x1="77%" y1="90%" x2="77%" y2="92%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="77%" y="96%" text-anchor="middle" class="text-xs fill-blue-500">10</text>
          
          <!-- 刻度线 紧急度上限 -->
          <line x1="95%" y1="90%" x2="95%" y2="92%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="95%" y="96%" text-anchor="middle" class="text-xs fill-blue-500">10+</text>
        </g>
        
        <!-- X轴刻度线 - 第三象限放大状态 (紧急度 1-5) -->
        <g v-if="activeQuadrant === 3">
          <!-- 刻度线 1 -->
          <line x1="5%" y1="90%" x2="5%" y2="92%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="5%" y="96%" text-anchor="middle" class="text-xs fill-blue-500">1</text>
          
          <!-- 刻度线 2 -->
          <line x1="23%" y1="90%" x2="23%" y2="92%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="23%" y="96%" text-anchor="middle" class="text-xs fill-blue-500">2</text>
          
          <!-- 刻度线 3 -->
          <line x1="41%" y1="90%" x2="41%" y2="92%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="41%" y="96%" text-anchor="middle" class="text-xs fill-blue-500">3</text>
          
          <!-- 刻度线 4 -->
          <line x1="59%" y1="90%" x2="59%" y2="92%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="59%" y="96%" text-anchor="middle" class="text-xs fill-blue-500">4</text>
          
          <!-- 刻度线 5 -->
          <line x1="77%" y1="90%" x2="77%" y2="92%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="77%" y="96%" text-anchor="middle" class="text-xs fill-blue-500">5</text>
          
          <!-- 刻度线 紧急度上限 -->
          <line x1="95%" y1="90%" x2="95%" y2="92%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="95%" y="96%" text-anchor="middle" class="text-xs fill-blue-500">5+</text>
        </g>
        
        <!-- X轴刻度线 - 第四象限放大状态 (紧急度 6-10) -->
        <g v-if="activeQuadrant === 4">
          <!-- 刻度线 6 -->
          <line x1="5%" y1="90%" x2="5%" y2="92%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="5%" y="96%" text-anchor="middle" class="text-xs fill-blue-500">6</text>
          
          <!-- 刻度线 7 -->
          <line x1="23%" y1="90%" x2="23%" y2="92%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="23%" y="96%" text-anchor="middle" class="text-xs fill-blue-500">7</text>
          
          <!-- 刻度线 8 -->
          <line x1="41%" y1="90%" x2="41%" y2="92%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="41%" y="96%" text-anchor="middle" class="text-xs fill-blue-500">8</text>
          
          <!-- 刻度线 9 -->
          <line x1="59%" y1="90%" x2="59%" y2="92%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="59%" y="96%" text-anchor="middle" class="text-xs fill-blue-500">9</text>
          
          <!-- 刻度线 10 -->
          <line x1="77%" y1="90%" x2="77%" y2="92%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="77%" y="96%" text-anchor="middle" class="text-xs fill-blue-500">10</text>
          
          <!-- 刻度线 紧急度上限 -->
          <line x1="95%" y1="90%" x2="95%" y2="92%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="95%" y="96%" text-anchor="middle" class="text-xs fill-blue-500">10+</text>
        </g>
        
        <!-- Y轴刻度线 - 默认状态 -->
        <g v-if="activeQuadrant === 0">
          <!-- 刻度线 1 -->
          <line x1="8%" y1="90%" x2="10%" y2="90%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="6%" y="90%" text-anchor="middle" dominant-baseline="middle" class="text-xs fill-blue-500">0</text>
          
          <!-- 刻度线 2 -->
          <line x1="8%" y1="73%" x2="10%" y2="73%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="6%" y="73%" text-anchor="middle" dominant-baseline="middle" class="text-xs fill-blue-500">2</text>
          
          <!-- 刻度线 5 -->
          <line x1="8%" y1="50%" x2="10%" y2="50%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="6%" y="50%" text-anchor="middle" dominant-baseline="middle" class="text-xs fill-blue-500">5</text>
          
          <!-- 刻度线 8 -->
          <line x1="8%" y1="22%" x2="10%" y2="22%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="6%" y="22%" text-anchor="middle" dominant-baseline="middle" class="text-xs fill-blue-500">8</text>
          
          <!-- 刻度线 10 -->
          <line x1="8%" y1="5%" x2="10%" y2="5%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="6%" y="5%" text-anchor="middle" dominant-baseline="middle" class="text-xs fill-blue-500">10</text>
        </g>
        
        <!-- Y轴刻度线 - 第一象限放大状态 (重要度 6-10) -->
        <g v-if="activeQuadrant === 1">
          <!-- 刻度线 6 -->
          <line x1="8%" y1="90%" x2="10%" y2="90%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="6%" y="90%" text-anchor="middle" dominant-baseline="middle" class="text-xs fill-blue-500">6</text>
          
          <!-- 刻度线 7 -->
          <line x1="8%" y1="73%" x2="10%" y2="73%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="6%" y="73%" text-anchor="middle" dominant-baseline="middle" class="text-xs fill-blue-500">7</text>
          
          <!-- 刻度线 8 -->
          <line x1="8%" y1="56%" x2="10%" y2="56%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="6%" y="56%" text-anchor="middle" dominant-baseline="middle" class="text-xs fill-blue-500">8</text>
          
          <!-- 刻度线 9 -->
          <line x1="8%" y1="39%" x2="10%" y2="39%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="6%" y="39%" text-anchor="middle" dominant-baseline="middle" class="text-xs fill-blue-500">9</text>
          
          <!-- 刻度线 10 -->
          <line x1="8%" y1="22%" x2="10%" y2="22%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="6%" y="22%" text-anchor="middle" dominant-baseline="middle" class="text-xs fill-blue-500">10</text>
          
          <!-- 刻度线 重要度上限 -->
          <line x1="8%" y1="5%" x2="10%" y2="5%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="6%" y="5%" text-anchor="middle" dominant-baseline="middle" class="text-xs fill-blue-500">10+</text>
        </g>
        
        <!-- Y轴刻度线 - 第二象限放大状态 (重要度 6-10) -->
        <g v-if="activeQuadrant === 2">
          <!-- 刻度线 6 -->
          <line x1="8%" y1="90%" x2="10%" y2="90%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="6%" y="90%" text-anchor="middle" dominant-baseline="middle" class="text-xs fill-blue-500">6</text>
          
          <!-- 刻度线 7 -->
          <line x1="8%" y1="73%" x2="10%" y2="73%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="6%" y="73%" text-anchor="middle" dominant-baseline="middle" class="text-xs fill-blue-500">7</text>
          
          <!-- 刻度线 8 -->
          <line x1="8%" y1="56%" x2="10%" y2="56%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="6%" y="56%" text-anchor="middle" dominant-baseline="middle" class="text-xs fill-blue-500">8</text>
          
          <!-- 刻度线 9 -->
          <line x1="8%" y1="39%" x2="10%" y2="39%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="6%" y="39%" text-anchor="middle" dominant-baseline="middle" class="text-xs fill-blue-500">9</text>
          
          <!-- 刻度线 10 -->
          <line x1="8%" y1="22%" x2="10%" y2="22%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="6%" y="22%" text-anchor="middle" dominant-baseline="middle" class="text-xs fill-blue-500">10</text>
          
          <!-- 刻度线 重要度上限 -->
          <line x1="8%" y1="5%" x2="10%" y2="5%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="6%" y="5%" text-anchor="middle" dominant-baseline="middle" class="text-xs fill-blue-500">10+</text>
        </g>
        
        <!-- Y轴刻度线 - 第三象限放大状态 (重要度 1-5) -->
        <g v-if="activeQuadrant === 3">
          <!-- 刻度线 1 -->
          <line x1="8%" y1="90%" x2="10%" y2="90%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="6%" y="90%" text-anchor="middle" dominant-baseline="middle" class="text-xs fill-blue-500">1</text>
          
          <!-- 刻度线 2 -->
          <line x1="8%" y1="73%" x2="10%" y2="73%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="6%" y="73%" text-anchor="middle" dominant-baseline="middle" class="text-xs fill-blue-500">2</text>
          
          <!-- 刻度线 3 -->
          <line x1="8%" y1="56%" x2="10%" y2="56%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="6%" y="56%" text-anchor="middle" dominant-baseline="middle" class="text-xs fill-blue-500">3</text>
          
          <!-- 刻度线 4 -->
          <line x1="8%" y1="39%" x2="10%" y2="39%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="6%" y="39%" text-anchor="middle" dominant-baseline="middle" class="text-xs fill-blue-500">4</text>
          
          <!-- 刻度线 5 -->
          <line x1="8%" y1="22%" x2="10%" y2="22%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="6%" y="22%" text-anchor="middle" dominant-baseline="middle" class="text-xs fill-blue-500">5</text>
          
          <!-- 刻度线 重要度上限 -->
          <line x1="8%" y1="5%" x2="10%" y2="5%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="6%" y="5%" text-anchor="middle" dominant-baseline="middle" class="text-xs fill-blue-500">5+</text>
        </g>
        
        <!-- Y轴刻度线 - 第四象限放大状态 (重要度 1-5) -->
        <g v-if="activeQuadrant === 4">
          <!-- 刻度线 1 -->
          <line x1="8%" y1="90%" x2="10%" y2="90%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="6%" y="90%" text-anchor="middle" dominant-baseline="middle" class="text-xs fill-blue-500">1</text>
          
          <!-- 刻度线 2 -->
          <line x1="8%" y1="73%" x2="10%" y2="73%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="6%" y="73%" text-anchor="middle" dominant-baseline="middle" class="text-xs fill-blue-500">2</text>
          
          <!-- 刻度线 3 -->
          <line x1="8%" y1="56%" x2="10%" y2="56%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="6%" y="56%" text-anchor="middle" dominant-baseline="middle" class="text-xs fill-blue-500">3</text>
          
          <!-- 刻度线 4 -->
          <line x1="8%" y1="39%" x2="10%" y2="39%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="6%" y="39%" text-anchor="middle" dominant-baseline="middle" class="text-xs fill-blue-500">4</text>
          
          <!-- 刻度线 5 -->
          <line x1="8%" y1="22%" x2="10%" y2="22%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="6%" y="22%" text-anchor="middle" dominant-baseline="middle" class="text-xs fill-blue-500">5</text>
          
          <!-- 刻度线 重要度上限 -->
          <line x1="8%" y1="5%" x2="10%" y2="5%" stroke="#3B82F6" stroke-width="1.5" />
          <text x="6%" y="5%" text-anchor="middle" dominant-baseline="middle" class="text-xs fill-blue-500">5+</text>
        </g>
        
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
      
      <!-- 任务点组 -->
      <div 
        v-for="group in taskGroups" 
        :key="`group-${group.x}-${group.y}`"
        class="absolute rounded-full shadow-md transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-700 hover:scale-125 z-10 animate-pop-in"
        :class="[
          group.tasks.length === 1 ? getTaskColor(group.tasks[0]) : 'bg-blue-500',
          activeQuadrant !== 0 ? 'scale-150 z-20 ring-2 ring-white' : 'scale-100'
        ]"
        :style="{
            left: group.x,
            top: group.y,
            width: activeQuadrant !== 0 ? '36px' : '24px',
            height: activeQuadrant !== 0 ? '36px' : '24px',
            'animation-delay': group.tasks[0].id * 100 + 'ms'
          }"
        @click="group.tasks.length === 1 ? editTask(group.tasks[0]) : showTaskList(group)"
         @mouseenter="handleGroupMouseEnter(group)"
         @mouseleave="handleGroupMouseLeave()"
      >
        <!-- 单个任务显示心情图标 -->
        <span v-if="group.tasks.length === 1" class="absolute top-0 left-0 w-full h-full flex items-center justify-center text-lg">
          {{ moodEmojis[group.tasks[0].mood] || moodEmojis.smile }}
        </span>
        <!-- 多个任务显示数量 -->
        <span v-else class="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs font-bold text-white">
          {{ group.tasks.length }}
        </span>
        <!-- 优先级指示器 -->
        <div 
          class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 rounded-full transition-all duration-700"
          :class="group.tasks.length === 1 ? getPriorityBarColor(group.tasks[0]) : 'bg-blue-300'"
          :style="{width: `${Math.max(20, group.tasks.length === 1 ? group.tasks[0].priority * 4 : 32)}px`}"
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
      
      <!-- 单任务信息提示框 -->
      <div 
        v-if="hoveredTask && (activeQuadrant === 0 || getTaskQuadrant(hoveredTask) === activeQuadrant)" 
        class="absolute z-30 bg-white rounded-md shadow-lg p-4 w-64 text-sm animate-fade-in border-l-4 transition-all duration-700"
        :class="getTaskBorderColor(hoveredTask)"
        :style="{
          left: getTooltipPositionX(hoveredTask),
          top: getTooltipPositionY(hoveredTask)
        }"
      >
        <div class="font-medium text-gray-900 text-base flex items-center">
          <span class="mr-2">{{ moodEmojis[hoveredTask.mood] || moodEmojis.smile }}</span>
          {{ hoveredTask.title }}
        </div>
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
      
      <!-- 多任务列表提示框 -->
      <div 
        v-if="hoveredTaskGroup" 
        class="absolute z-30 bg-white rounded-md shadow-lg p-4 w-72 text-sm animate-fade-in border-l-4 border-blue-500"
        :style="{
          left: hoveredTaskGroup.x,
          top: hoveredTaskGroup.y,
          transform: 'translate(20px, -50%)'
        }"
      >
        <div class="font-medium text-gray-900 text-base mb-3">
          此位置共有 {{ hoveredTaskGroup.tasks.length }} 个任务
        </div>
        <div class="max-h-48 overflow-y-auto space-y-2">
          <div 
            v-for="task in hoveredTaskGroup.tasks" 
            :key="task.id"
            class="p-2 bg-gray-50 rounded border-l-2 hover:bg-gray-100 cursor-pointer transition-colors"
            :class="getTaskBorderColor(task)"
            @click="editTask(task)"
          >
            <div class="font-medium text-gray-800 flex items-center">
              <span class="mr-2">{{ moodEmojis[task.mood] || moodEmojis.smile }}</span>
              {{ task.title }}
            </div>
            <div class="text-xs text-gray-600 mt-1 flex justify-between">
              <span>重要度: {{ task.importance }}</span>
              <span>紧急度: {{ task.urgency }}</span>
              <span>优先级: {{ task.priority.toFixed(1) }}</span>
            </div>
          </div>
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
const hoveredTaskGroup = ref(null);
const activeQuadrant = ref(0); // 0表示无活动象限，1-4表示四个象限
const hoverZoomEnabled = ref(false); // 控制鼠标悬停放大象限事件的开关

// 心情表情映射
const moodEmojis = {
  smile: '😊',
  sad: '😢', 
  struggle: '💪',
  shy: '😳',
  think: '🤔'
};

// 计算重叠任务组
const taskGroups = computed(() => {
  const groups = new Map();
  const currentTasks = activeQuadrant.value === 0 ? props.tasks : tasksInActiveQuadrant.value;
  
  currentTasks.forEach(task => {
    const x = getTaskPositionX(task);
    const y = getTaskPositionY(task);
    const key = `${x}-${y}`;
    
    if (!groups.has(key)) {
      groups.set(key, {
        x,
        y,
        tasks: [],
        position: { x, y }
      });
    }
    groups.get(key).tasks.push(task);
  });
  
  return Array.from(groups.values());
});

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

// 获取当前象限中的任务
const tasksInActiveQuadrant = computed(() => {
  if (activeQuadrant.value === 0) return [];
  return props.tasks.filter(task => getTaskQuadrant(task) === activeQuadrant.value);
});

// 获取任务所在象限
function getTaskQuadrant(task) {
  const importance = task.importance;
  const urgency = task.urgency;
  
  // 特殊处理坐标值为[5,5]的点，只在第一象限显示
  if (importance === 5 && urgency === 5) return 1; // [5,5]的点只在第一象限显示
  
  if (importance > 5 && urgency >= 5) return 1; // 重要紧急（第一象限，右上角）
  if (importance >= 5 && urgency < 5) return 2; // 重要不紧急（第二象限，左上角）
  if (importance < 5 && urgency < 5) return 3; // 不重要不紧急（第三象限，左下角）
  if (importance < 5 && urgency >= 5) return 4; // 不重要但紧急（第四象限，右下角）
  return 0; // 默认返回全局视图
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
  } else {
    // 放大视图下的位置
    const quadrant = getTaskQuadrant(task);
    
    // 确保只计算当前活动象限的任务位置
    if (quadrant !== activeQuadrant.value) {
      return '50%'; // 非当前象限的任务不应显示，但为防止错误，返回中心位置
    }
    
    // 在放大视图中，将任务点映射到更集中的可见区域（25%-75%）
    // 第一象限：横轴范围5-10
    // 第二象限：横轴范围0-5
    // 第三象限：横轴范围0-5
    // 第四象限：横轴范围5-10
    if (quadrant === 1) { // 第一象限（右上角）
      // 将urgency 5-10映射到25%-75%
      return `${25 + (task.urgency - 5) * (50 / 5)}%`;
    } else if (quadrant === 2) { // 第二象限（左上角）
      // 将urgency 0-5映射到25%-75%
      return `${25 + task.urgency * (50 / 5)}%`;
    } else if (quadrant === 3) { // 第三象限（左下角）
      // 将urgency 0-5映射到25%-75%
      return `${25 + task.urgency * (50 / 5)}%`;
    } else if (quadrant === 4) { // 第四象限（右下角）
      // 将urgency 5-10映射到25%-75%
      return `${25 + (task.urgency - 5) * (50 / 5)}%`;
    }
  }
  
  return `${50}%`; // 默认返回中心位置
}

// 获取任务Y坐标位置
function getTaskPositionY(task) {
  if (activeQuadrant.value === 0) {
    // 默认视图下的位置
    return `${90 - (task.importance - 1) * 8.5}%`;
  } else {
    // 放大视图下的位置
    const quadrant = getTaskQuadrant(task);
    
    // 确保只计算当前活动象限的任务位置
    if (quadrant !== activeQuadrant.value) {
      return '50%'; // 非当前象限的任务不应显示，但为防止错误，返回中心位置
    }
    
    // 在放大视图中，将任务点映射到更集中的可见区域（25%-75%）
    // 第一象限：纵轴范围5-10
    // 第二象限：纵轴范围5-10
    // 第三象限：纵轴范围0-5
    // 第四象限：纵轴范围0-5
    if (quadrant === 1 || quadrant === 2) { // 上方象限（重要）
      // 将importance 5-10映射到25%-75%
      return `${25 + (10 - task.importance) * (50 / 5)}%`;
    } else if (quadrant === 3 || quadrant === 4) { // 下方象限（不重要）
      // 将importance 0-5映射到25%-75%
      return `${25 + (5 - task.importance) * (50 / 5)}%`;
    }
  }
  
  return `${50}%`; // 默认返回中心位置
}


// 获取提示框X坐标位置
function getTooltipPositionX(task) {
  if (activeQuadrant.value === 0) {
    return `${Math.min(85, 10 + (task.urgency - 1) * 8.5)}%`;
  } else {
    // 放大视图下，提示框位置需要调整
    const quadrant = getTaskQuadrant(task);
    
    // 确保只计算当前活动象限的任务提示框位置
    if (quadrant !== activeQuadrant.value) {
      return '50%'; // 非当前象限的任务不应显示，但为防止错误，返回中心位置
    }
    
    if (quadrant === 1 || quadrant === 4) { // 右侧象限（紧急）
      // 将urgency 5-10映射到提示框位置
      const position = 25 + (task.urgency - 5) * (50 / 5);
      // 确保提示框不会超出边界
      return `${Math.min(70, position + 5)}%`;
    } else if (quadrant === 2 || quadrant === 3) { // 左侧象限（不紧急）
      // 将urgency 1-5映射到提示框位置
      const position = 25 + (task.urgency - 1) * (50 / 4);
      // 确保提示框不会超出边界
      return `${Math.min(70, position + 5)}%`;
    }
    return `50%`; // 默认返回中心位置
  }
}

// 获取提示框Y坐标位置
function getTooltipPositionY(task) {
  if (activeQuadrant.value === 0) {
    return `${Math.min(80, 90 - (task.importance - 1) * 8.5)}%`;
  } else {
    // 放大视图下，提示框位置需要调整
    const quadrant = getTaskQuadrant(task);
    
    // 确保只计算当前活动象限的任务提示框位置
    if (quadrant !== activeQuadrant.value) {
      return '50%'; // 非当前象限的任务不应显示，但为防止错误，返回中心位置
    }
    
    if (quadrant === 1 || quadrant === 2) { // 上方象限（重要）
      // 将importance 5-10映射到提示框位置
      const position = 25 + (10 - task.importance) * (50 / 5);
      // 确保提示框不会超出边界
      return `${Math.min(70, position + 5)}%`;
    } else if (quadrant === 3 || quadrant === 4) { // 下方象限（不重要）
      // 将importance 1-5映射到提示框位置
      const position = 25 + (5 - task.importance) * (50 / 4);
      // 确保提示框不会超出边界
      return `${Math.min(70, position + 5)}%`;
    }
    return `50%`; // 默认返回中心位置
  }
}

// 获取象限名称
function getQuadrantName(quadrant) {
  switch (quadrant) {
    case 1: return '重要紧急';
    case 2: return '重要不紧急';
    case 3: return '不重要但紧急';
    case 4: return '不重要不紧急';
    default: return '';
  }
}

// 处理任务组鼠标进入事件
function handleGroupMouseEnter(group) {
  if (group.tasks.length === 1) {
    hoveredTask.value = group.tasks[0];
    hoveredTaskGroup.value = null;
  } else {
    hoveredTask.value = null;
    hoveredTaskGroup.value = group;
  }
}

// 处理任务组鼠标离开事件
function handleGroupMouseLeave() {
  hoveredTask.value = null;
  hoveredTaskGroup.value = null;
}

// 显示任务列表（多任务点击时）
function showTaskList(group) {
  if (!props.editMode) return;
  // 可以显示一个任务选择对话框，这里暂时选择第一个任务
  if (group.tasks.length > 0) {
    emit('edit-task', group.tasks[0]);
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