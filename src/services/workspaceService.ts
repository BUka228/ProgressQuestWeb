import { httpsCallable } from 'firebase/functions'
import { getAuth } from 'firebase/auth'
// Импортируем наш сконфигурированный инстанс functions
import { functions } from '@/lib/firebase'

// Типы для workspace API
export interface CreateWorkspacePayload {
  name: string
  description?: string | null
  isPersonal: boolean
  teamId?: string | null
  activeApproach?: string
  defaultTags?: string[]
  settings?: { [key: string]: any }
}

export interface UpdateWorkspacePayload {
  workspaceId: string
  name?: string
  description?: string | null
  activeApproach?: string
  defaultTags?: string[]
  settings?: { [key: string]: any }
}

export interface WorkspaceClientDto {
  id: string
  name: string
  description: string | null
  ownerUid: string
  isPersonal: boolean
  teamId: string | null
  createdAt: string
  updatedAt: string
  activeApproach: string
  defaultTags: string[]
  settings: { [key: string]: any }
  currentUserWorkspaceRole?: 'owner' | 'admin' | 'manager' | 'editor' | 'member' | 'viewer' | null
}

export interface CreateWorkspaceResponse {
  workspace: WorkspaceClientDto
}

export interface GetUserWorkspacesResponse {
  workspaces: WorkspaceClientDto[]
}

export interface GetWorkspaceDetailsResponse {
  workspace: WorkspaceClientDto
}

export interface UpdateWorkspaceResponse {
  success: boolean
  updatedWorkspace: WorkspaceClientDto
}

export interface DeleteWorkspaceResponse {
  success: boolean
  message: string
}

class WorkspaceService {
  constructor() {
    console.log('✅ WorkspaceService initialized for production with europe-west1 region')
  }

  /**
   * Создание нового рабочего пространства
   */
  async createWorkspace(payload: CreateWorkspacePayload): Promise<CreateWorkspaceResponse> {
    try {
      const auth = getAuth()
      if (!auth.currentUser) {
        throw new Error('Пользователь не авторизован')
      }

      const createWorkspaceFunction = httpsCallable<CreateWorkspacePayload, CreateWorkspaceResponse>(
        functions,
        'createWorkspace'
      )

      const result = await createWorkspaceFunction(payload)
      return result.data
    } catch (error: any) {
      console.error('Ошибка создания рабочего пространства:', error)
      const errorMessage = this.getErrorMessage(error)
      throw new Error(errorMessage)
    }
  }

  /**
   * Получение списка рабочих пространств пользователя
   */
  async getUserWorkspaces(): Promise<GetUserWorkspacesResponse> {
    try {
      const auth = getAuth()
      if (!auth.currentUser) {
        throw new Error('Пользователь не авторизован')
      }

      const getUserWorkspacesFunction = httpsCallable<void, GetUserWorkspacesResponse>(
        functions,
        'getUserWorkspaces'
      )

      const result = await getUserWorkspacesFunction()
      return result.data
    } catch (error: any) {
      console.error('Ошибка получения рабочих пространств:', error)
      const errorMessage = this.getErrorMessage(error)
      throw new Error(errorMessage)
    }
  }

  /**
   * Получение деталей рабочего пространства
   */
  async getWorkspaceDetails(workspaceId: string): Promise<GetWorkspaceDetailsResponse> {
    try {
      const auth = getAuth()
      if (!auth.currentUser) {
        throw new Error('Пользователь не авторизован')
      }

      const getWorkspaceDetailsFunction = httpsCallable<
        { workspaceId: string },
        GetWorkspaceDetailsResponse
      >(functions, 'getWorkspaceDetails')

      const result = await getWorkspaceDetailsFunction({ workspaceId })
      return result.data
    } catch (error: any) {
      console.error('Ошибка получения деталей рабочего пространства:', error)
      const errorMessage = this.getErrorMessage(error)
      throw new Error(errorMessage)
    }
  }

  /**
   * Обновление рабочего пространства
   */
  async updateWorkspace(payload: UpdateWorkspacePayload): Promise<UpdateWorkspaceResponse> {
    try {
      const auth = getAuth()
      if (!auth.currentUser) {
        throw new Error('Пользователь не авторизован')
      }

      const updateWorkspaceFunction = httpsCallable<UpdateWorkspacePayload, UpdateWorkspaceResponse>(
        functions,
        'updateWorkspace'
      )

      const result = await updateWorkspaceFunction(payload)
      return result.data
    } catch (error: any) {
      console.error('Ошибка обновления рабочего пространства:', error)
      const errorMessage = this.getErrorMessage(error)
      throw new Error(errorMessage)
    }
  }

  /**
   * Удаление рабочего пространства
   */
  async deleteWorkspace(workspaceId: string): Promise<DeleteWorkspaceResponse> {
    try {
      const auth = getAuth()
      if (!auth.currentUser) {
        throw new Error('Пользователь не авторизован')
      }

      const deleteWorkspaceFunction = httpsCallable<
        { workspaceId: string },
        DeleteWorkspaceResponse
      >(functions, 'deleteWorkspace')

      const result = await deleteWorkspaceFunction({ workspaceId })
      return result.data
    } catch (error: any) {
      console.error('Ошибка удаления рабочего пространства:', error)
      const errorMessage = this.getErrorMessage(error)
      throw new Error(errorMessage)
    }
  }
}

// Экспортируем единственный экземпляр сервиса
export const workspaceService = new WorkspaceService()
export default workspaceService
