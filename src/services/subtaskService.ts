import { httpsCallable } from 'firebase/functions'
import { functions } from '@/lib/firebase'

export interface SubtaskDocument {
  id: string
  title: string
  completed: boolean
  order: number
  createdAt: string
}

export interface CreateSubtaskPayload {
  parentTaskId: string
  title: string
}

export interface UpdateSubtaskPayload {
  parentTaskId: string
  subtaskId: string
  title?: string
  completed?: boolean
  order?: number
}

export interface DeleteSubtaskPayload {
  parentTaskId: string
  subtaskId: string
}

export interface SuccessResponse {
  success: boolean
  message?: string
}

// Cloud Functions
const addSubtaskFn = httpsCallable<CreateSubtaskPayload, SubtaskDocument>(functions, 'addSubtask')
const deleteSubtaskFn = httpsCallable<DeleteSubtaskPayload, SuccessResponse>(functions, 'deleteSubtask')

export class SubtaskService {
  // Создание подзадачи
  static async createSubtask(parentTaskId: string, title: string): Promise<SubtaskDocument> {
    try {
      const payload: CreateSubtaskPayload = {
        parentTaskId,
        title
      }

      const result = await addSubtaskFn(payload)
      return result.data
    } catch (error: any) {
      console.error('Error creating subtask:', error)
      throw new Error(error.message || 'Failed to create subtask')
    }
  }

  // Удаление подзадачи
  static async deleteSubtask(parentTaskId: string, subtaskId: string): Promise<void> {
    try {
      const payload: DeleteSubtaskPayload = {
        parentTaskId,
        subtaskId
      }

      await deleteSubtaskFn(payload)
    } catch (error: any) {
      console.error('Error deleting subtask:', error)
      throw new Error(error.message || 'Failed to delete subtask')
    }
  }

  // Обновление подзадачи (заглушка для будущего расширения)
  static async updateSubtask(
    parentTaskId: string, 
    subtaskId: string, 
    updates: Partial<{ title: string; completed: boolean; order: number }>
  ): Promise<void> {
    console.warn('updateSubtask is not implemented yet')
    throw new Error('updateSubtask is not implemented yet')
  }
}
