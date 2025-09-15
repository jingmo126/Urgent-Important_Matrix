<template>
  <header
    class="fixed top-0 left-0 right-0 h-auto bg-white shadow-lg z-40 border-b-4 border-pink-200"
    :style="{ background: 'linear-gradient(135deg, #ffeef8 0%, #f0f9ff 50%, #fdf4ff 100%)' }"
  >
    <div class="container mx-auto py-4 px-6">
      <!-- 标题和导航区域 -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <!-- 可爱的标题区域 -->
        <div class="text-center md:text-left">
          <div class="text-2xl inline-block mr-2">🎯</div>
          <h1 class="text-xl font-bold text-purple-700 inline-block">目标坐标系</h1>
          <h2 class="text-lg font-medium text-pink-600">管理中心</h2>
        </div>

        <!-- 用户信息和注销按钮 -->
        <div v-if="isAuthenticated" class="flex items-center gap-4">
          <!-- 用户信息显示 -->
          <div v-if="userInfo" class="p-2 bg-white/60 rounded-2xl flex items-center">
            <div class="text-2xl mr-2">👋</div>
            <div>
              <p class="text-xs text-purple-600">欢迎回来</p>
              <p class="text-sm font-bold text-purple-700">{{ userInfo.username }}</p>
            </div>
          </div>
          
          <!-- 注销按钮 -->
          <button
            @click="handleLogout"
            class="flex items-center justify-center px-4 py-2 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-r from-pink-400/80 to-red-400/80 text-white"
          >
            <span class="mr-2 text-xl">🚪</span>
            <span class="font-medium">注销</span>
          </button>
        </div>
      </div>

      <!-- 可爱的菜单 - 水平排列 -->
      <nav class="mt-4">
        <ul class="flex justify-center flex-wrap gap-2">
          <li v-for="(item, index) in menuItems" :key="index">
            <router-link
              :to="item.path"
              class="flex items-center px-4 py-2 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
              :class="{
                'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-lg': route.path === item.path,
                'bg-white/50 text-purple-700 hover:bg-white/80': route.path !== item.path
              }"
            >
              <span class="mr-2 text-xl">
                {{ item.emoji }}
              </span>
              <span class="font-medium">{{ item.name }}</span>
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