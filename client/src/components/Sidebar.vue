<template>
  <aside
    class="fixed top-0 left-0 h-full bg-gray-800 text-white transition-all duration-300 z-10"
    :class="{ 'w-64': isOpen, 'w-16': !isOpen }"
  >
    <div class="flex items-center justify-between h-16 px-4 border-b border-gray-700">
      <h1 class="text-xl font-bold truncate" v-show="isOpen">任务坐标系管理</h1>
      <button @click="$emit('toggle')" class="p-2 rounded-md hover:bg-gray-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h7"
            v-if="isOpen"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
            v-else
          />
        </svg>
      </button>
    </div>

    <nav class="mt-4">
      <ul>
        <li v-for="(item, index) in menuItems" :key="index">
          <router-link
            :to="item.path"
            class="flex items-center px-4 py-3 hover:bg-gray-700"
            :class="{ 'justify-center': !isOpen }"
          >
            <span class="mr-3" :class="{ 'mr-0': !isOpen }">
              <component :is="item.icon" class="h-6 w-6" />
            </span>
            <span v-show="isOpen">{{ item.name }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
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

// 菜单图标组件
const QuadrantIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
  `,
};

const PriorityIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  `,
};

// 菜单项
const menuItems = [
  {
    name: '坐标系视图',
    path: '/',
    icon: QuadrantIcon,
  },
  {
    name: '优先级列表',
    path: '/priority',
    icon: PriorityIcon,
  },
];
</script>