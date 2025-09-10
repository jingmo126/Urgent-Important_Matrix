<template>
  <aside
    class="fixed top-4 left-4 h-auto bg-white rounded-3xl shadow-2xl transition-all duration-500 z-40 border-4 border-pink-200"
    :class="{ 'w-72': isOpen, 'w-0 overflow-hidden': !isOpen }"
    :style="{ background: 'linear-gradient(135deg, #ffeef8 0%, #f0f9ff 50%, #fdf4ff 100%)' }"
  >
    <div 
      class="p-6 transition-all duration-500"
      :class="{
        'opacity-100 visible': isOpen,
        'opacity-0 invisible': !isOpen
      }"
    >
      <!-- 可爱的标题区域 -->
      <div class="text-center mb-6">
        <div class="text-2xl mb-2">🎯</div>
        <h1 class="text-xl font-bold text-purple-700 leading-tight">目标坐标系</h1>
        <h2 class="text-lg font-medium text-pink-600">管理中心</h2>
        <div class="w-16 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mx-auto mt-2"></div>
      </div>

      <!-- 可爱的菜单 -->
      <nav>
        <ul class="space-y-3">
          <li v-for="(item, index) in menuItems" :key="index">
            <router-link
              :to="item.path"
              class="flex items-center px-4 py-3 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
              :class="{
                'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-lg': $route.path === item.path,
                'bg-white/50 text-purple-700 hover:bg-white/80': $route.path !== item.path
              }"
            >
              <span class="mr-3 text-xl">
                {{ item.emoji }}
              </span>
              <span class="font-medium">{{ item.name }}</span>
            </router-link>
          </li>
        </ul>
      </nav>
      
      <!-- 可爱的装饰 -->
      <div class="mt-8 text-center">
        <div class="text-4xl mb-2">✨</div>
        <p class="text-sm text-purple-600 font-medium">让任务管理变得有趣！</p>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: true,
  },
});

defineEmits(['toggle']);

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
</script>