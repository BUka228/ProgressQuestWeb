import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useWorkspaces, useCreateWorkspace, useUpdateWorkspace, useDeleteWorkspace } from '@/hooks/useWorkspaces'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { WorkspaceCard } from '@/components/WorkspaceCard'
import { WorkspaceModal } from '@/components/WorkspaceModal'
import { WorkspaceClientDto, CreateWorkspacePayload } from '@/services/workspaceService'
// import { toast } from 'sonner' // TODO: использовать при необходимости

export const WorkspacesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  
  const {
    workspaces,
    searchQuery,
    viewMode,
    showPersonalOnly,
    showTeamOnly,
    selectedTags,
    sortBy,
    sortOrder,
    getAllTags,
    getFilteredWorkspaces,
    setWorkspaces,
    setSearchQuery,
    setViewMode,
    setShowPersonalOnly,
    setShowTeamOnly,
    toggleTag,
    setSortBy,
    setSortOrder,
    clearFilters,
  } = useWorkspaceStore()

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingWorkspace, setEditingWorkspace] = useState<WorkspaceClientDto | null>(null)

  // React Query hooks
  const {
    data: workspacesData,
    isLoading: isLoadingWorkspaces,
    error: workspacesError,
  } = useWorkspaces()

  const createWorkspaceMutation = useCreateWorkspace()
  const updateWorkspaceMutation = useUpdateWorkspace()
  const deleteWorkspaceMutation = useDeleteWorkspace()

  // Больше не нужно синхронизировать с Zustand - используем React Query напрямую

  // Обработка URL параметра create
  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      setIsCreateModalOpen(true)
      // Удаляем параметр из URL
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev)
        newParams.delete('create')
        return newParams
      })
    }
  }, [searchParams, setSearchParams])

  // Получаем отфильтрованные рабочие пространства напрямую из React Query
  const currentWorkspaces = workspacesData?.workspaces || []
  
  // Применяем фильтры локально для демонстрации
  const filteredWorkspaces = React.useMemo(() => {
    let filtered = [...currentWorkspaces]
    
    // Фильтрация по типу
    if (showPersonalOnly) {
      filtered = filtered.filter(ws => ws.isPersonal)
    } else if (showTeamOnly) {
      filtered = filtered.filter(ws => !ws.isPersonal)
    }
    
    // Поиск по названию и описанию
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(ws =>
        ws.name.toLowerCase().includes(query) ||
        ws.description?.toLowerCase().includes(query)
      )
    }
    
    // Фильтрация по тегам
    if (selectedTags.length > 0) {
      filtered = filtered.filter(ws =>
        selectedTags.some(tag => ws.defaultTags.includes(tag))
      )
    }
    
    // Сортировка
    filtered.sort((a, b) => {
      let aValue: string | Date
      let bValue: string | Date
      
      switch (sortBy) {
        case 'name':
          aValue = a.name
          bValue = b.name
          break
        case 'created':
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
          break
        case 'updated':
          aValue = new Date(a.updatedAt)
          bValue = new Date(b.updatedAt)
          break
        default:
          return 0
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })
    
    return filtered
  }, [currentWorkspaces, showPersonalOnly, showTeamOnly, searchQuery, selectedTags, sortBy, sortOrder])
  
  const allTags = React.useMemo(() => {
    const tags = currentWorkspaces.flatMap(ws => ws.defaultTags)
    return [...new Set(tags)].sort()
  }, [currentWorkspaces])

  // Обработчики
  const handleCreateWorkspace = async (payload: CreateWorkspacePayload) => {
    try {
      await createWorkspaceMutation.mutateAsync(payload)
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error('Ошибка создания рабочего пространства:', error)
    }
  }

  const handleEditWorkspace = (workspace: WorkspaceClientDto) => {
    setEditingWorkspace(workspace)
    setIsEditModalOpen(true)
  }

  const handleUpdateWorkspace = async (payload: CreateWorkspacePayload) => {
    if (!editingWorkspace) return

    try {
      await updateWorkspaceMutation.mutateAsync({
        workspaceId: editingWorkspace.id,
        ...payload,
      })
      setIsEditModalOpen(false)
      setEditingWorkspace(null)
    } catch (error) {
      console.error('Ошибка обновления рабочего пространства:', error)
    }
  }

  const handleDeleteWorkspace = async (workspaceId: string) => {
    try {
      await deleteWorkspaceMutation.mutateAsync(workspaceId)
    } catch (error) {
      console.error('Ошибка удаления рабочего пространства:', error)
    }
  }

  const handleSortChange = (newSortBy: 'name' | 'created' | 'updated') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(newSortBy)
      setSortOrder('desc')
    }
  }

  if (isLoadingWorkspaces) {
    return (
      <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Загружаем рабочие пространства...</p>
          </div>
        </div>
      </div>
    )
  }

  if (workspacesError) {
    return (
      <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Ошибка загрузки</h3>
            <p className="text-slate-600 mb-4">{workspacesError.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Рабочие пространства</h1>
            <p className="text-slate-600">
              Управляйте своими проектами и задачами в организованных пространствах
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            disabled={createWorkspaceMutation.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createWorkspaceMutation.isPending ? '⏳ Создание...' : '+ Новое пространство'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-blue-600">{currentWorkspaces.length}</div>
            <div className="text-sm text-slate-600">Всего пространств</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-green-600">
              {currentWorkspaces.filter(w => w.isPersonal).length}
            </div>
            <div className="text-sm text-slate-600">Личных</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-purple-600">
              {currentWorkspaces.filter(w => !w.isPersonal).length}
            </div>
            <div className="text-sm text-slate-600">Командных</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-orange-600">{allTags.length}</div>
            <div className="text-sm text-slate-600">Уникальных тегов</div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm mb-6">
        <div className="p-4 border-b border-slate-200">
          {/* Search and View Toggle */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Поиск по названию или описанию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900"
              />
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}
                title="Сетка"
              >
                ⊞
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}
                title="Список"
              >
                ☰
              </button>
            </div>
          </div>

          {/* Filter buttons */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <button
              onClick={() => setShowPersonalOnly(!showPersonalOnly)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                showPersonalOnly
                  ? 'bg-blue-100 text-blue-700 border-blue-300'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
              }`}
            >
              👤 Только личные
            </button>
            
            <button
              onClick={() => setShowTeamOnly(!showTeamOnly)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                showTeamOnly
                  ? 'bg-purple-100 text-purple-700 border-purple-300'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
              }`}
            >
              👥 Только командные
            </button>

            {/* Tag filters */}
            {allTags.slice(0, 5).map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-green-100 text-green-700 border-green-300'
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                }`}
              >
                #{tag}
              </button>
            ))}

            {(searchQuery || showPersonalOnly || showTeamOnly || selectedTags.length > 0) && (
              <button
                onClick={clearFilters}
                className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
              >
                ✕ Очистить фильтры
              </button>
            )}
          </div>

          {/* Sort options */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-600">Сортировать:</span>
            {(['name', 'created', 'updated'] as const).map((option) => (
              <button
                key={option}
                onClick={() => handleSortChange(option)}
                className={`text-sm px-2 py-1 rounded transition-colors ${
                  sortBy === option
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {option === 'name' && 'По названию'}
                {option === 'created' && 'По дате создания'}
                {option === 'updated' && 'По обновлению'}
                {sortBy === option && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="px-4 py-2 bg-slate-50 text-sm text-slate-600">
          Найдено: {filteredWorkspaces.length} из {workspaces.length} пространств
        </div>
      </div>

      {/* Workspaces Grid/List */}
      {filteredWorkspaces.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏢</div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            {workspaces.length === 0 ? 'Пространств пока нет' : 'Ничего не найдено'}
          </h3>
          <p className="text-slate-600 mb-6">
            {workspaces.length === 0
              ? 'Создайте своё первое рабочее пространство для организации задач'
              : 'Попробуйте изменить параметры поиска или очистить фильтры'
            }
          </p>
          {workspaces.length === 0 && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Создать первое пространство
            </button>
          )}
        </div>
      ) : (
        <div className={`${
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }`}>
          {filteredWorkspaces.map((workspace) => (
            <WorkspaceCard
              key={workspace.id}
              workspace={workspace}
              onEdit={handleEditWorkspace}
              onDelete={handleDeleteWorkspace}
              variant={viewMode === 'list' ? 'detailed' : 'default'}
            />
          ))}
        </div>
      )}

      {/* Create Workspace Modal */}
      <WorkspaceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateWorkspace}
        mode="create"
      />

      {/* Edit Workspace Modal */}
      <WorkspaceModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingWorkspace(null)
        }}
        onSubmit={handleUpdateWorkspace}
        workspace={editingWorkspace}
        mode="edit"
      />
    </div>
  )
}

