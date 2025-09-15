<template>
  <header
    class="fixed top-0 left-0 right-0 h-auto bg-white shadow-lg z-40 border-b-2 border-pink-200 transition-all duration-300"
    :style="{ background: 'linear-gradient(135deg, #ffeef8 0%, #f0f9ff 50%, #fdf4ff 100%)' }"
  >
    <div class="container mx-auto py-2 px-4">
      <!-- 标题和导航区域 -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-2">
        <!-- 可爱的标题区域 - 移动端优化 -->
        <div class="text-center md:text-left">
          <div class="text-xl sm:text-2xl inline-block mr-1">🎯</div>
          <h1 class="text-base sm:text-xl font-bold text-purple-700 inline-block">目标坐标系</h1>
          <h2 class="text-xs sm:text-lg font-medium text-pink-600 hidden sm:inline">管理中心</h2>
        </div>

        <!-- 用户信息和注销按钮 - 移动端优化 -->
        <div v-if="isAuthenticated" class="flex items-center gap-2">
          <!-- 用户信息显示 -->
          <div v-if="userInfo" class="p-1 bg-white/60 rounded-xl flex items-center hidden sm:flex">
            <div class="text-xl mr-1">👋</div>
            <div>
              <p class="text-xs text-purple-600">欢迎</p>
              <p class="text-xs font-bold text-purple-700">{{ userInfo.username }}</p>
            </div>
          </div>
          
          <!-- 注销按钮 - 移动端更小 -->
          <button
            @click="handleLogout"
            class="flex items-center justify-center px-3 py-1 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-r from-pink-400/80 to-red-400/80 text-white"
          >
            <span class="mr-1 text-lg">🚪</span>
            <span class="font-medium text-xs sm:text-sm">注销</span>
          </button>
        </div>
      </div>

      <!-- 可爱的菜单 - 水平排列 - 移动端优化 -->
      <nav class="mt-2 mb-1">
        <ul class="flex justify-center flex-wrap gap-1">
          <li v-for="(item, index) in menuItems" :key="index">
            <router-link
              :to="item.path"
              class="flex items-center px-3 py-1.5 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
              :class="{
                'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-lg': route.path === item.path,
                'bg-white/50 text-purple-700 hover:bg-white/80': route.path !== item.path
              }"
            >
              <span class="mr-1 text-lg">
                {{ item.emoji }}
              </span>
              <span class="font-medium text-xs sm:text-sm">{{ item.name }}</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/store/authStore';

const route = useRoute();
const authStore = useAuthStore();

// 菜单项
const menuItems = [
  {
    name: '坐标系视图',
    path: '/',
    emoji: '📊',
  },
  {
    name: '行动列表',
    path: '/priority',
    emoji: '📝',
  },
  {
    name: '已完成任务',
    path: '/completed',
    emoji: '✅',
  },
];

// 检查用户是否已登录
const isAuthenticated = computed(() => authStore.isAuthenticated);

// 获取用户信息
const userInfo = computed(() => authStore.user);

// 处理注销
const handleLogout = () => {
  authStore.logout();
};
</script>