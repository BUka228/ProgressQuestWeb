import React, { useState } from 'react'
import { WorkspaceClientDto } from '@/services/workspaceService'
import { useAppStore } from '@/stores/appStore'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

interface WorkspaceCardProps {
  workspace: WorkspaceClientDto
  onEdit?: (workspace: WorkspaceClientDto) => void
  onDelete?: (workspaceId: string) => void
  onSelect?: (workspace: WorkspaceClientDto) => void
  isSelected?: boolean
  showActions?: boolean
  variant?: 'default' | 'compact' | 'detailed'
}

export const WorkspaceCard: React.FC<WorkspaceCardProps> = ({
  workspace,
  onEdit,
  onDelete,
  onSelect,
  isSelected = false,
  showActions = true,
  variant = 'default',
}) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const { setCurrentWorkspace } = useAppStore()

  const handleSelect = () => {
    if (onSelect) {
      onSelect(workspace)
    } else {
      setCurrentWorkspace(workspace as any) // TODO: Нужно будет привести типы в соответствие
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDropdown(false)
    onEdit?.(workspace)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDropdown(false)
    if (window.confirm(`Вы уверены, что хотите удалить рабочее пространство "${workspace.name}"?`)) {
      onDelete?.(workspace.id)
    }
  }

  const getApproachIcon = (approach: string) => {
    switch (approach) {
      case 'CALENDAR': return '📅'
      case 'GTD': return '⚡'
      case 'KANBAN': return '📋'
      case 'EISENHOWER': return '🎯'
      default: return '📋'
    }
  }

  const getApproachLabel = (approach: string) => {
    switch (approach) {
      case 'CALENDAR': return 'Календарь'
      case 'GTD': return 'GTD'
      case 'KANBAN': return 'Канбан'
      case 'EISENHOWER': return 'Эйзенхауэр'
      default: return 'Канбан'
    }
  }

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'owner': return 'Владелец'
      case 'admin': return 'Администратор'
      case 'manager': return 'Менеджер'
      case 'editor': return 'Редактор'
      case 'member': return 'Участник'
      case 'viewer': return 'Наблюдатель'
      default: return 'Участник'
    }
  }

  const baseClasses = `
    relative bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-lg 
    transition-all duration-200 cursor-pointer group
    ${isSelected ? 'ring-2 ring-blue-500 border-blue-500' : 'hover:border-slate-300'}
  `

  const compactClasses = 'p-3'
  const defaultClasses = 'p-4'
  const detailedClasses = 'p-6'

  const cardClasses = `
    ${baseClasses} 
    ${variant === 'compact' ? compactClasses : variant === 'detailed' ? detailedClasses : defaultClasses}
  `

  return (
    <div className={cardClasses} onClick={handleSelect}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          {/* Type Icon */}
          <div className="flex-shrink-0 mt-1">
            <span className="text-lg">
              {workspace.isPersonal ? '👤' : '👥'}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-900 truncate">
              {workspace.name}
            </h3>
            
            {workspace.description && variant !== 'compact' && (
              <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                {workspace.description}
              </p>
            )}

            {/* Metadata */}
            <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
              <span className="flex items-center">
                {getApproachIcon(workspace.activeApproach)}
                <span className="ml-1">{getApproachLabel(workspace.activeApproach)}</span>
              </span>
              
              {workspace.currentUserWorkspaceRole && (
                <span className="px-2 py-1 bg-slate-100 rounded-full">
                  {getRoleLabel(workspace.currentUserWorkspaceRole)}
                </span>
              )}
              
              {variant === 'detailed' && (
                <span>
                  Обновлено {formatDistanceToNow(new Date(workspace.updatedAt), { 
                    addSuffix: true,
                    locale: ru 
                  })}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
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
                  {onEdit && (
                    <button
                      onClick={handleEdit}
                      className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      ✏️ Редактировать
                    </button>
                  )}
                  
                  <button
                    onClick={handleSelect}
                    className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    🎯 Выбрать как активное
                  </button>
                  
                  {onDelete && workspace.currentUserWorkspaceRole === 'owner' && (
                    <>
                      <div className="border-t border-slate-200 my-1" />
                      <button
                        onClick={handleDelete}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        🗑️ Удалить
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tags */}
      {workspace.defaultTags && workspace.defaultTags.length > 0 && variant !== 'compact' && (
        <div className="flex flex-wrap gap-1 mt-3">
          {workspace.defaultTags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
            >
              {tag}
            </span>
          ))}
          {workspace.defaultTags.length > 3 && (
            <span className="inline-block px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-full">
              +{workspace.defaultTags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer for detailed variant */}
      {variant === 'detailed' && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center space-x-4 text-xs text-slate-500">
            <span>
              Создано {formatDistanceToNow(new Date(workspace.createdAt), { 
                addSuffix: true,
                locale: ru 
              })}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {workspace.isPersonal ? (
              <span className="text-xs text-slate-500">Личное</span>
            ) : (
              <span className="text-xs text-slate-500">Командное</span>
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
