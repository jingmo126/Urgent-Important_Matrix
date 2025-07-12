<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 overflow-hidden">
      <div class="px-6 py-4">
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          {{ title }}
        </h3>
        <p class="text-gray-600">
          {{ message }}
        </p>
      </div>
      
      <div class="px-6 py-4 bg-gray-50 flex justify-end space-x-2">
        <button 
          type="button" 
          @click="$emit('cancel')" 
          class="btn bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          {{ cancelText }}
        </button>
        <button 
          type="button" 
          @click="$emit('confirm')" 
          class="btn btn-danger"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '确认'
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: '确认'
  },
  cancelText: {
    type: String,
    default: '取消'
  }
});

defineEmits(['confirm', 'cancel']);
</script>