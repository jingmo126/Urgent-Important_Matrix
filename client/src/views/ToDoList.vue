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
        <!-- 移除删除选中按钮 -->
      </div>
    </div>

    <!-- 列表区域 -->
    <div class="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6 border-2 border-pink-200 overflow-x-auto">
      <!-- 仅目标视图 -->
      <div v-if="filter === 'goals'">
        <div class="mb-4 flex justify-end">
          <button 
            @click="showAddGoalForm = true"
            class="px-4 py-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-medium hover:shadow-lg transition-all flex items-center gap-2"
          >
            ➕ 新建目标
          </button>
        </div>
        <table class="min-w-full">
          <thead>
            <tr class="bg-gradient-to-r from-pink-100 to-purple-100 text-left">
              <th class="px-6 py-4 rounded-tl-2xl"></th>
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
                <button 
                  @click="completeGoal(goal)"
                  :class="['w-5 h-5 rounded-full border-2 border-purple-400 text-purple-600 focus:ring-purple-500', 
                    goal.completed ? 'bg-green-100 border-green-500' : 'bg-white border-purple-400']"
                  :title="goal.completed ? '恢复目标' : '完成目标'"
                >
                  <span v-if="goal.completed" class="text-green-600 text-xs">✓</span>
                </button>
              </td>
              <td class="px-6 py-4 font-medium text-purple-900">
                    {{ goal.title }}
                    <span v-if="hasRepeatingActions(goal)" class="ml-1 text-blue-500" title="此目标存在重复行动">🔄</span>
                  </td>
              <td class="px-6 py-4 text-gray-600">{{ goal.description || '-' }}</td>
              <td class="px-6 py-4">
                <div class="w-16 h-8 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 font-medium">
                  {{ Math.round(goal.importance) }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="w-16 h-8 rounded-full bg-gradient-to-r from-orange-100 to-orange-200 flex items-center justify-center text-orange-600 font-medium">
                  {{ Math.round(goal.urgency) }}
                </div>
              </td>
              <td class="px-6 py-4"></td>
            </tr>
            <!-- 编辑模式的目标行 -->
            <template v-if="editingItem && editingItem.type === 'goal' && editingItem.id === goal.id && editingItem.filter === filter.value">
              <tr class="border-b border-pink-100 bg-pink-50 transition-all">
                <td class="px-6 py-4"></td>
                <td class="px-6 py-4">
                  <input v-model="editForm.title" type="text" class="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="目标名称"/>
                </td>
                <td class="px-6 py-4">
                  <input v-model="editForm.description" type="text" class="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="目标描述"/>
                </td>
                <td class="px-6 py-4">
                  <input v-model.number="editForm.importance" type="number" min="1" max="10" class="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"/>
                </td>
                <td class="px-6 py-4">
                  <input v-model.number="editForm.urgency" type="number" min="1" max="10" class="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"/>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <button 
                      @click="saveEdit" 
                      class="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-all"
                      title="完成修改"
                    >
                      ✅
                    </button>
                    <button 
                      @click="cancelEdit" 
                      class="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                      title="取消修改"
                    >
                      ❌
                    </button>
                  </div>
                </td>
              </tr>
            </template>
            <!-- 新建目标行 -->
            <tr v-if="showAddGoalForm" class="border-b border-pink-100 bg-pink-50 transition-all">
              <td class="px-6 py-4"></td>
              <td class="px-6 py-4">
                <input v-model="newGoalForm.title" type="text" class="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="目标名称"/>
              </td>
              <td class="px-6 py-4">
                <input v-model="newGoalForm.description" type="text" class="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="目标描述"/>
              </td>
              <td class="px-6 py-4">
                <input v-model.number="newGoalForm.importance" type="number" min="1" max="10" class="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="重要度"/>
              </td>
              <td class="px-6 py-4">
                <input v-model.number="newGoalForm.urgency" type="number" min="1" max="10" class="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="紧急度"/>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button 
                    @click="saveNewGoal"
                    class="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-all"
                    title="保存目标"
                  >
                    ✅
                  </button>
                  <button 
                    @click="cancelNewGoal"
                    class="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                    title="取消"
                  >
                    ❌
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
        <div class="mb-4 flex justify-end">
          <button 
            @click="showAddActionFormForAction = true"
            class="px-4 py-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-medium hover:shadow-lg transition-all flex items-center gap-2"
          >
            ➕ 新建行动
          </button>
        </div>
        <table class="min-w-full">
          <thead>
            <tr class="bg-gradient-to-r from-pink-100 to-purple-100 text-left">
              <th class="px-6 py-4 rounded-tl-2xl"></th>
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
                <button 
                  @click="completeAction(action)"
                  :class="['w-5 h-5 rounded-full border-2 border-purple-400 text-purple-600 focus:ring-purple-500', 
                    action.completed ? 'bg-green-100 border-green-500' : 'bg-white border-purple-400']"
                  :title="action.completed ? '恢复行动' : '完成行动'"
                >
                  <span v-if="action.completed" class="text-green-600 text-xs">✓</span>
                </button>
              </td>
              <td class="px-6 py-4 font-medium text-purple-900">
                {{ action.title }}
                <span v-if="action.repeating" class="ml-1 inline-block text-blue-600" title="重复行动">🔄</span>
              </td>
              <td class="px-6 py-4 text-gray-600">{{ action.description || '-' }}</td>
              <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full bg-pink-100 text-pink-600 text-sm">{{ getGoalTitleById(action.goalId) || '无' }}</span>
              </td>
              <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <button 
                      @click="editAction(action)"
                      class="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all"
                      title="编辑行动"
                    >
                      ✏️
                    </button>
                    <button 
                      @click="toggleActionRepeating(action)"
                      :class="['p-2 rounded-full transition-all', action.repeating ? 'bg-blue-200 text-blue-700' : 'bg-blue-100 text-blue-600 hover:bg-blue-200']"
                      :title="action.repeating ? '取消行动重复' : '设置行动重复'"
                    >
                      🔄
                    </button>
                    <button 
                      @click="deleteAction(action)"
                      class="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-all"
                      title="删除行动"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
            </tr>
            <!-- 编辑模式的行动行 -->
            <template v-if="editingItem && editingItem.type === 'action' && editingItem.id === action.id && editingItem.filter === filter.value">
              <tr class="border-b border-pink-100 bg-pink-50 transition-all">
                <td class="px-6 py-4"></td>
                <td class="px-6 py-4">
                  <input v-model="editForm.title" type="text" class="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="行动名称"/>
                </td>
                <td class="px-6 py-4">
                  <input v-model="editForm.description" type="text" class="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="行动描述"/>
                </td>
                <td class="px-6 py-4">
                  <select v-model="editForm.goalId" class="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="">无</option>
                    <option v-for="goal in goals" :key="goal.id" :value="goal.id">{{ goal.title }}</option>
                  </select>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <button 
                      @click="saveEdit" 
                      class="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-all"
                      title="完成修改"
                    >
                      ✅
                    </button>
                    <button 
                      @click="cancelEdit" 
                      class="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                      title="取消修改"
                    >
                      ❌
                    </button>
                  </div>
                </td>
              </tr>
            </template>
            <template v-else>
            </template>
            <!-- 新建行动行 -->
            <tr v-if="showAddActionFormForAction" class="border-b border-pink-100 bg-pink-50 transition-all">
              <td class="px-6 py-4"></td>
              <td class="px-6 py-4">
                <input v-model="newActionForm.title" type="text" class="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="行动名称"/>
              </td>
              <td class="px-6 py-4">
                <input v-model="newActionForm.description" type="text" class="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="行动描述"/>
              </td>
              <td class="px-6 py-4">
                <select v-model="newActionForm.goalId" class="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="">无</option>
                  <option v-for="goal in goals" :key="goal.id" :value="goal.id">{{ goal.title }}</option>
                </select>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button 
                    @click="saveNewAction" 
                    class="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-all"
                    title="保存行动"
                  >
                    ✅
                  </button>
                  <button 
                    @click="cancelNewAction" 
                    class="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                    title="取消"
                  >
                    ❌
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
                <th class="px-6 py-4"></th>
                <th class="px-6 py-4 font-bold text-purple-700">名称</th>
                <th class="px-6 py-4 font-bold text-purple-700">描述</th>
                <th class="px-6 py-4 font-bold text-purple-700">重要度</th>
                <th class="px-6 py-4 font-bold text-purple-700">紧急度</th>
                <th class="px-6 py-4 font-bold text-purple-700">操作</th>
              </tr>
            </thead>
          <tbody>
            <!-- 目标行 -->
            <template v-for="goal in goalsWithActions" :key="goal.id">
              <!-- 编辑模式的目标行 -->
              <template v-if="editingItem && editingItem.type === 'goal' && editingItem.id === goal.id && editingItem.filter === filter.value">
                <tr class="border-b border-purple-200 bg-purple-50 transition-all">
                  <td class="px-6 py-5">
                    <button 
                      @click="toggleGoalExpand(goal.id)" 
                      class="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-all"
                      title="展开/收起行动"
                    >
                      {{ expandedGoals.includes(goal.id) ? '▼' : '▶' }}
                    </button>
                  </td>
                  <td class="px-6 py-5">
                    <input v-model="editForm.title" type="text" class="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="目标名称"/>
                  </td>
                  <td class="px-6 py-5">
                    <input v-model="editForm.description" type="text" class="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="目标描述"/>
                  </td>
                  <td class="px-6 py-5">
                    <input v-model.number="editForm.importance" type="number" min="1" max="10" class="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"/>
                  </td>
                  <td class="px-6 py-5">
                    <input v-model.number="editForm.urgency" type="number" min="1" max="10" class="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"/>
                  </td>
                  <td class="px-6 py-5">
                    <div class="flex items-center gap-2">
                      <button 
                        @click="saveEdit" 
                        class="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-all"
                        title="完成修改"
                      >
                        ✅
                      </button>
                      <button 
                        @click="cancelEdit" 
                        class="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                        title="取消修改"
                      >
                        ❌
                      </button>
                    </div>
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr 
                  class="border-b border-purple-200 hover:bg-purple-50 transition-all"
                  :class="{ 'line-through text-gray-400': goal.completed }"
                >
                  <td class="px-6 py-5">
                    <button 
                      @click="toggleGoalExpand(goal.id)" 
                      class="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-all"
                      title="展开/收起行动"
                    >
                      {{ expandedGoals.includes(goal.id) ? '▼' : '▶' }}
                    </button>
                  </td>
                  <td class="px-6 py-5 font-bold text-xl text-purple-800">
                    🎯 {{ goal.title }}
                    <span v-if="hasRepeatingActions(goal)" class="ml-1 text-blue-500" title="此目标存在重复行动">🔄</span>
                  </td>
                  <td class="px-6 py-5 text-gray-600">{{ goal.description || '-' }}</td>
                  <td class="px-6 py-5">
                    <div class="w-16 h-8 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 font-medium">
                      {{ Math.round(goal.importance) }}
                    </div>
                  </td>
                  <td class="px-6 py-5">
                    <div class="w-16 h-8 rounded-full bg-gradient-to-r from-orange-100 to-orange-200 flex items-center justify-center text-orange-600 font-medium">
                      {{ Math.round(goal.urgency) }}
                    </div>
                  </td>
                  <td class="px-6 py-5"></td>
                </tr>
              </template>
              <!-- 展开的行动 -->
              <template v-if="expandedGoals.includes(goal.id)">
                <!-- 全部视图下的新建行动表单 -->
                <tr v-if="showAddActionFormForAll" class="border-b border-pink-100 bg-pink-50 transition-all">
                  <td class="px-6 pl-16 py-4"></td>
                  <td class="px-6 py-4">
                    <input v-model="newActionForm.title" type="text" class="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="行动名称"/>
                  </td>
                  <td class="px-6 py-4">
                    <input v-model="newActionForm.description" type="text" class="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="行动描述"/>
                  </td>
                  <td class="px-6 py-4">
                    <!-- 重要度：直接显示父目标的值和样式 -->
                    <div class="w-16 h-8 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 font-medium">
                      {{ Math.round(goal.importance) }}
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <!-- 紧急度：直接显示父目标的值和样式 -->
                    <div class="w-16 h-8 rounded-full bg-gradient-to-r from-orange-100 to-orange-200 flex items-center justify-center text-orange-600 font-medium">
                      {{ Math.round(goal.urgency) }}
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <button 
                        @click="saveNewAction"
                        class="p-1.5 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-all"
                        title="保存行动"
                      >
                        ✅
                      </button>
                      <button 
                        @click="cancelNewAction"
                        class="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                        title="取消"
                      >
                        ❌
                      </button>
                    </div>
                  </td>
                </tr>
                <template v-for="action in goal.actions" :key="action.id">
                  <!-- 编辑模式的行动行 -->
                  <template v-if="editingItem && editingItem.type === 'action' && editingItem.id === action.id && editingItem.filter === filter.value">
                    <tr class="border-b border-pink-100 bg-pink-50 transition-all">
                      <td class="px-6 pl-16 py-3"></td>
                      <td class="px-6 py-3">
                        <input v-model="editForm.title" type="text" class="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="行动名称"/>
                      </td>
                      <td class="px-6 py-3">
                        <input v-model="editForm.description" type="text" class="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="行动描述"/>
                      </td>
                      <td class="px-6 py-3"></td>
                      <td class="px-6 py-3"></td>
                      <td class="px-6 py-3">
                        <div class="flex items-center gap-2">
                          <button 
                            @click="saveEdit" 
                            class="p-1.5 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-all"
                            title="完成修改"
                          >
                            ✅
                          </button>
                          <button 
                            @click="cancelEdit" 
                            class="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                            title="取消修改"
                          >
                            ❌
                          </button>
                        </div>
                      </td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr 
                      class="border-b border-pink-100 bg-pink-50/50 hover:bg-pink-50 transition-all"
                      :class="{ 'line-through text-gray-400': action.completed }"
                    >
                      <td class="px-6 pl-16 py-3"></td>
                      <td class="px-6 py-3 font-medium text-purple-700">
                        📝 {{ action.title }}
                        <span v-if="action.repeating" class="ml-1 inline-block text-blue-600" title="重复行动">🔄</span>
                      </td>
                      <td class="px-6 py-3 text-gray-600">{{ action.description || '-' }}</td>
                  <td class="px-6 py-4">
                    <!-- 重要度：直接显示父目标的值和样式 -->
                    <div class="w-16 h-8 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 font-medium">
                      {{ Math.round(goal.importance) }}
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <!-- 紧急度：直接显示父目标的值和样式 -->
                    <div class="w-16 h-8 rounded-full bg-gradient-to-r from-orange-100 to-orange-200 flex items-center justify-center text-orange-600 font-medium">
                      {{ Math.round(goal.urgency) }}
                    </div>
                  </td>
                      <td class="px-6 py-3">
                        <div class="flex items-center gap-2">
                          <button 
                        @click.stop="editAction(action)"
                        class="p-1.5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all"
                        title="编辑行动"
                      >
                        ✏️
                      </button>
                      <button 
                        @click="toggleActionRepeating(action)"
                        :class="['p-1.5 rounded-full transition-all', action.repeating ? 'bg-blue-200 text-blue-700' : 'bg-blue-100 text-blue-600 hover:bg-blue-200']"
                        :title="action.repeating ? '取消行动重复' : '设置行动重复'"
                      >
                        🔄
                      </button>
                      <button 
                        @click="deleteAction(action)"
                        class="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-all"
                        title="删除行动"
                      >
                        🗑️
                      </button>
                        </div>
                      </td>
                    </tr>
                  </template>
                </template>
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
const showAddActionForm = ref(false);
const showAddActionFormForAction = ref(false);
const showAddActionFormForAll = ref(false);
const showAddGoalForm = ref(false);
const editingItem = ref(null);
const editForm = ref({});
const newActionForm = ref({ title: '', description: '', goalId: '', repeating: false });
const newGoalForm = ref({ title: '', description: '', importance: 5, urgency: 5 });

// 计算属性
const goals = computed(() => taskStore.goals);
const actions = computed(() => taskStore.actions);
const filteredGoals = computed(() => goals.value.filter(goal => !goal.completed));
// 修改filteredActions计算属性，过滤掉来自"全部"视图的行动
const filteredActions = computed(() => {
  return actions.value.filter(action => {
    // 只显示未完成的行动，并且如果行动有sourceView标记，确保它不是来自"全部"视图
    return !action.completed && !(action.sourceView === 'all' && filter.value !== 'all');
  });
});
const selectedCount = computed(() => selectedIds.value.length);

// 目标与行动组合数据
const goalsWithActions = computed(() => {
  // 在"全部"视图下返回所有目标，在其他视图下只返回未完成的目标
  const filteredGoals = filter.value === 'all' ? goals.value : goals.value.filter(goal => !goal.completed);
  return filteredGoals.map(goal => ({
    ...goal,
    actions: actions.value.filter(action => action.goalId === goal.id && (!goal.completed || filter.value === 'all'))
  }));
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
  } else if (filter.value === 'all') {
    // 对于全部视图，不执行任何操作或根据需要实现
  }
}

// 批量完成选中项
async function completeSelected() {
  if (selectedIds.value.length === 0) return;
  
  const confirmMsg = filter.value === 'goals' 
    ? '确定要完成选中的目标吗？' 
    : '确定要完成选中的行动吗？';
  
  if (confirm(confirmMsg)) {
    try {
      if (filter.value === 'goals') {
        await Promise.all(selectedIds.value.map(id => taskStore.completeGoal(id)));
      } else {
        await Promise.all(selectedIds.value.map(id => taskStore.completeAction(id)));
      }
      selectedIds.value = [];
      isSelectAll.value = false;
      notification.value = '完成成功';
      setTimeout(() => notification.value = '', 3000);
    } catch (error) {
      notification.value = '操作失败，请稍后再试';
      setTimeout(() => notification.value = '', 3000);
    }
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
      // 完成目标
      await taskStore.completeGoal(goal.id);
      // 同时完成该目标下的所有行动
      const goalActions = taskStore.actions.filter(action => action.goalId === goal.id);
      for (const action of goalActions) {
        await taskStore.completeAction(action.id);
      }
      notification.value = '目标及所有行动已完成';
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
      
      // 如果是重复行动，在第二天创建新的行动
      if (action.repeating) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const newAction = {
          title: action.title,
          description: action.description,
          goalId: action.goalId,
          sourceView: action.sourceView || 'actions'
        };
        await taskStore.addAction(newAction);
        notification.value = '行动已完成，已为明天创建新的重复行动';
      }
    }
    
    // 检查目标是否应该被自动完成
    await checkAndUpdateGoalCompletion(action.goalId);
    
    setTimeout(() => notification.value = '', 3000);
  } catch (error) {
    notification.value = '操作失败，请稍后再试';
    setTimeout(() => notification.value = '', 3000);
  }
}

// 检查并更新目标完成状态
async function checkAndUpdateGoalCompletion(goalId) {
  if (!goalId) return;
  
  try {
    const goal = goals.value.find(g => g.id === goalId);
    if (!goal || goal.completed) return;
    
    const goalActions = actions.value.filter(a => a.goalId === goalId);
    const allCompleted = goalActions.every(a => a.completed);
    const hasRepeatingActions = goalActions.some(a => a.repeating);
    
    if (allCompleted && !hasRepeatingActions) {
      await taskStore.completeGoal(goalId);
      notification.value += '，目标已自动完成';
    }
  } catch (error) {
    console.error('检查目标完成状态失败:', error);
  }
}

// 为目标添加行动
function addActionForGoal(goal) {
  // 如果在全部视图且目标未展开，则先展开目标
  if (filter.value === 'all' && !expandedGoals.value.includes(goal.id)) {
    toggleGoalExpand(goal.id);
  }
  
  // 根据当前视图决定显示哪个新建表单
  if (filter.value === 'actions') {
    showAddActionFormForAction.value = true;
  } else if (filter.value === 'all') {
    showAddActionFormForAll.value = true;
  } else {
    showAddActionForm.value = true;
  }
  currentGoal.value = goal.id;
}

// 根据目标ID获取目标标题
function getGoalTitleById(goalId) {
  const goal = goals.value.find(g => g.id === goalId);
  return goal ? goal.title : '';
}

// 编辑目标
function editGoal(goal) {
  editingItem.value = { id: goal.id, type: 'goal', filter: filter.value };
  editForm.value = {
    title: goal.title,
    description: goal.description,
    importance: goal.importance,
    urgency: goal.urgency
  };
}

// 编辑行动
function editAction(action) {
  editingItem.value = { id: action.id, type: 'action', filter: filter.value };
  editForm.value = {
    title: action.title,
    description: action.description,
    goalId: action.goalId
  };
}

// 保存编辑
async function saveEdit() {
  try {
    if (editingItem.value.type === 'goal') {
      await taskStore.updateGoal({ id: editingItem.value.id, ...editForm.value });
      notification.value = '目标更新成功';
    } else {
      await taskStore.updateAction({ id: editingItem.value.id, ...editForm.value });
      notification.value = '行动更新成功';
    }
    cancelEdit();
    setTimeout(() => notification.value = '', 3000);
  } catch (error) {
    notification.value = '更新失败，请稍后再试';
    setTimeout(() => notification.value = '', 3000);
  }
}

// 取消编辑
function cancelEdit() {
  editingItem.value = null;
  editForm.value = {};
}

// 保存新行动
async function saveNewAction() {
  try {
    if (!newActionForm.value.title.trim()) {
      notification.value = '请输入行动名称';
      setTimeout(() => notification.value = '', 3000);
      return;
    }
    
    // 如果设置了当前目标，则使用该目标ID
    const actionData = {
      ...newActionForm.value,
      goalId: currentGoal.value || newActionForm.value.goalId,
      // 添加来源视图标记，以便在过滤时使用
      sourceView: filter.value
    };
    
    await taskStore.addAction(actionData);
    notification.value = '行动创建成功';
    cancelNewAction();
    
    // 不需要强制切换到全部视图，保持在当前视图
    setTimeout(() => notification.value = '', 3000);
  } catch (error) {
    notification.value = '创建失败，请稍后再试';
    setTimeout(() => notification.value = '', 3000);
  }
}

// 取消新建行动
function cancelNewAction() {
  showAddActionForm.value = false;
  showAddActionFormForAction.value = false;
  showAddActionFormForAll.value = false;
  newActionForm.value = { title: '', description: '', goalId: '', repeating: false };
  currentGoal.value = null;
}

// 保存新目标
async function saveNewGoal() {
  try {
    if (!newGoalForm.value.title.trim()) {
      notification.value = '请输入目标名称';
      setTimeout(() => notification.value = '', 3000);
      return;
    }
    
    await taskStore.addGoal(newGoalForm.value);
    notification.value = '目标创建成功';
    cancelNewGoal();
    
    setTimeout(() => notification.value = '', 3000);
  } catch (error) {
    notification.value = '创建失败，请稍后再试';
    setTimeout(() => notification.value = '', 3000);
  }
}

// 取消新建目标
function cancelNewGoal() {
  showAddGoalForm.value = false;
  newGoalForm.value = { title: '', description: '', importance: 5, urgency: 5 };
}

// 切换行动重复状态
async function toggleActionRepeating(action) {
  try {
    // 存储当前重复状态，用于通知消息
    const wasRepeating = action.repeating;
    console.log('切换重复状态前:', wasRepeating);
    
    // 调用taskStore切换重复状态
    await taskStore.toggleActionRepeating(action.id);
    
    // 手动更新本地action对象的repeating属性
    // 因为我们无法直接修改响应式数据中的对象，所以需要重新获取数据
    await loadData();
    
    // 查找更新后的行动，验证repeating状态是否已更改
    const updatedAction = actions.value.find(a => a.id === action.id);
    console.log('切换重复状态后:', updatedAction?.repeating);
    
    // 根据之前的状态显示通知
    notification.value = wasRepeating ? '已取消行动重复' : '已设置行动重复';
    setTimeout(() => notification.value = '', 3000);
  } catch (error) {
    console.error('切换重复状态失败:', error);
    notification.value = '操作失败，请稍后再试';
    setTimeout(() => notification.value = '', 3000);
  }
}

// 判断目标是否有重复行动
function hasRepeatingActions(goal) {
  return actions.value.some(action => action.goalId === goal.id && action.repeating);
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