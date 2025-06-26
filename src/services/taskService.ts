import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Task, TaskStatus, TaskPriority, PaginatedResponse } from '@/types'
import { handleFirebaseError } from './firebase'
import { generateId } from '@/utils/helpers'

const TASKS_COLLECTION = 'tasks'

export interface TaskFilters {
  workspaceId?: string
  projectId?: string
  assigneeId?: string
  status?: TaskStatus
  priority?: TaskPriority
  tags?: string[]
  dueDate?: Date
  isArchived?: boolean
}

export interface TaskCreateData {
  title: string
  description?: string
  workspaceId: string
  projectId?: string
  assigneeId?: string
  priority: TaskPriority
  tags?: string[]
  dueDate?: Date
  estimatedDuration?: number
  parentId?: string
}

export class TaskService {
  // Create a new task
  static async createTask(
    userId: string,
    taskData: TaskCreateData
  ): Promise<string> {
    try {
      const taskRef = collection(db, TASKS_COLLECTION)
      
      const task: any = {
        title: taskData.title,
        workspaceId: taskData.workspaceId,
        createdById: userId,
        status: 'TODO',
        priority: taskData.priority,
        tags: taskData.tags || [],
        createdAt: new Date(),
        updatedAt: new Date(),
        pomodoroCount: 0,
        attachments: [],
        comments: [],
        dependencies: [],
        customFields: {},
        isArchived: false,
      }

      if (taskData.description !== undefined) task.description = taskData.description
      if (taskData.projectId !== undefined) task.projectId = taskData.projectId
      if (taskData.assigneeId !== undefined) task.assigneeId = taskData.assigneeId
      // --- ИСПРАВЛЕНО ЗДЕСЬ ---
      if (taskData.parentId !== undefined) task.parentId = taskData.parentId
      // ------------------------
      if (taskData.dueDate) task.dueDate = new Date(taskData.dueDate)
      if (taskData.estimatedDuration !== undefined) task.estimatedDuration = taskData.estimatedDuration

      const docRef = await addDoc(taskRef, {
        ...task,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      return docRef.id
    } catch (error) {
      throw new Error(handleFirebaseError(error))
    }
  }

  // Get task by ID
  static async getTask(taskId: string): Promise<Task | null> {
    try {
      const taskRef = doc(db, TASKS_COLLECTION, taskId)
      const taskSnap = await getDoc(taskRef)
      
      if (taskSnap.exists()) {
        const data = taskSnap.data()
        return {
          id: taskSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          dueDate: data.dueDate?.toDate(),
          completedAt: data.completedAt?.toDate(),
        } as Task
      }
      
      return null
    } catch (error) {
      throw new Error(handleFirebaseError(error))
    }
  }

  // Get tasks with filters and pagination
  static async getTasks(
    filters: TaskFilters = {},
    pageSize: number = 20,
    lastDoc?: any
  ): Promise<PaginatedResponse<Task>> {
    try {
      let q = query(collection(db, TASKS_COLLECTION))

      // Apply filters
      if (filters.workspaceId) {
        q = query(q, where('workspaceId', '==', filters.workspaceId))
      }
      if (filters.projectId) {
        q = query(q, where('projectId', '==', filters.projectId))
      }
      if (filters.assigneeId) {
        q = query(q, where('assigneeId', '==', filters.assigneeId))
      }
      if (filters.status) {
        q = query(q, where('status', '==', filters.status))
      }
      if (filters.priority) {
        q = query(q, where('priority', '==', filters.priority))
      }
      if (filters.isArchived !== undefined) {
        q = query(q, where('isArchived', '==', filters.isArchived))
      }

      // Order by creation date (newest first)
      q = query(q, orderBy('createdAt', 'desc'))

      // Pagination
      if (lastDoc) {
        q = query(q, startAfter(lastDoc))
      }
      q = query(q, limit(pageSize + 1)) // Get one extra to check if there are more

      const querySnapshot = await getDocs(q)
      const tasks: Task[] = []
      const docs = querySnapshot.docs

      docs.slice(0, pageSize).forEach((doc) => {
        const data = doc.data()
        tasks.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          dueDate: data.dueDate?.toDate(),
          completedAt: data.completedAt?.toDate(),
        } as Task)
      })

      const hasNext = docs.length > pageSize
      const hasPrev = !!lastDoc

      return {
        items: tasks,
        total: tasks.length, // Note: Firestore doesn't provide total count efficiently
        page: 1, // We don't track page numbers with cursor pagination
        limit: pageSize,
        hasNext,
        hasPrev,
      }
    } catch (error) {
      throw new Error(handleFirebaseError(error))
    }
  }

  // Update task
  static async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    try {
      const taskRef = doc(db, TASKS_COLLECTION, taskId)
      // Убираем undefined поля из updates
      const cleanUpdates: any = {}
      Object.keys(updates).forEach(key => {
        if (updates[key as keyof Task] !== undefined) {
          cleanUpdates[key] = updates[key as keyof Task]
        }
      })
      
      await updateDoc(taskRef, {
        ...cleanUpdates,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      throw new Error(handleFirebaseError(error))
    }
  }

  // Update task status
  static async updateTaskStatus(taskId: string, status: TaskStatus): Promise<void> {
    try {
      const taskRef = doc(db, TASKS_COLLECTION, taskId)
      const updates: any = {
        status,
        updatedAt: serverTimestamp(),
      }

      if (status === 'done') {
        updates.completedAt = serverTimestamp()
      }

      await updateDoc(taskRef, updates)
    } catch (error) {
      throw new Error(handleFirebaseError(error))
    }
  }

  // Delete task
  static async deleteTask(taskId: string): Promise<void> {
    try {
      const taskRef = doc(db, TASKS_COLLECTION, taskId)
      await deleteDoc(taskRef)
    } catch (error) {
      throw new Error(handleFirebaseError(error))
    }
  }

  // Archive/Unarchive task
  static async archiveTask(taskId: string, isArchived: boolean): Promise<void> {
    try {
      const taskRef = doc(db, TASKS_COLLECTION, taskId)
      await updateDoc(taskRef, {
        isArchived,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      throw new Error(handleFirebaseError(error))
    }
  }

  // Add comment to task
  static async addComment(
    taskId: string,
    userId: string,
    content: string
  ): Promise<void> {
    try {
      const taskRef = doc(db, TASKS_COLLECTION, taskId)
      const task = await this.getTask(taskId)
      
      if (!task) throw new Error('Task not found')

      const newComment = {
        id: generateId(),
        content,
        authorId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        isEdited: false,
        mentions: [], // TODO: Extract mentions from content
      }

      const updatedComments = [...task.comments, newComment]

      await updateDoc(taskRef, {
        comments: updatedComments,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      throw new Error(handleFirebaseError(error))
    }
  }

  // Increment pomodoro count
  static async incrementPomodoroCount(taskId: string): Promise<void> {
    try {
      const taskRef = doc(db, TASKS_COLLECTION, taskId)
      const task = await this.getTask(taskId)
      
      if (!task) throw new Error('Task not found')

      await updateDoc(taskRef, {
        pomodoroCount: task.pomodoroCount + 1,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      throw new Error(handleFirebaseError(error))
    }
  }

  // Bulk update tasks
  static async bulkUpdateTasks(
    updates: Array<{ id: string; data: Partial<Task> }>
  ): Promise<void> {
    try {
      const batch = writeBatch(db)

      updates.forEach(({ id, data }) => {
        const taskRef = doc(db, TASKS_COLLECTION, id)
        batch.update(taskRef, {
          ...data,
          updatedAt: serverTimestamp(),
        })
      })

      await batch.commit()
    } catch (error) {
      throw new Error(handleFirebaseError(error))
    }
  }

  // Get user's tasks statistics
  static async getTasksStats(userId: string, workspaceId?: string): Promise<{
    total: number
    completed: number
    inProgress: number
    overdue: number
  }> {
    try {
      const filters: TaskFilters = { isArchived: false }
      if (workspaceId) filters.workspaceId = workspaceId
      
      // Get user's assigned tasks
      const assignedTasks = await this.getTasks({ ...filters, assigneeId: userId }, 1000)
      
      // Get tasks created by user
      const createdQuery = query(
        collection(db, TASKS_COLLECTION),
        where('createdById', '==', userId),
        where('isArchived', '==', false)
      )
      const createdSnapshot = await getDocs(createdQuery)
      
      const allTasks = [
        ...assignedTasks.items,
        ...createdSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
          dueDate: doc.data().dueDate?.toDate(),
          completedAt: doc.data().completedAt?.toDate(),
        } as Task))
      ]

      // Remove duplicates
      const uniqueTasks = allTasks.filter((task, index, self) => 
        index === self.findIndex(t => t.id === task.id)
      )

      const now = new Date()
      const stats = {
        total: uniqueTasks.length,
        completed: uniqueTasks.filter(task => task.status === 'done').length,
        inProgress: uniqueTasks.filter(task => task.status === 'in_progress').length,
        overdue: uniqueTasks.filter(task => 
          task.dueDate && task.dueDate < now && task.status !== 'done'
        ).length,
      }

      return stats
    } catch (error) {
      throw new Error(handleFirebaseError(error))
    }
  }
}
