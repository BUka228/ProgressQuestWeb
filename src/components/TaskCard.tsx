import React, { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import { TaskDocument, TaskStatusType, TaskPriorityType } from '@/types/task.types'
import { useUpdateTask, useDeleteTask, useUpdateTaskStatus } from '@/hooks/useTasks'
import { toast } from 'sonner'

interface TaskCardProps {
  task: TaskDocument
  onEdit?: (task: TaskDocument) => void
  variant?: 'default' | 'compact' | 'detailed'
  userId?: string
  workspaceId?: string
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  variant = 'default',
  userId,
  workspaceId,
}) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()
  const updateStatusMutation = useUpdateTaskStatus()

  const getPriorityColor = (priority: TaskPriorityType) => {
    switch (priority) {
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityIcon = (priority: TaskPriorityType) => {
    switch (priority) {
      case 'LOW': return '🟢'
      case 'MEDIUM': return '🟡'
      case 'HIGH': return '🟠'
      case 'CRITICAL': return '🔴'
      default: return '⚪'
    }
  }

  const getStatusColor = (status: TaskStatusType) => {
    switch (status) {
      case 'TODO': return 'bg-slate-100 text-slate-800'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800'
      case 'DONE': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: TaskStatusType) => {
    switch (status) {
      case 'TODO': return '📋'
      case 'IN_PROGRESS': return '⚡'
      case 'DONE': return '✅'
      default: return '❓'
    }
  }

  const getStatusLabel = (status: TaskStatusType) => {
    switch (status) {
      case 'TODO': return 'К выполнению'
      case 'IN_PROGRESS': return 'В работе'
      case 'DONE': return 'Выполнено'
      default: return 'Неизвестно'
    }
  }

  const handleStatusChange = (newStatus: TaskStatusType) => {
    if (!userId || !workspaceId) {
      toast.error('Не удалось обновить статус: недостаточно данных')
      return
    }
    
    updateStatusMutation.mutate({ 
      taskId: task.id, 
      status: newStatus, 
      userId,
      workspaceId 
    })
    setShowDropdown(false)
  }

  const handleEdit = () => {
    setShowDropdown(false)
    onEdit?.(task)
  }

  const handleDelete = () => {
    setShowDropdown(false)
    if (window.confirm(`Вы уверены, что хотите удалить задачу "${task.title}"?`)) {
      deleteTaskMutation.mutate(task.id)
    }
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE'

  return (
    <div className={`
      relative bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md 
      transition-all duration-200 group mb-4
      ${isOverdue ? 'border-red-300 bg-red-50' : ''}
      ${variant === 'compact' ? 'p-3' : variant === 'detailed' ? 'p-6' : 'p-4'}
    `}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          {/* Status Icon */}
          <div className="flex-shrink-0 mt-1">
            <span className="text-lg">
              {getStatusIcon(task.status)}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-slate-900 truncate ${
              task.status === 'DONE' ? 'line-through text-slate-500' : ''
            }`}>
              {task.title}
            </h3>
            
            {task.description && variant !== 'compact' && (
              <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Metadata */}
            <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
              {/* Priority */}
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                getPriorityColor(task.priority)
              }`}>
                {getPriorityIcon(task.priority)} {task.priority}
              </span>
              
              {/* Status */}
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                getStatusColor(task.status)
              }`}>
                {getStatusIcon(task.status)} {getStatusLabel(task.status)}
              </span>

              {/* Due Date */}
              {task.dueDate && (
                <span className={`${isOverdue ? 'text-red-600 font-medium' : ''}`}>
                  📅 {new Date(task.dueDate).toLocaleDateString('ru-RU')}
                  {isOverdue && ' (просрочено)'}
                </span>
              )}

              {/* Pomodoro estimation */}
              {task.pomodoroEstimatedCycles && (
                <span>
                  🍅 {task.pomodoroEstimatedCycles} циклов
                </span>
              )}
              
              {variant === 'detailed' && (
                <span>
                  Создано {formatDistanceToNow(new Date(task.createdAt), { 
                    addSuffix: true,
                    locale: ru 
                  })}
                </span>
              )}
            </div>

            {/* Tags */}
            {task.tags && task.tags.length > 0 && variant !== 'compact' && (
              <div className="flex flex-wrap gap-1 mt-2">
                {task.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
                {task.tags.length > 3 && (
                  <span className="inline-block px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-full">
                    +{task.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions Dropdown */}
        <div className="relative flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowDropdown(!showDropdown)
            }}
            className="p-1 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <span className="block w-5 h-5 text-center">⋮</span>
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-slate-200 z-10">
              <div className="py-1">
                {/* Status Changes */}
                <div className="px-4 py-2 text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Изменить статус
                </div>
                
                {(['TODO', 'IN_PROGRESS', 'DONE'] as TaskStatusType[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${
                      task.status === status ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
                    }`}
                    disabled={task.status === status}
                  >
                    {getStatusIcon(status)} {getStatusLabel(status)}
                  </button>
                ))}
                
                <div className="border-t border-slate-200 my-1" />
                
                {onEdit && (
                  <button
                    onClick={handleEdit}
                    className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    ✏️ Редактировать
                  </button>
                )}
                
                <button
                  onClick={handleDelete}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  🗑️ Удалить
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer for detailed variant */}
      {variant === 'detailed' && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center space-x-4 text-xs text-slate-500">
            <span>
              ID: {task.id.slice(0, 8)}...
            </span>
            {task.assigneeUid && (
              <span>
                👤 Назначено
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {task.status === 'DONE' && task.completedAt && (
              <span className="text-xs text-green-600">
                ✅ Завершено {formatDistanceToNow(new Date(task.completedAt), { 
                  addSuffix: true,
                  locale: ru 
                })}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Click overlay to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-5"
          onClick={(e) => {
            e.stopPropagation()
            setShowDropdown(false)
          }}
        />
      )}
    </div>
  )
}
