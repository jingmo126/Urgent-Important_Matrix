<template>
  <div>
    <div class="text-center mb-8">
      <div class="text-4xl mb-3">📝</div>
      <h1 class="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">任务优先级列表</h1>
      <p class="text-lg text-purple-600 font-medium">优先级管理，井井有条📋</p>
      <div class="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mx-auto mt-3"></div>
      <button @click="openAddTaskModal" class="mt-4 bg-gradient-to-r from-pink-400 to-purple-400 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-medium">
        ✨ 添加任务
      </button>
    </div>

    <div v-if="taskStore.loading" class="flex justify-center my-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="taskStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">
      {{ taskStore.error }}
    </div>

    <div v-else-if="taskStore.tasks.length === 0" class="text-center py-8 bg-gray-50 rounded-lg">
      <p class="text-gray-500">暂无任务，点击右上角添加新任务</p>
    </div>

    <div v-else class="space-y-4">
      <div class="bg-gradient-to-br from-white to-pink-50 shadow-2xl overflow-hidden rounded-3xl border-4 border-pink-200">
        <table class="min-w-full divide-y divide-pink-200">
          <thead class="bg-gradient-to-r from-pink-100 to-purple-100">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-bold text-purple-700 tracking-wider">
                📋 任务
              </th>
              <th class="px-6 py-4 text-left text-sm font-bold text-purple-700 tracking-wider">
                ⭐ 重要度
              </th>
              <th class="px-6 py-4 text-left text-sm font-bold text-purple-700 tracking-wider">
                🔥 紧急度
              </th>
              <th class="px-6 py-4 text-left text-sm font-bold text-purple-700 tracking-wider">
                📅 截止日期
              </th>
              <th class="px-6 py-4 text-left text-sm font-bold text-purple-700 tracking-wider">
                🎯 优先级
              </th>
              <th class="px-6 py-4 text-left text-sm font-bold text-purple-700 tracking-wider">
                ⚙️ 操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-gradient-to-br from-white to-pink-25 divide-y divide-pink-100">
            <tr v-for="task in taskStore.tasksByPriority" :key="task.id" class="hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-300">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-12 w-12">
                    <div class="h-12 w-12 rounded-full flex items-center justify-center text-xl shadow-lg border-2 border-white bg-gradient-to-br from-pink-200 to-purple-200">
                      📝
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-bold text-purple-800">
                      {{ task.title }}
                    </div>
                    <div v-if="task.description" class="text-sm text-purple-600 truncate max-w-xs">
                      {{ task.description }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="bg-gradient-to-r from-green-200 to-emerald-200 text-green-800 px-3 py-1 rounded-full text-sm font-bold shadow-md inline-block">
                  {{ task.priority.toFixed(1) }}
                </div>
                <PriorityBadge :value="task.priority" />
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="bg-gradient-to-r from-yellow-200 to-orange-200 text-orange-800 px-3 py-1 rounded-full text-sm font-bold shadow-md">
                    {{ task.importance }}/10
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="bg-gradient-to-r from-red-200 to-pink-200 text-red-800 px-3 py-1 rounded-full text-sm font-bold shadow-md">
                    {{ task.urgency }}/10
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="task.dueDate" class="text-sm">
                  <div class="bg-gradient-to-r from-blue-200 to-indigo-200 text-blue-800 px-3 py-1 rounded-full font-bold shadow-md inline-block">
                    {{ formatDate(task.dueDate) }}
                  </div>
                  <span v-if="getDaysRemaining(task.dueDate) <= 3" 
                    class="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-bold shadow-md" 
                    :class="getDaysRemaining(task.dueDate) <= 0 ? 'bg-gradient-to-r from-red-300 to-red-400 text-red-900' : 'bg-gradient-to-r from-yellow-300 to-yellow-400 text-yellow-900'"
                  >
                    {{ getDaysRemaining(task.dueDate) <= 0 ? '⚠️ 已过期' : `⏰ 剩余${getDaysRemaining(task.dueDate)}天` }}
                  </span>
                </div>
                <div v-else class="text-sm text-purple-500 font-medium">📅 无截止日期</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button @click="completeTask(task.id)" class="bg-gradient-to-r from-green-400 to-emerald-400 text-white px-3 py-1 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105 mr-2 text-xs font-bold">
                  ✅ 完成
                </button>
                <button @click="openEditTaskModal(task)" class="bg-gradient-to-r from-blue-400 to-indigo-400 text-white px-3 py-1 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105 mr-2 text-xs font-bold">
                  ✏️ 编辑
                </button>
                <button @click="confirmDelete(task.id)" class="bg-gradient-to-r from-red-400 to-pink-400 text-white px-3 py-1 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105 text-xs font-bold">
                  🗑️ 删除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 添加任务模态框 -->
    <TaskModal 
      v-if="showAddModal" 
      @close="showAddModal = false" 
      @save="addTask"
    />

    <!-- 编辑任务模态框 -->
    <TaskModal 
      v-if="showEditModal" 
      :task="selectedTask" 
      :is-edit="true" 
      @close="showEditModal = false" 
      @save="updateTask"
      @delete="deleteTask"
    />

    <!-- 删除确认对话框 -->
    <ConfirmDialog
      v-if="showDeleteConfirm"
      title="确认删除"
      message="确定要删除这个任务吗？此操作不可撤销。"
      confirm-text="删除"
      cancel-text="取消"
      @confirm="deleteTask(taskToDelete)"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useTaskStore } from '../store/taskStore';
import TaskModal from '../components/TaskModal.vue';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import PriorityBadge from '../components/PriorityBadge.vue';

const taskStore = useTaskStore();

// 模态框状态
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteConfirm = ref(false);
const selectedTask = ref(null);
const taskToDelete = ref(null);

// 加载任务数据
onMounted(() => {
  taskStore.fetchTasks();
});

// 打开添加任务模态框
function openAddTaskModal() {
  showAddModal.value = true;
}

// 打开编辑任务模态框
function openEditTaskModal(task) {
  selectedTask.value = { ...task };
  showEditModal.value = true;
}

// 确认删除
function confirmDelete(taskId) {
  taskToDelete.value = taskId;
  showDeleteConfirm.value = true;
}

// 添加任务
function addTask(task) {
  taskStore.addTask(task);
  showAddModal.value = false;
}

// 更新任务
function updateTask(task) {
  taskStore.updateTask(task);
  showEditModal.value = false;
}

// 删除任务
function deleteTask(taskId) {
  taskStore.deleteTask(taskId);
  showDeleteConfirm.value = false;
}

// 完成任务
function completeTask(taskId) {
  taskStore.completeTask(taskId);
}

// 格式化日期
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

// 计算剩余天数
function getDaysRemaining(dateString) {
  const dueDate = new Date(dateString);
  const today = new Date();
  
  // 重置时间部分以便准确计算天数差异
  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const diffTime = dueDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}
</script>