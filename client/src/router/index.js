import { createRouter, createWebHistory } from 'vue-router'
import QuadrantView from '../views/QuadrantView.vue'
import ToDoList from '../views/ToDoList.vue'
import CompletedView from '../views/CompletedView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import { useAuthStore } from '../store/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        guest: true // 无需登录即可访问
      }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: {
        guest: true // 无需登录即可访问
      }
    },
    {
      path: '/',
      name: 'quadrant',
      component: QuadrantView,
      meta: {
        requiresAuth: true // 需要登录才能访问
      }
    },
    {
      path: '/priority',
      name: 'priority',
      component: ToDoList,
      meta: {
        requiresAuth: true // 需要登录才能访问
      }
    },
    {
      path: '/actions',
      name: 'actions',
      component: ToDoList,
      meta: {
        requiresAuth: true // 需要登录才能访问
      }
    },
    {
      path: '/completed',
      name: 'completed',
      component: CompletedView,
      meta: {
        requiresAuth: true // 需要登录才能访问
      }
    }
  ]
})

// 路由守卫，处理未登录用户的重定向
router.beforeEach((to, from, next) => {
  // 延迟创建authStore实例，避免在服务器端渲染时出现问题
  const authStore = useAuthStore()
  
  // 初始化认证状态
  if (!authStore.isInitialized) {
    authStore.initAuth()
    authStore.isInitialized = true
  }
  
  // 如果路由需要认证但用户未登录，则重定向到登录页面
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
  }
  // 如果用户已登录但尝试访问登录或注册页面，则重定向到主页
  else if ((to.name === 'login' || to.name === 'register') && authStore.isAuthenticated) {
    next({ name: 'quadrant' })
  }
  // 其他情况，继续导航
  else {
    next()
  }
})

export default router