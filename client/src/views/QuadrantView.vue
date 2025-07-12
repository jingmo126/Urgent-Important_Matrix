<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">任务坐标系管理</h1>
      <div class="flex space-x-2">
        <button 
          @click="toggleEditMode" 
          class="btn" 
          :class="{ 'btn-primary': taskStore.editMode, 'btn-secondary': !taskStore.editMode }"
        >
          {{ taskStore.editMode ? '编辑模式' : '展示模式' }}
        </button>
        <button 
          v-if="!usePresetTasks" 
          @click="loadPresetTasks" 
          class="btn btn-secondary"
        >
          加载预设任务
        </button>
      </div>
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
        :edit-mode="taskStore.editMode"
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
import { presetTasks } from '../data/presetTasks';

const taskStore = useTaskStore();

// 模态框状态
const showAddModal = ref(false);
const showEditModal = ref(false);
const selectedTask = ref(null);
const usePresetTasks = ref(false);

// 加载任务数据
onMounted(() => {
  taskStore.fetchTasks();
});

// 切换编辑模式
function toggleEditMode() {
  taskStore.toggleEditMode();
}

// 加载预设任务
async function loadPresetTasks() {
  // 清空现有任务
  for (const task of taskStore.tasks) {
    await taskStore.deleteTask(task.id);
  }
  
  // 添加预设任务
  for (const task of presetTasks) {
    await taskStore.addTask(task);
  }
  
  usePresetTasks.value = true;
}

// 打开添加任务模态框
function openAddTaskModal() {
  if (!taskStore.editMode) return;
  
  showAddModal.value = true;
}

// 打开编辑任务模态框
function openEditTaskModal(task) {
  if (!taskStore.editMode) return;
  
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