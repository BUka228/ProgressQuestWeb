import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import workspaceService, {
  CreateWorkspacePayload,
  UpdateWorkspacePayload,
  WorkspaceClientDto
} from '@/services/workspaceService'

// Query keys для кэширования
export const workspaceKeys = {
  all: ['workspaces'] as const,
  lists: () => [...workspaceKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...workspaceKeys.lists(), { filters }] as const,
  details: () => [...workspaceKeys.all, 'detail'] as const,
  detail: (id: string) => [...workspaceKeys.details(), id] as const,
}

/**
 * Хук для получения списка рабочих пространств пользователя
 */
export function useWorkspaces() {
  return useQuery({
    queryKey: workspaceKeys.lists(),
    queryFn: () => workspaceService.getUserWorkspaces(),
    staleTime: 5 * 60 * 1000, // 5 минут
    retry: (failureCount, error: any) => {
      // Не повторяем запрос при ошибках авторизации
      if (error?.message?.includes('не авторизован')) return false
      return failureCount < 2
    },
  })
}

/**
 * Хук для получения деталей конкретного рабочего пространства
 */
export function useWorkspaceDetails(workspaceId: string, enabled = true) {
  return useQuery({
    queryKey: workspaceKeys.detail(workspaceId),
    queryFn: () => workspaceService.getWorkspaceDetails(workspaceId),
    enabled: !!workspaceId && enabled,
    staleTime: 2 * 60 * 1000, // 2 минуты
    retry: (failureCount, error: any) => {
      if (error?.message?.includes('не авторизован')) return false
      if (error?.message?.includes('не найден')) return false
      return failureCount < 2
    },
  })
}

/**
 * Хук для создания нового рабочего пространства
 */
export function useCreateWorkspace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateWorkspacePayload) =>
      workspaceService.createWorkspace(payload),
    onSuccess: (data) => {
      // Обновляем список рабочих пространств
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() })
      
      // Добавляем новое рабочее пространство в кэш деталей
      queryClient.setQueryData(
        workspaceKeys.detail(data.workspace.id),
        { workspace: data.workspace }
      )

      // Показываем уведомление об успехе
      toast.success('Рабочее пространство успешно создано!', {
        description: `"${data.workspace.name}" готово к использованию`,
      })
    },
    onError: (error: Error) => {
      console.error('Ошибка создания рабочего пространства:', error)
      toast.error('Не удалось создать рабочее пространство', {
        description: error.message,
      })
    },
  })
}

/**
 * Хук для обновления рабочего пространства
 */
export function useUpdateWorkspace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateWorkspacePayload) =>
      workspaceService.updateWorkspace(payload),
    onSuccess: (data, variables) => {
      // Обновляем кэш деталей рабочего пространства
      queryClient.setQueryData(
        workspaceKeys.detail(variables.workspaceId),
        { workspace: data.updatedWorkspace }
      )

      // Обновляем список рабочих пространств
      queryClient.setQueryData(
        workspaceKeys.lists(),
        (oldData: any) => {
          if (!oldData?.workspaces) return oldData
          
          return {
            ...oldData,
            workspaces: oldData.workspaces.map((workspace: WorkspaceClientDto) =>
              workspace.id === variables.workspaceId
                ? data.updatedWorkspace
                : workspace
            ),
          }
        }
      )

      // Показываем уведомление об успехе
      toast.success('Рабочее пространство обновлено!', {
        description: `"${data.updatedWorkspace.name}" сохранено`,
      })
    },
    onError: (error: Error) => {
      console.error('Ошибка обновления рабочего пространства:', error)
      toast.error('Не удалось обновить рабочее пространство', {
        description: error.message,
      })
    },
  })
}

/**
 * Хук для удаления рабочего пространства
 */
export function useDeleteWorkspace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (workspaceId: string) =>
      workspaceService.deleteWorkspace(workspaceId),
    onSuccess: (data, workspaceId) => {
      // Удаляем из кэша деталей
      queryClient.removeQueries({
        queryKey: workspaceKeys.detail(workspaceId),
      })

      // Обновляем список рабочих пространств
      queryClient.setQueryData(
        workspaceKeys.lists(),
        (oldData: any) => {
          if (!oldData?.workspaces) return oldData
          
          return {
            ...oldData,
            workspaces: oldData.workspaces.filter(
              (workspace: WorkspaceClientDto) => workspace.id !== workspaceId
            ),
          }
        }
      )

      // Показываем уведомление об успехе
      toast.success('Рабочее пространство удалено', {
        description: data.message,
      })
    },
    onError: (error: Error) => {
      console.error('Ошибка удаления рабочего пространства:', error)
      toast.error('Не удалось удалить рабочее пространство', {
        description: error.message,
      })
    },
  })
}

/**
 * Хук для предзагрузки деталей рабочего пространства
 */
export function usePrefetchWorkspaceDetails() {
  const queryClient = useQueryClient()

  return (workspaceId: string) => {
    queryClient.prefetchQuery({
      queryKey: workspaceKeys.detail(workspaceId),
      queryFn: () => workspaceService.getWorkspaceDetails(workspaceId),
      staleTime: 2 * 60 * 1000,
    })
  }
}

/**
 * Вспомогательный хук для работы с активным рабочим пространством
 */
export function useActiveWorkspace(workspaceId?: string | null) {
  const { data: workspacesData } = useWorkspaces()
  const { data: workspaceDetails } = useWorkspaceDetails(
    workspaceId || '',
    !!workspaceId
  )

  // Если передан ID, возвращаем детали конкретного пространства
  if (workspaceId && workspaceDetails) {
    return {
      workspace: workspaceDetails.workspace,
      isLoading: false,
      error: null,
    }
  }

  // Иначе возвращаем первое личное пространство из списка
  const personalWorkspace = workspacesData?.workspaces?.find(
    (ws) => ws.isPersonal
  )

  return {
    workspace: personalWorkspace || null,
    isLoading: !workspacesData,
    error: null,
  }
}
