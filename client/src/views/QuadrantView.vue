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
import { useRouter } from 'vue-router';
import { useTaskStore } from '../store/taskStore';
import CoordinateSystem from '../components/CoordinateSystem.vue';
import GoalModal from '../components/GoalModal.vue';

const router = useRouter();
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
async function createGoal(goal) {
  // 设置默认值和计算优先级（使用与store中相同的加权算法）
  goal.importance = initialImportance.value;
  goal.urgency = initialUrgency.value;
  goal.priority = goal.importance * 0.4 + goal.urgency * 0.6;
  goal.marked = false;
  
  // 解析目标描述中的行动信息
  const description = goal.description || '';
  let actionsToCreate = [];
  let goalDescription = description;
  
  // 检查是否有*标记
  const starIndex = description.indexOf('*');
  
  if (starIndex !== -1) {
    // 提取目标描述（*之前的内容）
    goalDescription = description.substring(0, starIndex).trim();
    
    // 提取行动部分（*之后的内容）并去除所有换行符
    const actionsPart = description.substring(starIndex + 1).replace(/\n/g, '').trim();
    
    // 使用正则表达式匹配所有形如"标题(描述)"的模式
    const actionMatches = [...actionsPart.matchAll(/([^()]+?)\(([^()]+?)\)/g)];
    
    // 解析每个匹配的行动
    actionsToCreate = actionMatches.map(match => ({
      title: match[1].trim(),
      description: match[2].trim()
    })).filter(action => action.title); // 过滤掉空标题的行动
  }
  
  // 创建目标（使用处理后的描述）
  const goalData = {
    ...goal,
    description: goalDescription
  };
  
  const newGoal = await taskStore.addGoal(goalData);
  
  // 如果有需要创建的行动，为新目标创建行动
  if (actionsToCreate.length > 0) {
    for (const action of actionsToCreate) {
      await taskStore.addAction({
        ...action,
        goalId: newGoal.id
      });
    }
    
    notification.value = `目标创建成功，同时创建了${actionsToCreate.length}个行动`;
  } else {
    notification.value = '目标创建成功！';
  }
  
  showCreateModal.value = false;
  
  setTimeout(() => {
    notification.value = '';
  }, 3000);
}

// 进入ToDoList清单
function enterTodoList(goal) {
  // 跳转到ToDoList页面的目标特定行动列表
  router.push({
    path: '/actions',
    query: { goalId: goal.id }
  });
}
</script>