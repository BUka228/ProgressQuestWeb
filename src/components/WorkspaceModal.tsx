import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { WorkspaceClientDto, CreateWorkspacePayload } from '@/services/workspaceService'

interface WorkspaceModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (workspaceData: CreateWorkspacePayload) => void
  workspace?: WorkspaceClientDto | null
  mode: 'create' | 'edit'
}

interface WorkspaceFormData {
  name: string
  description: string
  isPersonal: boolean
  activeApproach: string
  defaultTags: string[]
  settings: {
    allowMembersToCreateTasks: boolean
    taskVisibility: string
  }
}

const APPROACH_OPTIONS = [
  { value: 'CALENDAR', label: '📅 Календарь', description: 'Организация по датам' },
  { value: 'GTD', label: '⚡ GTD', description: 'Getting Things Done' },
  { value: 'KANBAN', label: '📋 Канбан', description: 'Доски с колонками' },
  { value: 'EISENHOWER', label: '🎯 Эйзенхауэр', description: 'Матрица приоритетов' },
]

const TASK_VISIBILITY_OPTIONS = [
  { value: 'all_visible', label: 'Все видят все задачи' },
  { value: 'assigned_only', label: 'Только назначенные задачи' },
  { value: 'owner_and_assigned', label: 'Владелец и назначенные' },
]

export const WorkspaceModal: React.FC<WorkspaceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  workspace,
  mode,
}) => {
  const [formData, setFormData] = useState<WorkspaceFormData>({
    name: '',
    description: '',
    isPersonal: true,
    activeApproach: 'CALENDAR',
    defaultTags: [],
    settings: {
      allowMembersToCreateTasks: true,
      taskVisibility: 'all_visible',
    },
  })

  const [tagInput, setTagInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Заполняем форму данными workspace при редактировании
  useEffect(() => {
    if (mode === 'edit' && workspace) {
      setFormData({
        name: workspace.name,
        description: workspace.description || '',
        isPersonal: workspace.isPersonal,
        activeApproach: workspace.activeApproach,
        defaultTags: workspace.defaultTags || [],
        settings: {
          allowMembersToCreateTasks: workspace.settings?.allowMembersToCreateTasks ?? true,
          taskVisibility: workspace.settings?.taskVisibility || 'all_visible',
        },
      })
    } else if (mode === 'create') {
      // Сброс формы для создания нового workspace
      setFormData({
        name: '',
        description: '',
        isPersonal: true,
        activeApproach: 'CALENDAR',
        defaultTags: [],
        settings: {
          allowMembersToCreateTasks: true,
          taskVisibility: 'all_visible',
        },
      })
    }
  }, [mode, workspace, isOpen])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      if (name.startsWith('settings.')) {
        const settingKey = name.replace('settings.', '')
        setFormData(prev => ({
          ...prev,
          settings: {
            ...prev.settings,
            [settingKey]: checked,
          },
        }))
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: checked,
        }))
      }
    } else if (name.startsWith('settings.')) {
      const settingKey = name.replace('settings.', '')
      setFormData(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          [settingKey]: value,
        },
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
    if (tag && !formData.defaultTags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        defaultTags: [...prev.defaultTags, tag],
      }))
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      defaultTags: prev.defaultTags.filter(tag => tag !== tagToRemove),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Название рабочего пространства обязательно')
      return
    }

    setIsSubmitting(true)

    try {
      const payload: CreateWorkspacePayload = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        activeApproach: formData.activeApproach,
        defaultTags: formData.defaultTags,
        settings: formData.settings,
      }

      // Добавляем isPersonal только для создания нового workspace
      if (mode === 'create') {
        (payload as any).isPersonal = formData.isPersonal
      }

      await onSubmit(payload)
      onClose()
      
      toast.success(
        mode === 'create' 
          ? 'Рабочее пространство создано!' 
          : 'Рабочее пространство обновлено!'
      )
    } catch (error) {
      console.error('Ошибка при сохранении рабочего пространства:', error)
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
              {mode === 'create' ? 'Создать рабочее пространство' : 'Редактировать рабочее пространство'}
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
                  Название пространства *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900"
                  placeholder="Мой проект, Работа, Личное..."
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
                  placeholder="Кратко опишите назначение этого пространства..."
                />
              </div>
            </div>

            {/* Тип пространства */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Тип пространства
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isPersonal"
                    checked={formData.isPersonal}
                    onChange={() => setFormData(prev => ({ ...prev, isPersonal: true }))}
                    className="mr-2 text-blue-600"
                  />
                  <span className="text-sm text-slate-700">
                    👤 Личное (только для меня)
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isPersonal"
                    checked={!formData.isPersonal}
                    onChange={() => setFormData(prev => ({ ...prev, isPersonal: false }))}
                    className="mr-2 text-blue-600"
                  />
                  <span className="text-sm text-slate-700">
                    👥 Командное (с участниками)
                  </span>
                </label>
              </div>
            </div>

            {/* Подход к организации */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Подход к организации задач
              </label>
              <div className="grid grid-cols-2 gap-3">
                {APPROACH_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.activeApproach === option.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="activeApproach"
                      value={option.value}
                      checked={formData.activeApproach === option.value}
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

            {/* Теги по умолчанию */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Теги по умолчанию
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
              {formData.defaultTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.defaultTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                    >
                      {tag}
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

            {/* Настройки */}
            {!formData.isPersonal && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">Настройки команды</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="settings.allowMembersToCreateTasks"
                      checked={formData.settings.allowMembersToCreateTasks}
                      onChange={handleInputChange}
                      className="mr-2 text-blue-600"
                    />
                    <span className="text-sm text-slate-700">
                      Разрешить участникам создавать задачи
                    </span>
                  </label>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Видимость задач
                    </label>
                    <select
                      name="settings.taskVisibility"
                      value={formData.settings.taskVisibility}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900"
                    >
                      {TASK_VISIBILITY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

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
                disabled={isSubmitting || !formData.name.trim()}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting 
                  ? 'Сохранение...' 
                  : mode === 'create' 
                    ? 'Создать пространство'
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
