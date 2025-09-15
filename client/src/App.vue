<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50" style="font-family: '幼圆', 'Microsoft YaHei', sans-serif;">
    <!-- 如果用户已登录，显示顶部导航栏和主内容区 -->
    <template v-if="authStore.isAuthenticated">
      <!-- 顶部导航栏 -->
      <Sidebar />
      
      <!-- 主内容区 -->
      <main class="pt-40 pb-10">
        <div class="container mx-auto px-6">
          <router-view />
        </div>
      </main>
    </template>
    
    <!-- 如果用户未登录，只显示router-view -->
    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from './store/authStore';
import Sidebar from './components/Sidebar.vue';

const authStore = useAuthStore();

// 初始化认证状态
onMounted(() => {
  authStore.initAuth();
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;600;700&display=swap');

/* 全局样式 */
* {
  font-family: '幼圆', 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
}

/* 可爱的滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #ff9a9e, #fecfef);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(45deg, #ff6b9d, #fda4ba);
}
</style>