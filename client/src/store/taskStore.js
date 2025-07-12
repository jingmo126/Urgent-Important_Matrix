import { defineStore } from 'pinia'
import axios from 'axios'

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [],
    loading: false,
    error: null,
    editMode: false // 控制是否处于编辑模式
  }),
  
  getters: {
    // 按象限分组的任务
    tasksByQuadrant: (state) => {
      const quadrants = {
        q1: [], // 重要且紧急
        q2: [], // 重要不紧急
        q3: [], // 不重要但紧急
        q4: []  // 不重要不紧急
      }
      
      state.tasks.forEach(task => {
        if (task.importance > 5 && task.urgency > 5) {
          quadrants.q1.push(task)
        } else if (task.importance > 5 && task.urgency <= 5) {
          quadrants.q2.push(task)
        } else if (task.importance <= 5 && task.urgency > 5) {
          quadrants.q3.push(task)
        } else {
          quadrants.q4.push(task)
        }
      })
      
      return quadrants
    },
    
    // 按优先级排序的任务
    tasksByPriority: (state) => {
      return [...state.tasks].sort((a, b) => b.priority - a.priority)
    }
  },
  
  actions: {
    // 切换编辑模式
    toggleEditMode() {
      this.editMode = !this.editMode
    },
    
    // 获取所有任务
    async fetchTasks() {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.get('/api/tasks')
        this.tasks = response.data
      } catch (error) {
        this.error = error.message || '获取任务失败'
        console.error('获取任务失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 添加任务
    async addTask(task) {
      this.loading = true
      this.error = null
      
      try {
        // 计算优先级
        task.priority = task.importance * 0.4 + task.urgency * 0.6
        
        const response = await axios.post('/api/tasks', task)
        this.tasks.push(response.data)
      } catch (error) {
        this.error = error.message || '添加任务失败'
        console.error('添加任务失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 更新任务
    async updateTask(task) {
      this.loading = true
      this.error = null
      
      try {
        // 计算优先级
        task.priority = task.importance * 0.4 + task.urgency * 0.6
        
        const response = await axios.put(`/api/tasks/${task.id}`, task)
        const index = this.tasks.findIndex(t => t.id === task.id)
        if (index !== -1) {
          this.tasks[index] = response.data
        }
      } catch (error) {
        this.error = error.message || '更新任务失败'
        console.error('更新任务失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 删除任务
    async deleteTask(taskId) {
      this.loading = true
      this.error = null
      
      try {
        await axios.delete(`/api/tasks/${taskId}`)
        this.tasks = this.tasks.filter(task => task.id !== taskId)
      } catch (error) {
        this.error = error.message || '删除任务失败'
        console.error('删除任务失败:', error)
      } finally {
        this.loading = false
      }
    }
  }
})