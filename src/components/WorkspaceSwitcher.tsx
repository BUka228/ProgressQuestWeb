import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useWorkspaces } from '@/hooks/useWorkspaces'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { WorkspaceClientDto } from '@/services/workspaceService'
import { ROUTES } from '@/constants'

interface WorkspaceSwitcherProps {
  className?: string
  compact?: boolean
}

export const WorkspaceSwitcher: React.FC<WorkspaceSwitcherProps> = ({
  className = '',
  compact = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [, setSelectedWorkspaceId] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { currentWorkspace, setCurrentWorkspace } = useWorkspaceStore()
  const { data: workspacesData, isLoading } = useWorkspaces()

  const workspaces = workspacesData?.workspaces || []
  
  // Синхронизируем с store при получении данных из React Query
  useEffect(() => {
    if (workspacesData?.workspaces && workspacesData.workspaces.length > 0) {
      // Если нет текущего workspace, выбираем первое личное
      if (!currentWorkspace) {
        const personalWorkspace = workspacesData.workspaces.find(ws => ws.isPersonal)
        if (personalWorkspace) {
          setCurrentWorkspace(personalWorkspace as any)
        }
      }
    }
  }, [workspacesData, currentWorkspace, setCurrentWorkspace])

  const activeWorkspace = currentWorkspace || workspaces.find(ws => ws.isPersonal)

  // Закрываем дропдаун при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleWorkspaceSelect = (workspace: WorkspaceClientDto) => {
    setCurrentWorkspace(workspace as any) // TODO: привести типы в соответствие
    setSelectedWorkspaceId(workspace.id)
    setIsOpen(false)
  }

  const getWorkspaceIcon = (workspace: WorkspaceClientDto) => {
    return workspace.isPersonal ? '👤' : '👥'
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

  if (isLoading) {
    return (
      <div className={`${className} animate-pulse`}>
        <div className="h-10 bg-slate-200 rounded"></div>
      </div>
    )
  }

  if (workspaces.length === 0) {
    return (
      <div className={className}>
        <Link
          to={ROUTES.WORKSPACES}
          className="flex items-center w-full px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <span className="mr-2">➕</span>
          {compact ? 'Создать' : 'Создать пространство'}
        </Link>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Current Workspace Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 text-left bg-white border border-slate-200 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <div className="flex items-center min-w-0 flex-1">
          <span className="mr-2 text-lg flex-shrink-0">
            {activeWorkspace ? getWorkspaceIcon(activeWorkspace) : '🏢'}
          </span>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-slate-900 truncate">
              {activeWorkspace?.name || 'Выберите пространство'}
            </div>
            {!compact && activeWorkspace && (
              <div className="text-xs text-slate-500 truncate">
                {getApproachIcon(activeWorkspace.activeApproach)} 
                {activeWorkspace.isPersonal ? ' Личное' : ' Командное'}
              </div>
            )}
          </div>
        </div>
        <span className={`ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {/* Personal Workspaces */}
          <div className="p-2">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide px-2 py-1">
              Личные пространства
            </div>
            {workspaces
              .filter(ws => ws.isPersonal)
              .map((workspace) => (
                <button
                  key={workspace.id}
                  onClick={() => handleWorkspaceSelect(workspace)}
                  className={`flex items-center w-full px-2 py-2 text-sm rounded-md transition-colors ${
                    workspace.id === activeWorkspace?.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="mr-2">{getWorkspaceIcon(workspace)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{workspace.name}</div>
                    {!compact && (
                      <div className="text-xs text-slate-500 truncate">
                        {getApproachIcon(workspace.activeApproach)} {workspace.activeApproach}
                      </div>
                    )}
                  </div>
                  {workspace.id === activeWorkspace?.id && (
                    <span className="ml-2 text-blue-600">✓</span>
                  )}
                </button>
              ))}
          </div>

          {/* Team Workspaces */}
          {workspaces.some(ws => !ws.isPersonal) && (
            <div className="border-t border-slate-200 p-2">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wide px-2 py-1">
                Командные пространства
              </div>
              {workspaces
                .filter(ws => !ws.isPersonal)
                .map((workspace) => (
                  <button
                    key={workspace.id}
                    onClick={() => handleWorkspaceSelect(workspace)}
                    className={`flex items-center w-full px-2 py-2 text-sm rounded-md transition-colors ${
                      workspace.id === activeWorkspace?.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="mr-2">{getWorkspaceIcon(workspace)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{workspace.name}</div>
                      {!compact && (
                        <div className="text-xs text-slate-500 truncate">
                          {getApproachIcon(workspace.activeApproach)} {workspace.activeApproach}
                          {workspace.currentUserWorkspaceRole && (
                            <span className="ml-1">
                              ({workspace.currentUserWorkspaceRole === 'owner' ? 'Владелец' : 'Участник'})
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {workspace.id === activeWorkspace?.id && (
                      <span className="ml-2 text-blue-600">✓</span>
                    )}
                  </button>
                ))}
            </div>
          )}

          {/* Actions */}
          <div className="border-t border-slate-200 p-2">
            <Link
              to={ROUTES.WORKSPACES}
              onClick={() => setIsOpen(false)}
              className="flex items-center w-full px-2 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              <span className="mr-2">⚙️</span>
              Управление пространствами
            </Link>
            <Link
              to={`${ROUTES.WORKSPACES}?create=true`}
              onClick={() => setIsOpen(false)}
              className="flex items-center w-full px-2 py-2 text-sm text-green-600 hover:bg-green-50 rounded-md transition-colors"
            >
              <span className="mr-2">➕</span>
              Создать новое
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
