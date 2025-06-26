import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { TaskDocument, CreateTaskPayload, TaskPriorityType } from '@/types/task.types'
import { useWorkspaceStore } from '@/stores/workspaceStore'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (taskData: CreateTaskPayload) => void
  task?: TaskDocument | null
  mode: 'create' | 'edit'
}

interface TaskFormData {
  title: string
  description: string
  priority: TaskPriorityType
  dueDate: string
  tags: string[]
  pomodoroEstimatedMinutes: number | null
  pomodoroEstimatedCycles: number | null
}

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: '🟢 Низкий', description: 'Можно отложить' },
  { value: 'MEDIUM', label: '🟡 Средний', description: 'Обычная задача' },
  { value: 'HIGH', label: '🟠 Высокий', description: 'Важная задача' },
  { value: 'CRITICAL', label: '🔴 Критический', description: 'Срочно!' },
] as const

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  task,
  mode,
}) => {
  const { currentWorkspace } = useWorkspaceStore()
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'MEDIUM',
    dueDate: '',
    tags: [],
    pomodoroEstimatedMinutes: null,
    pomodoroEstimatedCycles: null,
  })

  const [tagInput, setTagInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Заполняем форму данными task при редактировании
  useEffect(() => {
    if (mode === 'edit' && task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        tags: task.tags || [],
        pomodoroEstimatedMinutes: task.pomodoroEstimatedMinutes,
        pomodoroEstimatedCycles: task.pomodoroEstimatedCycles,
      })
    } else if (mode === 'create') {
      // Сброс формы для создания новой задачи
      setFormData({
        title: '',
        description: '',
        priority: 'MEDIUM',
        dueDate: '',
        tags: [],
        pomodoroEstimatedMinutes: null,
        pomodoroEstimatedCycles: null,
      })
    }
  }, [mode, task, isOpen])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value ? parseInt(value, 10) : null,
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const addTag = () => {
    const tag = tagInput.trim()
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag],
      }))
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Название задачи обязательно')
      return
    }

    if (!currentWorkspace?.id && mode === 'create') {
      toast.error('Выберите рабочее пространство')
      return
    }

    setIsSubmitting(true)

    try {
      const payload: CreateTaskPayload = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        priority: formData.priority,
        dueDate: formData.dueDate || null,
        workspaceId: currentWorkspace?.id || '',
        tags: formData.tags,
        pomodoroEstimatedMinutes: formData.pomodoroEstimatedMinutes,
        pomodoroEstimatedCycles: formData.pomodoroEstimatedCycles,
      }

      await onSubmit(payload)
      onClose()
      
      toast.success(
        mode === 'create' 
          ? 'Задача создана!' 
          : 'Задача обновлена!'
      )
    } catch (error) {
      console.error('Ошибка при сохранении задачи:', error)
      toast.error('Произошла ошибка при сохранении')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-black bg-opacity-50"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-800">
              {mode === 'create' ? 'Создать задачу' : 'Редактировать задачу'}
            </h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Название и описание */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Название задачи *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900"
                  placeholder="Введите название задачи..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Описание
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900"
                  placeholder="Добавьте описание задачи..."
                />
              </div>
            </div>

            {/* Приоритет */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Приоритет
              </label>
              <div className="grid grid-cols-2 gap-3">
                {PRIORITY_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.priority === option.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value={option.value}
                      checked={formData.priority === option.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-slate-500">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Срок выполнения и Pomodoro */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Срок выполнения
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Оценка времени (мин)
                </label>
                <input
                  type="number"
                  name="pomodoroEstimatedMinutes"
                  value={formData.pomodoroEstimatedMinutes || ''}
                  onChange={handleInputChange}
                  min="5"
                  max="480"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900"
                  placeholder="25"
                />
              </div>
            </div>

            {/* Теги */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Теги
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900"
                  placeholder="Введите тег и нажмите Enter"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Добавить
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Кнопки */}
            <div className="flex space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 border border-slate-300 rounded-md hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.title.trim()}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting 
                  ? 'Сохранение...' 
                  : mode === 'create' 
                    ? 'Создать задачу'
                    : 'Сохранить изменения'
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
