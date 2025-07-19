<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">
          {{ isEdit ? '编辑任务' : '添加任务' }}
        </h3>
      </div>
      
      <form @submit.prevent="saveTask">
        <div class="px-6 py-4 space-y-4">
          <!-- 任务标题 -->
          <div>
            <label for="title" class="label">任务标题</label>
            <input 
              id="title" 
              v-model="taskForm.title" 
              type="text" 
              class="input w-full" 
              required
              placeholder="输入任务标题"
            >
          </div>
          
          <!-- 任务描述 -->
          <div>
            <label for="description" class="label">任务描述</label>
            <textarea 
              id="description" 
              v-model="taskForm.description" 
              class="input w-full h-24" 
              placeholder="输入任务描述（可选）"
            ></textarea>
          </div>
          
          <!-- 重要度 -->
          <div>
            <label for="importance" class="label">重要度 (1-10): {{ taskForm.importance }}</label>
            <input 
              id="importance" 
              v-model.number="taskForm.importance" 
              type="range" 
              min="1" 
              max="10" 
              step="1" 
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            >
          </div>
          
          <!-- 紧急度 -->
          <div>
            <label for="urgency" class="label">紧急度 (1-10): {{ taskForm.urgency }}</label>
            <input 
              id="urgency" 
              v-model.number="taskForm.urgency" 
              type="range" 
              min="1" 
              max="10" 
              step="1" 
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            >
          </div>
          
          <!-- 截止日期 -->
          <div>
            <label for="dueDate" class="label">截止日期（可选）</label>
            <input 
              id="dueDate" 
              v-model="taskForm.dueDate" 
              type="date" 
              class="input w-full"
            >
          </div>
          
          <!-- 心情选择 -->
          <div>
            <label class="label">心情: {{ getCurrentMoodLabel() }}</label>
            <div class="flex space-x-2 mt-2">
              <button
                v-for="mood in moodOptions"
                :key="mood.value"
                type="button"
                @click="taskForm.mood = mood.value"
                class="w-12 h-12 rounded-lg border-2 transition-all duration-200 hover:scale-110 flex items-center justify-center text-xl"
                :class="taskForm.mood === mood.value ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'"
                :title="mood.label"
              >
                {{ mood.emoji }}
              </button>
            </div>
          </div>
          
          <!-- 优先级（只读） -->
          <div>
            <label class="label">计算优先级: {{ calculatePriority().toFixed(1) }}</label>
            <div class="bg-gray-100 rounded-md p-2 text-sm text-gray-600">
              优先级 = (重要度({{ taskForm.importance }}) + 紧急度({{ taskForm.urgency }})) / 2
            </div>
          </div>
        </div>
        
        <div class="px-6 py-4 bg-gray-50 flex justify-between">
          <div>
            <button 
              v-if="isEdit" 
              type="button" 
              @click="confirmDelete" 
              class="btn bg-red-50 text-danger hover:bg-red-100"
            >
              删除
            </button>
          </div>
          <div class="flex space-x-2">
            <button 
              type="button" 
              @click="$emit('close')" 
              class="btn bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              取消
            </button>
            <button 
              type="submit" 
              class="btn btn-primary"
            >
              保存
            </button>
          </div>
        </div>
      </form>
    </div>
    
    <!-- 删除确认对话框 -->
    <ConfirmDialog
      v-if="showDeleteConfirm"
      title="确认删除"
      message="确定要删除这个任务吗？此操作不可撤销。"
      confirm-text="删除"
      cancel-text="取消"
      @confirm="deleteTask"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import ConfirmDialog from './ConfirmDialog.vue';

const props = defineProps({
  task: {
    type: Object,
    default: null
  },
  isEdit: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'save', 'delete']);

// 表单数据
const taskForm = ref({
  title: '',
  description: '',
  importance: 5,
  urgency: 5,
  dueDate: '',
  mood: 'smile'
});

// 心情选项
const moodOptions = [
  { value: 'smile', label: '开心', emoji: '😊' },
  { value: 'cry', label: '难过', emoji: '😢' },
  { value: 'struggle', label: '奋斗', emoji: '💪' },
  { value: 'shy', label: '害羞', emoji: '😳' },
  { value: 'thinking', label: '沉思', emoji: '🤔' }
];

// 删除确认
const showDeleteConfirm = ref(false);

// 初始化表单数据
onMounted(() => {
  if (props.task) {
    // 编辑模式，填充现有数据
    taskForm.value = { ...props.task };
    
    // 格式化日期为YYYY-MM-DD格式
    if (taskForm.value.dueDate) {
      const date = new Date(taskForm.value.dueDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      taskForm.value.dueDate = `${year}-${month}-${day}`;
    }
  }
});

// 获取当前心情标签
function getCurrentMoodLabel() {
  const currentMood = moodOptions.find(mood => mood.value === taskForm.value.mood);
  return currentMood ? currentMood.label : '开心';
}

// 计算优先级
function calculatePriority() {
  return (taskForm.value.importance + taskForm.value.urgency) / 2;
}

// 保存任务
function saveTask() {
  const task = { ...taskForm.value };
  
  // 处理空日期，确保发送null而不是空字符串
  if (task.dueDate === '') {
    task.dueDate = null;
  }
  
  task.priority = calculatePriority();
  emit('save', task);
}

// 确认删除
function confirmDelete() {
  showDeleteConfirm.value = true;
}

// 删除任务
function deleteTask() {
  emit('delete', props.task.id);
}
</script>