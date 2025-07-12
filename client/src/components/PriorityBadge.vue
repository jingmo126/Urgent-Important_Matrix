<template>
  <div class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="badgeClass">
    {{ priorityLabel }}
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  value: {
    type: Number,
    required: true
  }
});

// 根据优先级值计算标签文本
const priorityLabel = computed(() => {
  const value = props.value;
  if (value >= 8) return '最高';
  if (value >= 6) return '高';
  if (value >= 4) return '中';
  if (value >= 2) return '低';
  return '最低';
});

// 根据优先级值计算样式类
const badgeClass = computed(() => {
  const value = props.value;
  if (value >= 8) return 'bg-red-100 text-red-800';
  if (value >= 6) return 'bg-orange-100 text-orange-800';
  if (value >= 4) return 'bg-yellow-100 text-yellow-800';
  if (value >= 2) return 'bg-blue-100 text-blue-800';
  return 'bg-gray-100 text-gray-800';
});
</script>