<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-8">
    <!-- 标题区域 -->
    <div class="max-w-6xl mx-auto mb-8 text-center">
      <h1 class="text-3xl md:text-4xl font-bold text-purple-700 mb-2">行动列表</h1>
      <p class="text-lg text-pink-600">管理您的目标和行动</p>
    </div>

    <!-- 筛选区域 -->
    <div class="max-w-6xl mx-auto mb-8 bg-white rounded-2xl shadow-xl p-6 border-2 border-pink-200">
      <div class="flex flex-wrap gap-4 items-center justify-between">
        <div class="flex items-center gap-6">
          <label class="inline-flex items-center cursor-pointer">
            <input type="radio" name="filter" value="goals" v-model="filter" class="sr-only peer"/>
            <div class="relative w-10 h-10 flex items-center justify-center rounded-full peer peer-checked:bg-pink-100 peer-checked:border-pink-500 border-2 border-purple-200 transition-all">
              <span class="text-xl">🎯</span>
            </div>
            <span class="ml-2 font-medium text-purple-700">仅目标</span>
          </label>
          <label class="inline-flex items-center cursor-pointer">
            <input type="radio" name="filter" value="actions" v-model="filter" class="sr-only peer"/>
            <div class="relative w-10 h-10 flex items-center justify-center rounded-full peer peer-checked:bg-pink-100 peer-checked:border-pink-500 border-2 border-purple-200 transition-all">
              <span class="text-xl">📝</span>
            </div>
            <span class="ml-2 font-medium text-purple-700">仅行动</span>
          </label>
          <label class="inline-flex items-center cursor-pointer">
            <input type="radio" name="filter" value="all" v-model="filter" class="sr-only peer"/>
            <div class="relative w-10 h-10 flex items-center justify-center rounded-full peer peer-checked:bg-pink-100 peer-checked:border-pink-500 border-2 border-purple-200 transition-all">
              <span class="text-xl">🌟</span>
            </div>
            <span class="ml-2 font-medium text-purple-700">全部</span>
          </label>
        </div>
        <div class="flex items-center gap-4">
          <button 
            @click="toggleSelectAll" 
            class="px-4 py-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-medium hover:shadow-lg transition-all flex items-center gap-2"
          >
            {{ isSelectAll ? '取消全选' : '全选' }}
          </button>
          <button 
            @click="deleteSelected" 
            class="px-4 py-2 rounded-full bg-red-100 text-red-600 font-medium hover:bg-red-200 transition-all flex items-center gap-2"
            :disabled="selectedCount === 0"
          >
            🗑️ 删除选中
          </button>
        </div>
      </div>
    </div>

    <!-- 列表区域 -->
    <div class="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6 border-2 border-pink-200 overflow-x-auto">
      <!-- 仅目标视图 -->
      <div v-if="filter === 'goals'">
        <table class="min-w-full">
          <thead>
            <tr class="bg-gradient-to-r from-pink-100 to-purple-100 text-left">
              <th class="px-6 py-4 rounded-tl-2xl">
                <input type="checkbox" v-model="isSelectAll" @change="toggleSelectAll" class="w-5 h-5 rounded-full border-2 border-purple-400 text-purple-600 focus:ring-purple-500"/>
              </th>
              <th class="px-6 py-4 font-bold text-purple-700">目标</th>
              <th class="px-6 py-4 font-bold text-purple-700">描述</th>
              <th class="px-6 py-4 font-bold text-purple-700">重要度</th>
              <th class="px-6 py-4 font-bold text-purple-700">紧急度</th>
              <th class="px-6 py-4 font-bold text-purple-700 rounded-tr-2xl">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="goal in filteredGoals" 
              :key="goal.id"
              class="border-b border-pink-100 hover:bg-pink-50 transition-all"
              :class="{ 'line-through text-gray-400': goal.completed }"
            >
              <td class="px-6 py-4">
                <input type="checkbox" v-model="selectedIds" :value="goal.id" class="w-5 h-5 rounded-full border-2 border-purple-400 text-purple-600 focus:ring-purple-500"/>
              </td>
              <td class="px-6 py-4 font-medium text-purple-900">{{ goal.title }}</td>
              <td class="px-6 py-4 text-gray-600">{{ goal.description || '-' }}</td>
              <td class="px-6 py-4">
                <div class="w-16 h-8 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 font-medium">
                  {{ goal.importance }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="w-16 h-8 rounded-full bg-gradient-to-r from-orange-100 to-orange-200 flex items-center justify-center text-orange-600 font-medium">
                  {{ goal.urgency }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button 
                    @click="enterGoalActions(goal)" 
                    class="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-all"
                    title="查看行动列表"
                  >
                    📋
                  </button>
                  <button 
                    @click="deleteGoal(goal)" 
                    class="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-all"
                    title="删除目标"
                  >
                    🗑️
                  </button>
                  <button 
                    @click="toggleGoalMark(goal)" 
                    class="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-all"
                    :title="goal.marked ? '取消标记' : '标记目标'"
                  >
                    {{ goal.marked ? '⭐' : '☆' }}
                  </button>
                  <button 
                    @click="completeGoal(goal)" 
                    class="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all"
                    :title="goal.completed ? '取消完成' : '完成目标'"
                  >
                    {{ goal.completed ? '↩️' : '✅' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="filteredGoals.length === 0" class="py-10 text-center text-gray-500">暂无目标数据</div>
      </div>

      <!-- 仅行动视图 -->
      <div v-else-if="filter === 'actions'">
        <table class="min-w-full">
          <thead>
            <tr class="bg-gradient-to-r from-pink-100 to-purple-100 text-left">
              <th class="px-6 py-4 rounded-tl-2xl">
                <input type="checkbox" v-model="isSelectAll" @change="toggleSelectAll" class="w-5 h-5 rounded-full border-2 border-purple-400 text-purple-600 focus:ring-purple-500"/>
              </th>
              <th class="px-6 py-4 font-bold text-purple-700">行动</th>
              <th class="px-6 py-4 font-bold text-purple-700">描述</th>
              <th class="px-6 py-4 font-bold text-purple-700">所属目标</th>
              <th class="px-6 py-4 font-bold text-purple-700 rounded-tr-2xl">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="action in filteredActions" 
              :key="action.id"
              class="border-b border-pink-100 hover:bg-pink-50 transition-all"
              :class="{ 'line-through text-gray-400': action.completed }"
            >
              <td class="px-6 py-4">
                <input type="checkbox" v-model="selectedIds" :value="action.id" class="w-5 h-5 rounded-full border-2 border-purple-400 text-purple-600 focus:ring-purple-500"/>
              </td>
              <td class="px-6 py-4 font-medium text-purple-900">{{ action.title }}</td>
              <td class="px-6 py-4 text-gray-600">{{ action.description || '-' }}</td>
              <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full bg-pink-100 text-pink-600 text-sm">{{ action.goalTitle || '无' }}</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button 
                    @click="deleteAction(action)" 
                    class="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-all"
                    title="删除行动"
                  >
                    🗑️
                  </button>
                  <button 
                    @click="toggleActionMark(action)" 
                    class="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-all"
                    :title="action.marked ? '取消标记' : '标记行动'"
                  >
                    {{ action.marked ? '⭐' : '☆' }}
                  </button>
                  <button 
                    @click="completeAction(action)" 
                    class="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all"
                    :title="action.completed ? '取消完成' : '完成行动'"
                  >
                    {{ action.completed ? '↩️' : '✅' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="filteredActions.length === 0" class="py-10 text-center text-gray-500">暂无行动数据</div>
      </div>

      <!-- 全部视图 -->
      <div v-else-if="filter === 'all'">
        <table class="min-w-full">
          <thead>
            <tr class="bg-gradient-to-r from-pink-100 to-purple-100 text-left">
              <th class="px-6 py-4 font-bold text-purple-700">名称</th>
              <th class="px-6 py-4 font-bold text-purple-700">描述</th>
              <th class="px-6 py-4 font-bold text-purple-700">重要度</th>
              <th class="px-6 py-4 font-bold text-purple-700">紧急度</th>
              <th class="px-6 py-4 font-bold text-purple-700">所属目标</th>
              <th class="px-6 py-4 font-bold text-purple-700">操作</th>
            </tr>
          </thead>
          <tbody>
            <!-- 目标行 -->
            <template v-for="goal in goalsWithActions" :key="goal.id">
              <tr 
                class="border-b border-purple-200 hover:bg-purple-50 transition-all"
                :class="{ 'line-through text-gray-400': goal.completed }"
              >
                <td class="px-6 py-5 font-bold text-xl text-purple-800">🎯 {{ goal.title }}</td>
                <td class="px-6 py-5 text-gray-600">{{ goal.description || '-' }}</td>
                <td class="px-6 py-5">
                  <div class="w-16 h-8 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 font-medium">
                    {{ goal.importance }}
                  </div>
                </td>
                <td class="px-6 py-5">
                  <div class="w-16 h-8 rounded-full bg-gradient-to-r from-orange-100 to-orange-200 flex items-center justify-center text-orange-600 font-medium">
                    {{ goal.urgency }}
                  </div>
                </td>
                <td class="px-6 py-5">-</td>
                <td class="px-6 py-5">
                  <div class="flex items-center gap-2">
                    <button 
                      @click="toggleGoalExpand(goal.id)" 
                      class="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-all"
                      title="展开/收起行动"
                    >
                      {{ expandedGoals.includes(goal.id) ? '▼' : '▶' }}
                    </button>
                    <button 
                      @click="deleteGoal(goal)" 
                      class="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-all"
                      title="删除目标"
                    >
                      🗑️
                    </button>
                    <button 
                      @click="toggleGoalMark(goal)" 
                      class="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-all"
                      :title="goal.marked ? '取消标记' : '标记目标'"
                    >
                      {{ goal.marked ? '⭐' : '☆' }}
                    </button>
                    <button 
                      @click="completeGoal(goal)" 
                      class="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all"
                      :title="goal.completed ? '取消完成' : '完成目标'"
                    >
                      {{ goal.completed ? '↩️' : '✅' }}
                    </button>
                  </div>
                </td>
              </tr>
              <!-- 展开的行动 -->
              <template v-if="expandedGoals.includes(goal.id)">
                <tr 
                  v-for="action in goal.actions" 
                  :key="action.id"
                  class="border-b border-pink-100 bg-pink-50/50 hover:bg-pink-50 transition-all"
                  :class="{ 'line-through text-gray-400': action.completed }"
                >
                  <td class="px-6 pl-16 py-3 font-medium text-purple-700">📝 {{ action.title }}</td>
                  <td class="px-6 py-3 text-gray-600">{{ action.description || '-' }}</td>
                  <td class="px-6 py-3"></td>
                  <td class="px-6 py-3"></td>
                  <td class="px-6 py-3">
                    <span class="px-3 py-1 rounded-full bg-pink-100 text-pink-600 text-sm">{{ goal.title }}</span>
                  </td>
                  <td class="px-6 py-3">
                    <div class="flex items-center gap-2">
                      <button 
                        @click="deleteAction(action)" 
                        class="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-all"
                        title="删除行动"
                      >
                        🗑️
                      </button>
                      <button 
                        @click="toggleActionMark(action)" 
                        class="p-1.5 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-all"
                        :title="action.marked ? '取消标记' : '标记行动'"
                      >
                        {{ action.marked ? '⭐' : '☆' }}
                      </button>
                      <button 
                        @click="completeAction(action)" 
                        class="p-1.5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all"
                        :title="action.completed ? '取消完成' : '完成行动'"
                      >
                        {{ action.completed ? '↩️' : '✅' }}
                      </button>
                    </div>
                  </td>
                </tr>
              </template>
            </template>
          </tbody>
        </table>
        <div v-if="goalsWithActions.length === 0" class="py-10 text-center text-gray-500">暂无数据</div>
      </div>
    </div>

    <!-- 通知区域 -->
    <div v-if="notification" class="fixed bottom-4 right-4 bg-white rounded-2xl shadow-xl p-4 border-2 border-pink-300 max-w-md animate-fadeIn">
      <p class="text-purple-700 font-medium">{{ notification }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useTaskStore } from '../store/taskStore';

const router = useRouter();
const route = useRoute();
const taskStore = useTaskStore();

// 状态
const filter = ref('all'); // 'goals', 'actions', 'all'
const notification = ref('');
const selectedIds = ref([]);
const isSelectAll = ref(false);
const expandedGoals = ref([]);
const currentGoal = ref(null);

// 计算属性
const goals = computed(() => taskStore.goals);
const actions = computed(() => taskStore.actions);
const filteredGoals = computed(() => goals.value.filter(goal => !goal.completed));
const filteredActions = computed(() => actions.value.filter(action => !action.completed));
const selectedCount = computed(() => selectedIds.value.length);

// 目标与行动组合数据
const goalsWithActions = computed(() => {
  return goals.value.map(goal => ({
    ...goal,
    actions: actions.value.filter(action => action.goalId === goal.id && !action.completed)
  })).filter(goal => !goal.completed);
});

// 生命周期
onMounted(() => {
  loadData();
  // 检查URL参数是否包含目标ID
  const goalId = route.query.goalId;
  if (goalId) {
    currentGoal.value = parseInt(goalId);
    filter.value = 'actions';
    // 滚动到相应位置
    setTimeout(() => {
      const element = document.querySelector(`[data-goal-id="${goalId}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 500);
  }
});

// 加载数据
async function loadData() {
  try {
    await taskStore.fetchGoals();
    await taskStore.fetchActions();
  } catch (error) {
    notification.value = '数据加载失败，请稍后再试';
    setTimeout(() => notification.value = '', 3000);
  }
}

// 切换全选
function toggleSelectAll() {
  if (filter.value === 'goals') {
    selectedIds.value = isSelectAll.value ? filteredGoals.value.map(g => g.id) : [];
  } else if (filter.value === 'actions') {
    selectedIds.value = isSelectAll.value ? filteredActions.value.map(a => a.id) : [];
  }
}

// 删除选中项
async function deleteSelected() {
  if (selectedIds.value.length === 0) return;
  
  const confirmMsg = filter.value === 'goals' 
    ? '确定要删除选中的目标吗？' 
    : '确定要删除选中的行动吗？';
  
  if (confirm(confirmMsg)) {
    try {
      if (filter.value === 'goals') {
        await Promise.all(selectedIds.value.map(id => taskStore.deleteGoal(id)));
      } else {
        await Promise.all(selectedIds.value.map(id => taskStore.deleteAction(id)));
      }
      selectedIds.value = [];
      isSelectAll.value = false;
      notification.value = '删除成功';
      setTimeout(() => notification.value = '', 3000);
    } catch (error) {
      notification.value = '删除失败，请稍后再试';
      setTimeout(() => notification.value = '', 3000);
    }
  }
}

// 进入目标的行动列表
function enterGoalActions(goal) {
  filter.value = 'actions';
  notification.value = `查看"${goal.title}"的行动列表`;
  setTimeout(() => notification.value = '', 3000);
}

// 删除目标
async function deleteGoal(goal) {
  let confirmMsg = `确定要删除目标"${goal.title}"吗？`;
  if (goal.marked) {
    confirmMsg = `目标"${goal.title}"已标记，确定要删除吗？`;
  }
  
  if (confirm(confirmMsg)) {
    try {
      await taskStore.deleteGoal(goal.id);
      notification.value = '目标删除成功';
      setTimeout(() => notification.value = '', 3000);
    } catch (error) {
      notification.value = '目标删除失败，请稍后再试';
      setTimeout(() => notification.value = '', 3000);
    }
  }
}

// 删除行动
async function deleteAction(action) {
  if (confirm(`确定要删除行动"${action.title}"吗？`)) {
    try {
      await taskStore.deleteAction(action.id);
      notification.value = '行动删除成功';
      setTimeout(() => notification.value = '', 3000);
    } catch (error) {
      notification.value = '行动删除失败，请稍后再试';
      setTimeout(() => notification.value = '', 3000);
    }
  }
}

// 标记/取消标记目标
async function toggleGoalMark(goal) {
  try {
    await taskStore.toggleGoalMark(goal.id);
    notification.value = goal.marked ? '目标已取消标记' : '目标已标记';
    setTimeout(() => notification.value = '', 3000);
  } catch (error) {
    notification.value = '操作失败，请稍后再试';
    setTimeout(() => notification.value = '', 3000);
  }
}

// 标记/取消标记行动
async function toggleActionMark(action) {
  try {
    await taskStore.toggleActionMark(action.id);
    notification.value = action.marked ? '行动已取消标记' : '行动已标记';
    setTimeout(() => notification.value = '', 3000);
  } catch (error) {
    notification.value = '操作失败，请稍后再试';
    setTimeout(() => notification.value = '', 3000);
  }
}

// 完成/取消完成目标
async function completeGoal(goal) {
  try {
    if (goal.completed) {
      await taskStore.restoreGoal(goal.id);
      notification.value = '目标已恢复';
    } else {
      await taskStore.completeGoal(goal.id);
      notification.value = '目标已完成';
    }
    setTimeout(() => notification.value = '', 3000);
  } catch (error) {
    notification.value = '操作失败，请稍后再试';
    setTimeout(() => notification.value = '', 3000);
  }
}

// 完成/取消完成行动
async function completeAction(action) {
  try {
    if (action.completed) {
      await taskStore.restoreAction(action.id);
      notification.value = '行动已恢复';
    } else {
      await taskStore.completeAction(action.id);
      notification.value = '行动已完成';
    }
    setTimeout(() => notification.value = '', 3000);
  } catch (error) {
    notification.value = '操作失败，请稍后再试';
    setTimeout(() => notification.value = '', 3000);
  }
}

// 切换目标展开状态
function toggleGoalExpand(goalId) {
  const index = expandedGoals.value.indexOf(goalId);
  if (index > -1) {
    expandedGoals.value.splice(index, 1);
  } else {
    expandedGoals.value.push(goalId);
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

/* 美化滚动条 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #d8b4fe;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #c084fc;
}
</style>