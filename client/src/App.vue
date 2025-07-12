<template>
  <div class="min-h-screen flex">
    <!-- 侧边栏 -->
    <Sidebar :is-open="isSidebarOpen" @toggle="toggleSidebar" />
    
    <!-- 主内容区 -->
    <main class="flex-1 transition-all duration-300" :class="{ 'ml-64': isSidebarOpen, 'ml-16': !isSidebarOpen }">
      <div class="container mx-auto px-4 py-6">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Sidebar from './components/Sidebar.vue';

const isSidebarOpen = ref(true);

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
}
</script>