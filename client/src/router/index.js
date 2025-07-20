import { createRouter, createWebHistory } from 'vue-router'
import QuadrantView from '../views/QuadrantView.vue'
import PriorityView from '../views/PriorityView.vue'
import CompletedView from '../views/CompletedView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'quadrant',
      component: QuadrantView
    },
    {
      path: '/priority',
      name: 'priority',
      component: PriorityView
    },
    {
      path: '/completed',
      name: 'completed',
      component: CompletedView
    }
  ]
})

export default router