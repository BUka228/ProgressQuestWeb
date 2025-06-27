import { httpsCallable } from 'firebase/functions'
import { functions } from '@/lib/firebase'
import { 
  TaskDocument, 
  TaskStatusType, 
  TaskPriorityType, 
  CreateTaskPayload,
  UpdateTaskPayload,
  TaskFilters as TaskFiltersType,
  GetTasksResponse,
  CreateTaskResponse,
  UpdateTaskResponse,
  DeleteTaskResponse,
  UpdateTaskStatusPayload,
  SuccessResponse,
  GetTaskDetailsPayload,
  GetTaskDetailsResponse
} from '@/types/task.types'

// Cloud Functions
const createTaskFn = httpsCallable<CreateTaskPayload, CreateTaskResponse>(functions, 'createTask')
const getTasksFn = httpsCallable<{ workspaceId?: string; viewId?: string; filters?: TaskFiltersType; sortBy?: string; sortDirection?: 'asc' | 'desc' }, GetTasksResponse>(functions, 'getTasks')
const getTaskDetailsFn = httpsCallable<GetTaskDetailsPayload, GetTaskDetailsResponse>(functions, 'getTaskDetails')
const updateTaskFn = httpsCallable<UpdateTaskPayload, UpdateTaskResponse>(functions, 'updateTask')
const updateTaskStatusFn = httpsCallable<UpdateTaskStatusPayload, SuccessResponse>(functions, 'updateTaskStatus')
const deleteTaskFn = httpsCallable<{ taskId: string }, DeleteTaskResponse>(functions, 'deleteTask')

// Локальные интерфейсы для совместимости со старым кодом
export interface TaskFilters {
  workspaceId?: string
  status?: TaskStatusType[]
  priority?: TaskPriorityType[]
  tagsInclude?: string[]
  tagsExclude?: string[]
  assignee?: 'me' | 'unassigned' | string | null
  search?: string
  dueDateRange?: {
    start: string | null
    end: string | null
  } | null
}

export interface TaskCreateData {
  title: string
  description?: string
  workspaceId: string
  priority?: TaskPriorityType
  tags?: string[]
  dueDate?: string
  pomodoroEstimatedMinutes?: number
  approachParams?: {
    calendar?: {
      eventId: string | null
      isAllDay: boolean
      recurrenceRule: string | null
    }
    gtd?: {
      context: string | null
      nextAction: boolean
      projectLink: string | null
      waitingFor: string | null
    }
    eisenhower?: {
      urgency: number
      importance: number
    }
    frog?: {
      isFrog: boolean
      difficulty: 'EASY' | 'MEDIUM' | 'HARD'
    }
  } | null
}

export class TaskService {
  // Создание новой задачи
  static async createTask(
    userId: string,
    taskData: TaskCreateData
  ): Promise<TaskDocument> {
    try {
      const payload: CreateTaskPayload = {
        title: taskData.title,
        description: taskData.description || null,
        workspaceId: taskData.workspaceId,
        priority: taskData.priority || 'MEDIUM',
        tags: taskData.tags || [],
        dueDate: taskData.dueDate || null,
        pomodoroEstimatedMinutes: taskData.pomodoroEstimatedMinutes || null,
        approachParams: taskData.approachParams || null
      }

      const result = await createTaskFn(payload)
      return result.data.task
    } catch (error: any) {
      console.error('Error creating task:', error)
      throw new Error(error.message || 'Failed to create task')
    }
  }

  // Получение задачи по ID
  static async getTask(taskId: string): Promise<TaskDocument | null> {
    try {
      const result = await getTaskDetailsFn({ taskId })
      return result.data.task
    } catch (error: any) {
      console.error('Error getting task:', error)
      if (error.code === 'functions/not-found') {
        return null
      }
      throw new Error(error.message || 'Failed to get task')
    }
  }

  // Получение списка задач с фильтрами
  static async getTasks(
    workspaceId?: string,
    viewId?: string,
    filters?: TaskFilters,
    sortBy?: string,
    sortDirection?: 'asc' | 'desc'
  ): Promise<TaskDocument[]> {
    try {
      const payload = {
        workspaceId,
        viewId,
        filters: filters ? {
          status: filters.status,
          priority: filters.priority,
          tagsInclude: filters.tagsInclude,
          tagsExclude: filters.tagsExclude,
          assignee: filters.assignee,
          search: filters.search,
          dueDateRange: filters.dueDateRange ? {
            start: filters.dueDateRange.start,
            end: filters.dueDateRange.end,
            type: 'due' as const
          } : null
        } as TaskFiltersType : undefined,
        sortBy,
        sortDirection
      }

      const result = await getTasksFn(payload)
      return result.data.tasks
    } catch (error: any) {
      console.error('Error getting tasks:', error)
      throw new Error(error.message || 'Failed to get tasks')
    }
  }

  // Обновление задачи
  static async updateTask(taskId: string, updates: Partial<TaskCreateData>): Promise<TaskDocument> {
    try {
      const payload: UpdateTaskPayload = {
        taskId,
        title: updates.title,
        description: updates.description,
        priority: updates.priority,
        dueDate: updates.dueDate,
        tags: updates.tags,
        pomodoroEstimatedMinutes: updates.pomodoroEstimatedMinutes,
        approachParams: updates.approachParams
      }

      const result = await updateTaskFn(payload)
      return result.data.task
    } catch (error: any) {
      console.error('Error updating task:', error)
      throw new Error(error.message || 'Failed to update task')
    }
  }

  // Обновление статуса задачи
  static async updateTaskStatus(
    taskId: string, 
    status: TaskStatusType, 
    workspaceId: string
  ): Promise<void> {
    try {
      const payload: UpdateTaskStatusPayload = {
        taskId,
        newStatus: status,
        workspaceId
      }

      await updateTaskStatusFn(payload)
    } catch (error: any) {
      console.error('Error updating task status:', error)
      throw new Error(error.message || 'Failed to update task status')
    }
  }

  // Удаление задачи
  static async deleteTask(taskId: string): Promise<void> {
    try {
      await deleteTaskFn({ taskId })
    } catch (error: any) {
      console.error('Error deleting task:', error)
      throw new Error(error.message || 'Failed to delete task')
    }
  }

  // Получение статистики задач (заглушка для совместимости)
  static async getTasksStats(userId: string, workspaceId?: string): Promise<{
    total: number
    completed: number
    inProgress: number
    overdue: number
  }> {
    try {
      const tasks = await this.getTasks(workspaceId)
      
      const now = new Date()
      const stats = {
        total: tasks.length,
        completed: tasks.filter(task => task.status === 'DONE').length,
        inProgress: tasks.filter(task => task.status === 'IN_PROGRESS').length,
        overdue: tasks.filter(task => {
          if (!task.dueDate || task.status === 'DONE') return false
          const dueDate = new Date(task.dueDate)
          return dueDate < now
        }).length,
      }

      return stats
    } catch (error: any) {
      console.error('Error getting task stats:', error)
      throw new Error(error.message || 'Failed to get task stats')
    }
  }

  // === DEPRECATED METHODS (для совместимости) ===
  
  static async archiveTask(taskId: string, isArchived: boolean): Promise<void> {
    console.warn('archiveTask is deprecated and not implemented with Cloud Functions')
  }

  static async addComment(taskId: string, userId: string, content: string): Promise<void> {
    console.warn('addComment is deprecated. Use subtasks/comments Cloud Functions instead')
  }

  static async incrementPomodoroCount(taskId: string): Promise<void> {
    console.warn('incrementPomodoroCount is deprecated. Use pomodoro Cloud Functions instead')
  }

  static async bulkUpdateTasks(updates: Array<{ id: string; data: Partial<any> }>): Promise<void> {
    console.warn('bulkUpdateTasks is not implemented with Cloud Functions')
  }
}
