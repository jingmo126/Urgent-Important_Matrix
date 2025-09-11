<template>
  <div>
    <div class="text-center mb-8">
      <div class="text-4xl mb-3">✅</div>
      <h1 class="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mb-2">已完成任务</h1>
      <p class="text-lg text-green-600 font-medium">恭喜你完成了这些任务！🎉</p>
      <div class="w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mx-auto mt-3"></div>
    </div>

    <div v-if="taskStore.loading" class="flex justify-center my-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>

    <div v-else-if="completedTasks.length === 0" class="text-center py-12">
      <div class="text-6xl mb-4">🎯</div>
      <p class="text-xl text-gray-600 font-medium">还没有完成的任务</p>
      <p class="text-gray-500 mt-2">继续努力，完成更多任务吧！</p>
    </div>

    <div v-else class="space-y-4">
      <div class="bg-gradient-to-br from-white to-green-50 shadow-2xl overflow-hidden rounded-3xl border-4 border-green-200">
        <table class="min-w-full divide-y divide-green-200">
          <thead class="bg-gradient-to-r from-green-100 to-emerald-100">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-bold text-green-700 tracking-wider">
                📋 性质
              </th>
              <th class="px-6 py-4 text-left text-sm font-bold text-green-700 tracking-wider">
                🏷️ 名称
              </th>
              <th class="px-6 py-4 text-left text-sm font-bold text-green-700 tracking-wider">
                💬 描述
              </th>
              <th class="px-6 py-4 text-left text-sm font-bold text-green-700 tracking-wider">
                📅 完成日期
              </th>
              <th class="px-6 py-4 text-left text-sm font-bold text-green-700 tracking-wider">
                ⚙️ 操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-gradient-to-br from-white to-green-25 divide-y divide-green-100">
            <tr v-for="task in completedTasks" :key="task.id" class="hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full flex items-center justify-center text-lg shadow-md border-2 border-white bg-gradient-to-br from-blue-200 to-purple-200">
                      {{ task.goalId ? '📝' : '🎯' }}
                    </div>
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-bold text-green-800">
                      {{ task.goalId ? '行动' : '目标' }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-bold text-green-800 line-through">
                  {{ task.title || '无标题任务' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="task.description" class="text-sm text-green-600 truncate max-w-xs">
                  {{ task.description }}
                </div>
                <div v-else class="text-sm text-gray-400">-</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="bg-gradient-to-r from-green-200 to-emerald-200 text-green-800 px-3 py-1 rounded-full font-bold shadow-md inline-block">
                  {{ formatDate(task.completedAt) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button @click="restoreTask(task.id)" class="bg-gradient-to-r from-blue-400 to-indigo-400 text-white px-3 py-1 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105 mr-2 text-xs font-bold">
                  🔄 恢复
                </button>
                <button @click="permanentlyDeleteTask(task.id)" class="bg-gradient-to-r from-red-400 to-pink-400 text-white px-3 py-1 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105 text-xs font-bold">
                  🗑️ 永久删除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useTaskStore } from '../store/taskStore';

const taskStore = useTaskStore();

// 获取已完成的任务
const completedTasks = computed(() => {
  return taskStore.completedTasks || [];
});

// 组件挂载时加载已完成任务数据
onMounted(() => {
  loadCompletedTasks();
});

async function loadCompletedTasks() {
  try {
    await taskStore.fetchCompletedTasks();
  } catch (error) {
    console.error('加载已完成任务失败:', error);
  }
}

// 格式化日期
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

// 恢复任务
function restoreTask(taskId) {
  taskStore.restoreTask(taskId);
}

// 永久删除任务
function permanentlyDeleteTask(taskId) {
  if (confirm('确定要永久删除这个任务吗？此操作不可撤销。')) {
    taskStore.permanentlyDeleteTask(taskId);
  }
}
</script>