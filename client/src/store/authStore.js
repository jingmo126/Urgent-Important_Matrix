import { defineStore } from 'pinia'
import axios from 'axios'
import router from '@/router'
import { useTaskStore } from './taskStore'

// 生成随机用户名和密码
const generateRandomCredentials = () => {
  const randomString = Math.random().toString(36).substring(2, 15)
  return {
    username: `user_${randomString}`,
    password: Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10)
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    isInitialized: false
  }),
  
  getters: {
    hasUserInfo: (state) => state.user !== null && state.user.id !== undefined
  },
  
  actions: {
    // 初始化认证状态
  async initAuth() {
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')
    
    try {
      if (savedUser && savedToken) {
        this.user = JSON.parse(savedUser)
        this.isAuthenticated = true
        // 设置axios默认头部
        axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
        
        // 加载用户的任务数据
        await this.loadUserTasks()
      }
    } catch (error) {
      console.error('Failed to parse saved auth data:', error)
      this.logout()
    } finally {
      this.isInitialized = true
    }
  },
  
  // 加载用户任务数据
  async loadUserTasks() {
    try {
      const taskStore = useTaskStore()
      // 确保任务存储知道当前用户ID
      taskStore.initUser()
      
      // 并行加载所有任务数据
      await Promise.all([
        taskStore.fetchGoals(),
        taskStore.fetchActions(),
        taskStore.fetchCompletedGoals(),
        taskStore.fetchCompletedActions()
      ])
    } catch (error) {
      console.error('加载用户任务数据失败:', error)
    }
  },
    
    // 用户名密码登录
    async loginWithCredentials(username, password) {
      this.loading = true
      this.error = null
      
      try {
        // 模拟API请求
        // 实际项目中应该替换为真实的后端API调用
        const response = await axios.post('/api/auth/login', { username, password })
        
        // 存储用户信息和token
        this.user = response.data.user
        this.isAuthenticated = true
        
        localStorage.setItem('user', JSON.stringify(response.data.user))
        localStorage.setItem('token', response.data.token)
        
        // 设置axios默认头部
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
        
        // 加载用户的任务数据
        await this.loadUserTasks()
        
        // 跳转到主页
        router.push('/quadrant')
        
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || '登录失败，请检查用户名和密码'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 手机验证码登录
    async loginWithPhone(phone, code) {
      this.loading = true
      this.error = null
      
      try {
        // 模拟API请求
        // 实际项目中应该替换为真实的后端API调用
        const response = await axios.post('/api/auth/login/phone', { phone, code })
        
        // 如果需要生成随机用户名密码
        const credentials = generateRandomCredentials()
        const userData = {
          ...response.data.user,
          username: response.data.user.username || credentials.username,
          password: credentials.password
        }
        
        this.user = userData
        this.isAuthenticated = true
        
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('token', response.data.token)
        
        // 设置axios默认头部
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
        
        // 加载用户的任务数据
        await this.loadUserTasks()
        
        // 跳转到主页
        router.push('/quadrant')
        
        return userData
      } catch (error) {
        this.error = error.response?.data?.message || '登录失败，请检查手机号和验证码'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 发送验证码
    async sendVerificationCode(phone) {
      this.loading = true
      this.error = null
      
      try {
        // 模拟API请求成功响应
        // 实际项目中应该替换为真实的后端API调用
        return new Promise((resolve) => {
          setTimeout(() => {
            // 生成模拟的成功响应数据
            const mockResponse = {
              success: true,
              message: '验证码发送成功',
              data: {
                phone: phone,
                // 实际项目中应该是真实的验证码
                verificationCode: Math.floor(100000 + Math.random() * 900000).toString(),
                expireAt: new Date(Date.now() + 5 * 60 * 1000) // 5分钟后过期
              }
            }
            resolve(mockResponse)
          }, 1000)
        })
      } catch (error) {
        this.error = error.message || '发送验证码失败，请稍后再试'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 第三方登录 (微信/抖音)
    async loginWithThirdParty(provider) {
      this.loading = true
      this.error = null
      
      try {
        // 对于微信登录，需要检测微信应用是否存在
        if (provider === 'wechat') {
          // 模拟检测微信应用是否存在
          // 实际项目中应该根据不同平台（iOS/Android/网页）使用对应的API检测微信应用
          const isWechatAppInstalled = await this.detectWechatApp();
          
          if (!isWechatAppInstalled) {
            throw new Error('未检测到微信应用，请先安装微信再尝试登录');
          }
        }
        
        // 模拟第三方登录成功，使用Promise包装异步操作
        return new Promise((resolve) => {
          setTimeout(() => {
            // 生成模拟用户数据
            const credentials = generateRandomCredentials()
            const userData = {
              id: Math.random().toString(36).substring(2, 10),
              username: `${provider}_user_${Date.now()}`,
              password: credentials.password,
              token: Math.random().toString(36).substring(2, 20)
            }
            
            this.user = userData
            this.isAuthenticated = true
            
            localStorage.setItem('user', JSON.stringify(userData))
            localStorage.setItem('token', userData.token)
            
            // 设置axios默认头部
            axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`
            
            // 加载用户的任务数据
            this.loadUserTasks().then(() => {
              // 跳转到主页
              router.push('/quadrant')
              resolve(userData)
            })
          }, 1000)
        })
      } catch (error) {
        this.error = error.message || `使用${provider}登录失败，请稍后再试`
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 检测微信应用是否存在
    async detectWechatApp() {
      try {
        // 模拟检测逻辑
        // 在实际应用中，这里应该根据不同平台使用相应的API检测微信应用
        // 例如在网页端可以尝试检查navigator.userAgent是否包含微信特征字符串
        // 在移动端可以使用相应的SDK提供的检测方法
        
        // 这里模拟80%的概率检测到微信应用
        return Math.random() < 0.8;
      } catch (error) {
        console.error('检测微信应用失败:', error);
        return false;
      }
    },
    
    // 注册
    async register(username, password) {
      this.loading = true
      this.error = null
      
      try {
        // 模拟API请求
        // 实际项目中应该替换为真实的后端API调用
        const mockResponse = {
          data: {
            user: {
              id: Math.random().toString(36).substring(2, 10),
              username: username
            },
            token: Math.random().toString(36).substring(2, 20)
          }
        }
        
        this.user = mockResponse.data.user
        this.isAuthenticated = true
        
        localStorage.setItem('user', JSON.stringify(mockResponse.data.user))
        localStorage.setItem('token', mockResponse.data.token)
        
        // 设置axios默认头部
        axios.defaults.headers.common['Authorization'] = `Bearer ${mockResponse.data.token}`
        
        // 加载用户的任务数据
        await this.loadUserTasks()
        
        // 跳转到主页
        router.push('/quadrant')
        
        return mockResponse.data
      } catch (error) {
        this.error = '注册失败，请稍后再试'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 登出
    logout() {
      this.user = null
      this.isAuthenticated = false
      
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      
      // 清除任务数据
      const taskStore = useTaskStore()
      taskStore.goals = []
      taskStore.actions = []
      taskStore.completedGoals = []
      taskStore.completedActions = []
      taskStore.userId = null
      
      // 移除axios默认头部
      delete axios.defaults.headers.common['Authorization']
      
      // 跳转到登录页面
      router.push('/login')
    },
    
    // 更新用户信息
    async updateUserInfo(userData) {
      this.loading = true
      this.error = null
      
      try {
        // 模拟API请求
        // 实际项目中应该替换为真实的后端API调用
        const response = await axios.put('/api/user/profile', userData)
        
        this.user = { ...this.user, ...response.data }
        localStorage.setItem('user', JSON.stringify(this.user))
        
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || '更新用户信息失败，请稍后再试'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})