<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
      <!-- 注册表单头部 -->
      <div class="bg-gradient-to-r from-blue-500 to-purple-600 py-6 px-8 text-white">
        <h1 class="text-2xl font-bold text-center">创建新账号</h1>
        <p class="text-center text-blue-100 mt-1">开始高效管理您的时间和任务</p>
      </div>
      
      <!-- 注册表单内容 -->
      <div class="p-8">
        <!-- 错误信息显示 -->
        <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {{ error }}
        </div>
        
        <form @submit.prevent="handleRegister">
          <!-- 用户名输入 -->
          <div class="mb-4">
            <label for="username" class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
            <input
              id="username"
              v-model="username"
              type="text"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请设置用户名"
              required
            />
          </div>
          
          <!-- 密码输入 -->
          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">密码</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请设置密码（6-20位字母、数字和符号组合）"
              required
            />
          </div>
          
          <!-- 注册按钮 -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center"
          >
            <span v-if="isLoading" class="mr-2 animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            注册
          </button>
        </form>
        
        <!-- 已有账号？返回登录 -->
        <div class="mt-8 text-center">
          <p class="text-sm text-gray-600">
            已有账号？
            <button 
              @click="goToLogin"
              class="text-blue-600 font-medium hover:text-blue-800 transition-colors"
            >
              立即登录
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 注册成功登录提示模态框 -->
  <div v-if="showLoginPrompt" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
      <div class="text-center mb-4">
        <div class="text-4xl mb-3">🎉</div>
        <h3 class="text-xl font-bold text-purple-700">注册成功！</h3>
        <p class="text-gray-600 mt-2">您的账号已创建成功，是否现在登录？</p>
      </div>
      <div class="flex gap-4">
        <button
          @click="loginNow"
          class="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all"
        >
          立即登录
        </button>
        <button
          @click="cancelLoginPrompt"
          class="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
        >
          稍后登录
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/authStore'
import axios from 'axios'

const router = useRouter()
const authStore = useAuthStore()

// 表单状态
const username = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)
const showLoginPrompt = ref(false)

// 处理注册
const handleRegister = async () => {
  // 表单验证
  if (!username.value || username.value.length < 3) {
    error.value = '用户名至少需要3个字符'
    return
  }
  
  if (!password.value || password.value.length < 6 || password.value.length > 20) {
    error.value = '密码长度应为6-20位'
    return
  }
  
  error.value = ''
  isLoading.value = true
  
  try {
    // 调用真实的注册API，将用户添加到数据库
    // 不立即自动登录，而是显示提示框
    await axios.post('/api/auth/register', {
      username: username.value,
      password: password.value
    })
    
    // 保存注册的用户名和密码，以便稍后登录使用
    const registeredUsername = username.value
    const registeredPassword = password.value
    
    // 清空表单
    username.value = ''
    password.value = ''
    
    // 显示登录提示
    showLoginPrompt.value = true
    
    // 存储注册信息，供loginNow方法使用
    window.registeredCredentials = {
      username: registeredUsername,
      password: registeredPassword
    }
  } catch (err) {
    error.value = err.response?.data?.message || '注册失败，请稍后再试'
  } finally {
    isLoading.value = false
  }
}

// 直接登录 - 使用刚注册的用户信息直接进入系统
const loginNow = async () => {
  showLoginPrompt.value = false
  isLoading.value = true
  
  try {
    const { username, password } = window.registeredCredentials || {};
    if (username && password) {
      // 使用保存的注册信息直接登录
      await authStore.loginWithCredentials(username, password);
      // 登录成功后会自动跳转到主页
    } else {
      // 如果没有保存的注册信息，回退到登录页
      router.push('/login');
    }
  } catch (err) {
    error.value = '登录失败，请尝试手动登录'
    router.push('/login')
  } finally {
    isLoading.value = false
    // 清理保存的凭据
    delete window.registeredCredentials
  }
}

// 稍后登录 - 返回登录页
const cancelLoginPrompt = () => {
  showLoginPrompt.value = false
  router.push('/login')
}

// 跳转到登录页面
const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
/* 自定义样式 */
button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

input:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}
</style>