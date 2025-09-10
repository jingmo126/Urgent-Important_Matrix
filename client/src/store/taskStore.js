import { defineStore } from 'pinia'
import axios from 'axios'

export const useTaskStore = defineStore('task', {
  state: () => ({
    goals: [], // 目标列表
    actions: [], // 行动列表
    completedGoals: [],
    completedActions: [],
    loading: false,
    error: null,
    editMode: false // 控制是否处于编辑模式
  }),
  
  getters: {
    // 按象限分组的目标
    goalsByQuadrant: (state) => {
      const quadrants = {
        q1: [], // 重要且紧急
        q2: [], // 重要不紧急
        q3: [], // 不重要但紧急
        q4: []  // 不重要不紧急
      }
      
      state.goals.forEach(goal => {
        if (goal.importance > 5 && goal.urgency > 5) {
          quadrants.q1.push(goal)
        } else if (goal.importance > 5 && goal.urgency <= 5) {
          quadrants.q2.push(goal)
        } else if (goal.importance <= 5 && goal.urgency > 5) {
          quadrants.q3.push(goal)
        } else {
          quadrants.q4.push(goal)
        }
      })
      
      return quadrants
    },
    
    // 按优先级排序的目标
    goalsByPriority: (state) => {
      return [...state.goals].sort((a, b) => b.priority - a.priority)
    },
    
    // 按所属目标分组的行动
    actionsByGoal: (state) => {
      const groups = {}
      state.actions.forEach(action => {
        if (!groups[action.goalId]) {
          groups[action.goalId] = []
        }
        groups[action.goalId].push(action)
      })
      return groups
    },
    
    // 为了保持向后兼容
    tasks: (state) => state.goals,
    completedTasks: (state) => [...state.completedGoals, ...state.completedActions].sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt)),
    tasksByQuadrant: (state) => {
      const quadrants = {
        q1: [], // 重要且紧急
        q2: [], // 重要不紧急
        q3: [], // 不重要但紧急
        q4: []  // 不重要不紧急
      }
      
      state.goals.forEach(task => {
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
    
    tasksByPriority: (state) => {
      return [...state.goals].sort((a, b) => b.priority - a.priority)
    }
  },
  
  actions: {
    // 切换编辑模式
    toggleEditMode() {
      this.editMode = !this.editMode
    },
    
    // 获取所有目标
    async fetchGoals() {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.get('/api/goals')
        this.goals = response.data
      } catch (error) {
        this.error = error.message || '获取目标失败'
        console.error('获取目标失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 获取所有行动
    async fetchActions() {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.get('/api/actions')
        this.actions = response.data
      } catch (error) {
        this.error = error.message || '获取行动失败'
        console.error('获取行动失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 获取目标的所有行动
    async fetchActionsByGoal(goalId) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.get(`/api/goals/${goalId}/actions`)
        return response.data
      } catch (error) {
        this.error = error.message || '获取行动失败'
        console.error('获取行动失败:', error)
        return []
      } finally {
        this.loading = false
      }
    },
    
    // 获取已完成目标
    async fetchCompletedGoals() {
      try {
        const response = await axios.get('/api/tasks/completed')
        this.completedGoals = response.data.filter(item => !item.goalId)
      } catch (error) {
        console.error('获取已完成目标失败:', error)
      }
    },
    
    // 获取已完成行动
    async fetchCompletedActions() {
      try {
        const response = await axios.get('/api/tasks/completed')
        this.completedActions = response.data.filter(item => item.goalId)
      } catch (error) {
        console.error('获取已完成行动失败:', error)
      }
    },
    
    // 添加目标
    async addGoal(goal) {
      this.loading = true
      this.error = null
      
      try {
        // 计算优先级
        goal.priority = goal.importance * 0.4 + goal.urgency * 0.6
        
        const response = await axios.post('/api/tasks', goal)
        this.goals.push(response.data)
        
        // 默认添加一个同名的行动
        if (goal.title) {
          await this.addAction({
            title: goal.title,
            description: goal.description,
            goalId: response.data.id
          })
        }
        
        return response.data
      } catch (error) {
        this.error = error.message || '添加目标失败'
        console.error('添加目标失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 添加行动
    async addAction(action) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.post('/api/actions', action)
        this.actions.push(response.data)
        return response.data
      } catch (error) {
        this.error = error.message || '添加行动失败'
        console.error('添加行动失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 更新目标
    async updateGoal(goal) {
      this.loading = true
      this.error = null
      
      try {
        // 计算优先级
        goal.priority = goal.importance * 0.4 + goal.urgency * 0.6
        
        const response = await axios.put(`/api/tasks/${goal.id}`, goal)
        const index = this.goals.findIndex(g => g.id === goal.id)
        if (index !== -1) {
          this.goals[index] = response.data
        }
      } catch (error) {
        this.error = error.message || '更新目标失败'
        console.error('更新目标失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 更新行动
    async updateAction(action) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.put(`/api/actions/${action.id}`, action)
        const index = this.actions.findIndex(a => a.id === action.id)
        if (index !== -1) {
          this.actions[index] = response.data
        }
      } catch (error) {
        this.error = error.message || '更新行动失败'
        console.error('更新行动失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 删除目标
    async deleteGoal(goalId) {
      this.loading = true
      this.error = null
      
      try {
        await axios.delete(`/api/tasks/${goalId}`)
        this.goals = this.goals.filter(goal => goal.id !== goalId)
        // 同时删除相关的行动
        this.actions = this.actions.filter(action => action.goalId !== goalId)
      } catch (error) {
        this.error = error.message || '删除目标失败'
        console.error('删除目标失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 删除行动
    async deleteAction(actionId) {
      this.loading = true
      this.error = null
      
      try {
        await axios.delete(`/api/actions/${actionId}`)
        this.actions = this.actions.filter(action => action.id !== actionId)
      } catch (error) {
        this.error = error.message || '删除行动失败'
        console.error('删除行动失败:', error)
      } finally {
        this.loading = false
      }
    },

    // 完成目标
    async completeGoal(goalId) {
      this.loading = true
      this.error = null
      
      try {
        const goal = this.goals.find(g => g.id === goalId)
        if (goal) {
          // 添加完成时间
          const completedGoal = {
            ...goal,
            completedAt: new Date().toISOString(),
            completed: true
          }
          
          // 发送到服务器
          await axios.patch(`/api/tasks/${goalId}`, { completed: true, completedAt: completedGoal.completedAt })
          
          // 从活动目标中移除，添加到已完成目标
          this.goals = this.goals.filter(g => g.id !== goalId)
          this.completedGoals.push(completedGoal)
        }
      } catch (error) {
        this.error = error.message || '完成目标失败'
        console.error('完成目标失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 完成行动
    async completeAction(actionId) {
      this.loading = true
      this.error = null
      
      try {
        const action = this.actions.find(a => a.id === actionId)
        if (action) {
          // 添加完成时间
          const completedAction = {
            ...action,
            completedAt: new Date().toISOString(),
            completed: true
          }
          
          // 发送到服务器
          await axios.patch(`/api/actions/${actionId}`, { completed: true, completedAt: completedAction.completedAt })
          
          // 从活动行动中移除，添加到已完成行动
          this.actions = this.actions.filter(a => a.id !== actionId)
          this.completedActions.push(completedAction)
        }
      } catch (error) {
        this.error = error.message || '完成行动失败'
        console.error('完成行动失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 标记/取消标记目标
    async toggleGoalMark(goalId) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.patch(`/api/goals/${goalId}/mark`)
        const index = this.goals.findIndex(g => g.id === goalId)
        if (index !== -1) {
          this.goals[index] = response.data
        }
      } catch (error) {
        this.error = error.message || '标记目标失败'
        console.error('标记目标失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 标记/取消标记行动
    async toggleActionMark(actionId) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.patch(`/api/actions/${actionId}/mark`)
        const index = this.actions.findIndex(a => a.id === actionId)
        if (index !== -1) {
          this.actions[index] = response.data
        }
      } catch (error) {
        this.error = error.message || '标记行动失败'
        console.error('标记行动失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 恢复目标
    async restoreGoal(goalId) {
      this.loading = true
      this.error = null
      
      try {
        const goal = this.completedGoals.find(g => g.id === goalId)
        if (goal) {
          // 移除完成标记
          const restoredGoal = {
            ...goal,
            completed: false,
            completedAt: null
          }
          
          // 发送到服务器
          await axios.patch(`/api/tasks/${goalId}`, { completed: false, completedAt: null })
          
          // 从已完成目标中移除，添加到活动目标
          this.completedGoals = this.completedGoals.filter(g => g.id !== goalId)
          this.goals.push(restoredGoal)
        }
      } catch (error) {
        this.error = error.message || '恢复目标失败'
        console.error('恢复目标失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 恢复行动
    async restoreAction(actionId) {
      this.loading = true
      this.error = null
      
      try {
        const action = this.completedActions.find(a => a.id === actionId)
        if (action) {
          // 移除完成标记
          const restoredAction = {
            ...action,
            completed: false,
            completedAt: null
          }
          
          // 发送到服务器
          await axios.patch(`/api/actions/${actionId}`, { completed: false, completedAt: null })
          
          // 从已完成行动中移除，添加到活动行动
          this.completedActions = this.completedActions.filter(a => a.id !== actionId)
          this.actions.push(restoredAction)
        }
      } catch (error) {
        this.error = error.message || '恢复行动失败'
        console.error('恢复行动失败:', error)
      } finally {
        this.loading = false
      }
    },

    // 永久删除目标
    async permanentlyDeleteGoal(goalId) {
      this.loading = true
      this.error = null
      
      try {
        await axios.delete(`/api/tasks/${goalId}`)
        this.completedGoals = this.completedGoals.filter(goal => goal.id !== goalId)
      } catch (error) {
        this.error = error.message || '永久删除目标失败'
        console.error('永久删除目标失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 永久删除行动
    async permanentlyDeleteAction(actionId) {
      this.loading = true
      this.error = null
      
      try {
        await axios.delete(`/api/actions/${actionId}`)
        this.completedActions = this.completedActions.filter(action => action.id !== actionId)
      } catch (error) {
        this.error = error.message || '永久删除行动失败'
        console.error('永久删除行动失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 为了保持向后兼容性，保留原有的任务方法
    async fetchTasks() {
      await this.fetchGoals()
      await this.fetchActions()
      await this.fetchCompletedGoals()
      await this.fetchCompletedActions()
    },
    
    async fetchCompletedTasks() {
      await this.fetchCompletedGoals()
      await this.fetchCompletedActions()
    },
    
    async addTask(task) {
      return this.addGoal(task)
    },
    
    async updateTask(task) {
      return this.updateGoal(task)
    },
    
    async deleteTask(taskId) {
      return this.deleteGoal(taskId)
    },
    
    async completeTask(taskId) {
      return this.completeGoal(taskId)
    },
    
    async restoreTask(taskId) {
      // 尝试恢复目标
      const goal = this.completedGoals.find(g => g.id === taskId)
      if (goal) {
        return this.restoreGoal(taskId)
      }
      // 尝试恢复行动
      return this.restoreAction(taskId)
    },
    
    async permanentlyDeleteTask(taskId) {
      // 尝试永久删除目标
      const goal = this.completedGoals.find(g => g.id === taskId)
      if (goal) {
        return this.permanentlyDeleteGoal(taskId)
      }
      // 尝试永久删除行动
      return this.permanentlyDeleteAction(taskId)
    }
  }
})