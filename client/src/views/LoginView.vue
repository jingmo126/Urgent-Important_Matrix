<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
      <!-- 登录表单头部 -->
      <div class="bg-gradient-to-r from-pink-500 to-purple-600 py-6 px-8 text-white">
        <h1 class="text-2xl font-bold text-center">登录任务管理器</h1>
        <p class="text-center text-pink-100 mt-1">高效管理您的时间和任务</p>
      </div>
      
      <!-- 登录表单内容 -->
      <div class="p-8">
        <!-- 错误信息显示 -->
        <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {{ error }}
        </div>
        
        <!-- 账号密码登录表单 -->
        <form @submit.prevent="handleCredentialsLogin">
          <div class="mb-4">
            <label for="username" class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
            <input
              id="username"
              v-model="username"
              type="text"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="请输入用户名"
              required
            />
          </div>
          
          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">密码</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="请输入密码"
              required
            />
          </div>
          
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center"
          >
            <span v-if="isLoading" class="mr-2 animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            登录
          </button>
        </form>
        
        <!-- 注册入口 -->
        <div class="mt-8 text-center">
          <p class="text-sm text-gray-600">
            还没有账号？
            <button 
              @click="goToRegister"
              class="text-purple-600 font-medium hover:text-purple-800 transition-colors"
            >
              立即注册
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/authStore'

const router = useRouter()
const authStore = useAuthStore()

// 表单状态
const username = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

// 处理账号密码登录
const handleCredentialsLogin = async () => {
  error.value = ''
  isLoading.value = true
  
  try {
    await authStore.loginWithCredentials(username.value, password.value)
    router.push('/')
  } catch (err) {
    error.value = authStore.error || '登录失败，请检查用户名和密码'
  } finally {
    isLoading.value = false
  }
}

// 跳转到注册页面
const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
/* 自定义样式 */
button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

input:focus {
  box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2);
}
</style>