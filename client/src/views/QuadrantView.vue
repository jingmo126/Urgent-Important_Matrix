<template>
  <div>
    <!-- 通知提示 -->
    <div v-if="notification" class="fixed top-4 right-4 z-50 bg-white shadow-lg rounded-lg p-4 border-l-4 border-green-500 max-w-sm animate-slide-in-right">
      <div class="flex items-start">
        <div class="text-green-500 mr-3 mt-0.5">✓</div>
        <div>
          <p class="text-gray-800 font-medium">{{ notification }}</p>
        </div>
        <button @click="notification = ''" class="ml-2 text-gray-400 hover:text-gray-600">×</button>
      </div>
    </div>
    <div class="text-center mb-8">
      <div class="text-4xl mb-3">🎯</div>
      <h1 class="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">目标坐标系管理</h1>
      <p class="text-lg text-purple-600 font-medium">让每个目标都清晰可见🎯</p>
      <div class="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mx-auto mt-3"></div>
    </div>

    <div v-if="taskStore.loading" class="flex justify-center my-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="taskStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">
      {{ taskStore.error }}
    </div>

    <div v-else class="h-[calc(100vh-12rem)]">
      <!-- 坐标系目标展示 -->
      <CoordinateSystem 
        :goals="taskStore.goals" 
        @enter-todo-list="enterTodoList"
        @create-goal="openCreateGoalModal"
      />
    </div>

    <!-- 创建目标模态框 -->
    <GoalModal 
      v-if="showCreateModal" 
      :initial-importance="initialImportance"
      :initial-urgency="initialUrgency"
      @close="showCreateModal = false"
      @save="createGoal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useTaskStore } from '../store/taskStore';
import CoordinateSystem from '../components/CoordinateSystem.vue';
import GoalModal from '../components/GoalModal.vue';

const taskStore = useTaskStore();

// 模态框状态
const showCreateModal = ref(false);
const initialImportance = ref(5);
const initialUrgency = ref(5);

// 通知消息
const notification = ref('');

// 加载目标数据
onMounted(() => {
  taskStore.fetchGoals();
});

// 打开创建目标模态框
function openCreateGoalModal(position) {
  initialImportance.value = position?.importance || 5;
  initialUrgency.value = position?.urgency || 5;
  showCreateModal.value = true;
}

// 创建目标
function createGoal(goal) {
  // 设置默认值和计算优先级
  goal.importance = initialImportance.value;
  goal.urgency = initialUrgency.value;
  goal.priority = (goal.importance + goal.urgency) / 2;
  goal.marked = false;
  
  taskStore.addGoal(goal);
  showCreateModal.value = false;
  
  // 显示成功通知
  notification.value = '目标创建成功！';
  setTimeout(() => {
    notification.value = '';
  }, 3000);
}

// 进入ToDoList清单
function enterTodoList(goal) {
  // 跳转到ToDoList页面，这里通过Vue Router实现
  // 暂时使用简单的提示来演示功能
  notification.value = `进入"${goal.title}"的ToDoList清单`;
  setTimeout(() => {
    notification.value = '';
  }, 3000);
}
</script>