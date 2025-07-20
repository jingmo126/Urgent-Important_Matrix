<template>
  <div>
    <div class="text-center mb-8">
      <div class="text-4xl mb-3">🌟</div>
      <h1 class="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">任务坐标系管理</h1>
      <p class="text-lg text-purple-600 font-medium">让每个任务都闪闪发光✨</p>
      <div class="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mx-auto mt-3"></div>
    </div>

    <div v-if="taskStore.loading" class="flex justify-center my-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="taskStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">
      {{ taskStore.error }}
    </div>

    <div v-else class="h-[calc(100vh-12rem)]">
      <!-- 坐标系任务展示 -->
      <CoordinateSystem 
        :tasks="taskStore.tasks" 
        @edit-task="openEditTaskModal"
        @add-task="openAddTaskModal()"
      />
    </div>

    <!-- 添加任务模态框 -->
    <TaskModal 
      v-if="showAddModal" 
      :quadrant="selectedQuadrant" 
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useTaskStore } from '../store/taskStore';
import TaskModal from '../components/TaskModal.vue';
import CoordinateSystem from '../components/CoordinateSystem.vue';

const taskStore = useTaskStore();

// 模态框状态
const showAddModal = ref(false);
const showEditModal = ref(false);
const selectedTask = ref(null);

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

// 添加任务
function addTask(task) {
  // 设置默认值
  task.importance = task.importance || 5;
  task.urgency = task.urgency || 5;
  
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
  showEditModal.value = false;
}
</script>