import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { TaskService, TaskFilters, TaskCreateData } from '@/services/taskService'
import { UserService } from '@/services/userService'
import { TaskStatusType } from '@/types/task.types'
import { toast } from 'sonner'
import { SUCCESS_MESSAGES, GAMIFICATION } from '@/constants'

// Query keys
export const TASK_KEYS = {
  all: ['tasks'] as const,
  lists: () => [...TASK_KEYS.all, 'list'] as const,
  list: (filters: TaskFilters) => [...TASK_KEYS.lists(), filters] as const,
  details: () => [...TASK_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...TASK_KEYS.details(), id] as const,
  stats: (userId: string) => [...TASK_KEYS.all, 'stats', userId] as const,
}

// Get tasks with filters
export function useTasks(
  workspaceId?: string,
  viewId?: string, 
  filters: TaskFilters = {}, 
  sortBy?: string,
  sortDirection?: 'asc' | 'desc'
) {
  return useQuery({
    queryKey: TASK_KEYS.list({ workspaceId, ...filters }),
    queryFn: () => TaskService.getTasks(workspaceId, viewId, filters, sortBy, sortDirection),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!workspaceId || !!viewId
  })
}

// Get single task
export function useTask(taskId: string) {
  return useQuery({
    queryKey: TASK_KEYS.detail(taskId),
    queryFn: () => TaskService.getTask(taskId),
    enabled: !!taskId,
  })
}

// Get task statistics
export function useTaskStats(userId: string, workspaceId?: string) {
  return useQuery({
    queryKey: TASK_KEYS.stats(userId),
    queryFn: () => TaskService.getTasksStats(userId, workspaceId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Create task mutation
export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, taskData }: { userId: string; taskData: TaskCreateData }) =>
      TaskService.createTask(userId, taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all })
      toast.success(SUCCESS_MESSAGES.TASK_CREATED)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

// Update task mutation
export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, updates }: { taskId: string; updates: Partial<TaskCreateData> }) =>
      TaskService.updateTask(taskId, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.detail(variables.taskId) })
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.lists() })
      toast.success(SUCCESS_MESSAGES.TASK_UPDATED)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

// Update task status with XP reward
export function useUpdateTaskStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ 
      taskId, 
      status, 
      workspaceId,
      userId 
    }: { 
      taskId: string; 
      status: TaskStatusType; 
      workspaceId: string;
      userId: string 
    }) => {
      await TaskService.updateTaskStatus(taskId, status, workspaceId)
      
      // Award XP for completing tasks
      if (status === 'DONE') {
        await UserService.addXP(userId, GAMIFICATION.XP_PER_TASK)
        await UserService.incrementTaskCount(userId)
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.detail(variables.taskId) })
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.stats(variables.userId) })
      
      if (variables.status === 'DONE') {
        toast.success('Задача выполнена! +' + GAMIFICATION.XP_PER_TASK + ' XP')
      } else {
        toast.success(SUCCESS_MESSAGES.TASK_UPDATED)
      }
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

// Delete task mutation
export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: TaskService.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.lists() })
      toast.success(SUCCESS_MESSAGES.TASK_DELETED)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

// Archive task mutation
export function useArchiveTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, isArchived }: { taskId: string; isArchived: boolean }) =>
      TaskService.archiveTask(taskId, isArchived),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.detail(variables.taskId) })
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.lists() })
      toast.success(variables.isArchived ? 'Задача архивирована' : 'Задача восстановлена')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

// Add comment mutation
export function useAddComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ 
      taskId, 
      userId, 
      content 
    }: { 
      taskId: string; 
      userId: string; 
      content: string 
    }) => TaskService.addComment(taskId, userId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.detail(variables.taskId) })
      toast.success('Комментарий добавлен')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

// Increment pomodoro count mutation
export function useIncrementPomodoro() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ 
      taskId, 
      userId 
    }: { 
      taskId: string; 
      userId: string 
    }) => {
      return Promise.all([
        TaskService.incrementPomodoroCount(taskId),
        UserService.addXP(userId, GAMIFICATION.XP_PER_POMODORO),
        UserService.incrementPomodoroCount(userId)
      ])
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.detail(variables.taskId) })
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.lists() })
      toast.success('Pomodoro завершён! +' + GAMIFICATION.XP_PER_POMODORO + ' XP')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

// Bulk update tasks mutation
export function useBulkUpdateTasks() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: TaskService.bulkUpdateTasks,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.lists() })
      toast.success('Задачи обновлены')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
