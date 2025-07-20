import { defineStore } from 'pinia'
import axios from 'axios'

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [],
    completedTasks: [],
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
        
        // 同时获取已完成任务
        await this.fetchCompletedTasks()
      } catch (error) {
        this.error = error.message || '获取任务失败'
        console.error('获取任务失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 获取已完成任务
    async fetchCompletedTasks() {
      try {
        const response = await axios.get('/api/tasks/completed')
        this.completedTasks = response.data
      } catch (error) {
        console.error('获取已完成任务失败:', error)
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
    },

    // 完成任务
    async completeTask(taskId) {
      this.loading = true
      this.error = null
      
      try {
        const task = this.tasks.find(t => t.id === taskId)
        if (task) {
          // 添加完成时间
          const completedTask = {
            ...task,
            completedAt: new Date().toISOString(),
            completed: true
          }
          
          // 发送到服务器（如果需要）
          await axios.patch(`/api/tasks/${taskId}`, { completed: true, completedAt: completedTask.completedAt })
          
          // 从活动任务中移除，添加到已完成任务
          this.tasks = this.tasks.filter(t => t.id !== taskId)
          this.completedTasks.push(completedTask)
        }
      } catch (error) {
        this.error = error.message || '完成任务失败'
        console.error('完成任务失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 恢复任务
    async restoreTask(taskId) {
      this.loading = true
      this.error = null
      
      try {
        const task = this.completedTasks.find(t => t.id === taskId)
        if (task) {
          // 移除完成标记
          const restoredTask = {
            ...task,
            completed: false,
            completedAt: null
          }
          
          // 发送到服务器（如果需要）
          await axios.patch(`/api/tasks/${taskId}`, { completed: false, completedAt: null })
          
          // 从已完成任务中移除，添加到活动任务
          this.completedTasks = this.completedTasks.filter(t => t.id !== taskId)
          this.tasks.push(restoredTask)
        }
      } catch (error) {
        this.error = error.message || '恢复任务失败'
        console.error('恢复任务失败:', error)
      } finally {
        this.loading = false
      }
    },

    // 永久删除任务
    async permanentlyDeleteTask(taskId) {
      this.loading = true
      this.error = null
      
      try {
        await axios.delete(`/api/tasks/${taskId}`)
        this.completedTasks = this.completedTasks.filter(t => t.id !== taskId)
      } catch (error) {
        this.error = error.message || '永久删除任务失败'
        console.error('永久删除任务失败:', error)
      } finally {
        this.loading = false
      }
    }
  }
})