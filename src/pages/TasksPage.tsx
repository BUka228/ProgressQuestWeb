import React, { useState } from 'react'
import { useCreateTask, useTasks } from '@/hooks/useTasks'
import { TaskModal } from '@/components/TaskModal'
import { TaskCard } from '@/components/TaskCard'
import { TaskDocument, CreateTaskPayload } from '@/types/task.types'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { useAuth } from '@/contexts/AuthContext' // <-- 1. ИМПОРТИРУЕМ useAuth
import { toast } from 'sonner' // <-- 2. ИМПОРТИРУЕМ toast для ошибок

export const TasksPage = () => {
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const { currentWorkspace } = useWorkspaceStore()
  const { data: tasksData, isLoading, error } = useTasks(currentWorkspace?.id)
  const createTaskMutation = useCreateTask()
  const { currentUser } = useAuth() // <-- 3. ПОЛУЧАЕМ ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ

  const handleCreateTask = (taskData: CreateTaskPayload) => {
    // --- 4. ИСПРАВЛЕННАЯ ЛОГИКА ---
    if (!currentUser) {
      toast.error("Вы должны быть авторизованы, чтобы создавать задачи.");
      return;
    }

    if (!taskData.workspaceId) {
       toast.error("Не выбрано рабочее пространство. Пожалуйста, выберите пространство в шапке сайта.");
       return;
    }
    
    // Передаем объект правильной структуры
    createTaskMutation.mutate({ userId: currentUser.uid, taskData });
    // --- КОНЕЦ ИСПРАВЛЕНИЙ ---
  }

  const filteredTasks = tasksData?.tasks.filter(task => {
    if (statusFilter === 'all') return true
    if (statusFilter === 'todo') return task.status === 'TODO'
    if (statusFilter === 'in_progress') return task.status === 'IN_PROGRESS'
    if (statusFilter === 'done') return task.status === 'DONE'
    return true
  }) || []

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 drop-shadow-sm">Задачи</h1>
        <button
          onClick={() => setIsCreateTaskModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md transition-all duration-200 hover:shadow-lg"
        >
          + Новая задача
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <div className="flex space-x-4 mb-6">
            <button 
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === 'all' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Все ({tasksData?.tasks.length || 0})
            </button>
            <button 
              onClick={() => setStatusFilter('todo')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === 'todo' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📋 К выполнению ({tasksData?.tasks.filter(t => t.status === 'TODO').length || 0})
            </button>
            <button 
              onClick={() => setStatusFilter('in_progress')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === 'in_progress' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ⚡ В работе ({tasksData?.tasks.filter(t => t.status === 'IN_PROGRESS').length || 0})
            </button>
            <button 
              onClick={() => setStatusFilter('done')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === 'done' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ✅ Выполнено ({tasksData?.tasks.filter(t => t.status === 'DONE').length || 0})
            </button>
          </div>

          {isLoading ? (
            <p className="text-center py-12">Загружаем задачи...</p>
          ) : error ? (
            <p className="text-center py-12 text-red-600">Ошибка загрузки задач</p>
          ) : tasksData?.tasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-slate-500 text-lg">Задач пока нет</p>
              <p className="text-slate-400 mt-2">Создайте свою первую задачу, чтобы начать</p>
              <button
                onClick={() => setIsCreateTaskModalOpen(true)}
                className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Создать первую задачу
              </button>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-slate-500 text-lg">Нет задач с выбранным статусом</p>
              <p className="text-slate-400 mt-2">Попробуйте изменить фильтр или создать новую задачу</p>
            </div>
          ) : (
            <div>
              {filteredTasks.map((task: TaskDocument) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  variant="default"
                  userId={currentUser?.uid}
                  workspaceId={currentWorkspace?.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <TaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        onSubmit={handleCreateTask}
        mode="create"
      />
    </div>
  )
}
