<template>
  <div class="min-h-screen flex bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50" style="font-family: '幼圆', 'Microsoft YaHei', sans-serif;">
    <!-- 左上角导航栏开关按钮 -->
    <button 
      @click="toggleSidebar"
      class="fixed top-4 left-4 z-50 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      :class="{ 'left-72': isSidebarOpen }"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" v-if="isSidebarOpen" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" v-else />
      </svg>
    </button>
    
    <!-- 侧边栏 -->
    <Sidebar :is-open="isSidebarOpen" @toggle="toggleSidebar" />
    
    <!-- 主内容区 -->
    <main class="flex-1 transition-all duration-300" :class="{ 'ml-80': isSidebarOpen, 'ml-0': !isSidebarOpen }">
      <div class="container mx-auto px-6 py-8 pt-20">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Sidebar from './components/Sidebar.vue';

const isSidebarOpen = ref(false);

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;600;700&display=swap');

/* 全局样式 */
* {
  font-family: '幼圆', 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
}

/* 可爱的滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #ff9a9e, #fecfef);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(45deg, #ff6b9d, #fda4ba);
}
</style>