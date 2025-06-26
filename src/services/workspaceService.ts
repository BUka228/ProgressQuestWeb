import { 
  getFunctions, 
  httpsCallable, 
  connectFunctionsEmulator 
} from 'firebase/functions'
import { getAuth } from 'firebase/auth'

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
  private functions = getFunctions()
  private static isEmulatorConnected = false
  
  constructor() {
    // Подключение к эмулятору в режиме разработки
    if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true') {
      try {
        if (!WorkspaceService.isEmulatorConnected) {
          connectFunctionsEmulator(this.functions, 'localhost', 5001)
          WorkspaceService.isEmulatorConnected = true
          console.log('✅ Functions emulator connected')
        }
      } catch (error) {
        console.warn('⚠️ Functions emulator connection failed:', error)
        console.warn('Make sure Firebase emulator is running: firebase emulators:start')
        console.warn('To start emulators run: npm run emulators')
      }
    }
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
        this.functions,
        'createWorkspace'
      )

      const result = await createWorkspaceFunction(payload)
      return result.data
    } catch (error: any) {
      console.error('Ошибка создания рабочего пространства:', error)
      throw new Error(error.message || 'Не удалось создать рабочее пространство')
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
        this.functions,
        'getUserWorkspaces'
      )

      const result = await getUserWorkspacesFunction()
      return result.data
    } catch (error: any) {
      console.error('Ошибка получения рабочих пространств:', error)
      throw new Error(error.message || 'Не удалось загрузить рабочие пространства')
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
      >(this.functions, 'getWorkspaceDetails')

      const result = await getWorkspaceDetailsFunction({ workspaceId })
      return result.data
    } catch (error: any) {
      console.error('Ошибка получения деталей рабочего пространства:', error)
      throw new Error(error.message || 'Не удалось загрузить детали рабочего пространства')
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
        this.functions,
        'updateWorkspace'
      )

      const result = await updateWorkspaceFunction(payload)
      return result.data
    } catch (error: any) {
      console.error('Ошибка обновления рабочего пространства:', error)
      throw new Error(error.message || 'Не удалось обновить рабочее пространство')
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
      >(this.functions, 'deleteWorkspace')

      const result = await deleteWorkspaceFunction({ workspaceId })
      return result.data
    } catch (error: any) {
      console.error('Ошибка удаления рабочего пространства:', error)
      throw new Error(error.message || 'Не удалось удалить рабочее пространство')
    }
  }
}

// Экспортируем единственный экземпляр сервиса
export const workspaceService = new WorkspaceService()
export default workspaceService
