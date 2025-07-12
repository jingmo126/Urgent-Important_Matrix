<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">任务优先级列表</h1>
      <button @click="openAddTaskModal" class="btn btn-primary">
        添加任务
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
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                任务名称
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                优先级
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                重要度
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                紧急度
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                截止日期
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="task in taskStore.tasksByPriority" :key="task.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ task.title }}
                    </div>
                    <div v-if="task.description" class="text-sm text-gray-500 truncate max-w-xs">
                      {{ task.description }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 font-medium">
                  {{ task.priority.toFixed(1) }}
                </div>
                <PriorityBadge :value="task.priority" />
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ task.importance }}/10
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ task.urgency }}/10
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="task.dueDate" class="text-sm text-gray-900">
                  {{ formatDate(task.dueDate) }}
                  <span v-if="getDaysRemaining(task.dueDate) <= 3" 
                    class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" 
                    :class="getDaysRemaining(task.dueDate) <= 0 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'"
                  >
                    {{ getDaysRemaining(task.dueDate) <= 0 ? '已过期' : `剩余${getDaysRemaining(task.dueDate)}天` }}
                  </span>
                </div>
                <div v-else class="text-sm text-gray-500">无截止日期</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button @click="openEditTaskModal(task)" class="text-primary hover:text-blue-700 mr-3">
                  编辑
                </button>
                <button @click="confirmDelete(task.id)" class="text-danger hover:text-red-700">
                  删除
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