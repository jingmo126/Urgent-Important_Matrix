<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-scale-in">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-800">创建新目标</h2>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <form @submit.prevent="saveGoal">
        <div class="mb-4">
          <label for="goal-title" class="block text-gray-700 font-medium mb-2">目标名称</label>
          <input
            id="goal-title"
            v-model="goalForm.title"
            type="text"
            placeholder="请输入目标名称"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>
        
        <div class="mb-6">
          <label for="goal-description" class="block text-gray-700 font-medium mb-2">目标描述</label>
          <textarea
            id="goal-description"
            v-model="goalForm.description"
            placeholder="请输入目标描述（选填）"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          ></textarea>
        </div>
        
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
          >
            创建目标
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  initialImportance: {
    type: Number,
    default: 5
  },
  initialUrgency: {
    type: Number,
    default: 5
  }
});

const emit = defineEmits(['save', 'close']);

// 目标表单数据
const goalForm = ref({
  title: '',
  description: ''
});

// 保存目标
function saveGoal() {
  emit('save', { ...goalForm.value });
}

// 关闭模态框
function closeModal() {
  emit('close');
}
</script>

<style>
/* 动画效果 */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scaleIn 0.2s ease-out;
}

/* 自定义滚动条 */
textarea::-webkit-scrollbar {
  width: 6px;
}

textarea::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

textarea::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>