import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { WorkspaceClientDto } from '@/services/workspaceService'

interface WorkspaceState {
  // Текущее активное рабочее пространство
  currentWorkspace: WorkspaceClientDto | null
  
  // Список всех рабочих пространств пользователя
  workspaces: WorkspaceClientDto[]
  
  // Состояния загрузки
  isLoading: boolean
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
  
  // Состояние ошибок
  error: string | null
  
  // Настройки отображения
  viewMode: 'grid' | 'list'
  showPersonalOnly: boolean
  showTeamOnly: boolean
  
  // Поиск и фильтрация
  searchQuery: string
  selectedTags: string[]
  sortBy: 'name' | 'created' | 'updated'
  sortOrder: 'asc' | 'desc'
  
  // Actions
  setCurrentWorkspace: (workspace: WorkspaceClientDto | null) => void
  setWorkspaces: (workspaces: WorkspaceClientDto[]) => void
  addWorkspace: (workspace: WorkspaceClientDto) => void
  updateWorkspace: (workspaceId: string, updates: Partial<WorkspaceClientDto>) => void
  removeWorkspace: (workspaceId: string) => void
  
  // Loading states
  setLoading: (loading: boolean) => void
  setCreating: (creating: boolean) => void
  setUpdating: (updating: boolean) => void
  setDeleting: (deleting: boolean) => void
  
  // Error handling
  setError: (error: string | null) => void
  clearError: () => void
  
  // View settings
  setViewMode: (mode: 'grid' | 'list') => void
  setShowPersonalOnly: (show: boolean) => void
  setShowTeamOnly: (show: boolean) => void
  
  // Search and filtering
  setSearchQuery: (query: string) => void
  setSelectedTags: (tags: string[]) => void
  toggleTag: (tag: string) => void
  setSortBy: (sortBy: 'name' | 'created' | 'updated') => void
  setSortOrder: (order: 'asc' | 'desc') => void
  
  // Computed selectors
  getFilteredWorkspaces: () => WorkspaceClientDto[]
  getPersonalWorkspaces: () => WorkspaceClientDto[]
  getTeamWorkspaces: () => WorkspaceClientDto[]
  getWorkspaceById: (id: string) => WorkspaceClientDto | undefined
  getAllTags: () => string[]
  
  // Utility actions
  reset: () => void
  clearFilters: () => void
}

const initialState = {
  currentWorkspace: null,
  workspaces: [],
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  viewMode: 'grid' as const,
  showPersonalOnly: false,
  showTeamOnly: false,
  searchQuery: '',
  selectedTags: [],
  sortBy: 'updated' as const,
  sortOrder: 'desc' as const,
}

export const useWorkspaceStore = create<WorkspaceState>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        // Workspace management
        setCurrentWorkspace: (workspace) =>
          set((state) => {
            state.currentWorkspace = workspace
          }),

        setWorkspaces: (workspaces) =>
          set((state) => {
            state.workspaces = workspaces
          }),

        addWorkspace: (workspace) =>
          set((state) => {
            state.workspaces.unshift(workspace)
          }),

        updateWorkspace: (workspaceId, updates) =>
          set((state) => {
            const index = state.workspaces.findIndex(ws => ws.id === workspaceId)
            if (index !== -1) {
              Object.assign(state.workspaces[index], updates)
            }
            
            // Обновляем текущее рабочее пространство если оно совпадает
            if (state.currentWorkspace?.id === workspaceId) {
              Object.assign(state.currentWorkspace, updates)
            }
          }),

        removeWorkspace: (workspaceId) =>
          set((state) => {
            state.workspaces = state.workspaces.filter(ws => ws.id !== workspaceId)
            
            // Сбрасываем текущее рабочее пространство если оно было удалено
            if (state.currentWorkspace?.id === workspaceId) {
              state.currentWorkspace = null
            }
          }),

        // Loading states
        setLoading: (loading) =>
          set((state) => {
            state.isLoading = loading
          }),

        setCreating: (creating) =>
          set((state) => {
            state.isCreating = creating
          }),

        setUpdating: (updating) =>
          set((state) => {
            state.isUpdating = updating
          }),

        setDeleting: (deleting) =>
          set((state) => {
            state.isDeleting = deleting
          }),

        // Error handling
        setError: (error) =>
          set((state) => {
            state.error = error
          }),

        clearError: () =>
          set((state) => {
            state.error = null
          }),

        // View settings
        setViewMode: (mode) =>
          set((state) => {
            state.viewMode = mode
          }),

        setShowPersonalOnly: (show) =>
          set((state) => {
            state.showPersonalOnly = show
            if (show) state.showTeamOnly = false
          }),

        setShowTeamOnly: (show) =>
          set((state) => {
            state.showTeamOnly = show
            if (show) state.showPersonalOnly = false
          }),

        // Search and filtering
        setSearchQuery: (query) =>
          set((state) => {
            state.searchQuery = query
          }),

        setSelectedTags: (tags) =>
          set((state) => {
            state.selectedTags = tags
          }),

        toggleTag: (tag) =>
          set((state) => {
            const index = state.selectedTags.indexOf(tag)
            if (index === -1) {
              state.selectedTags.push(tag)
            } else {
              state.selectedTags.splice(index, 1)
            }
          }),

        setSortBy: (sortBy) =>
          set((state) => {
            state.sortBy = sortBy
          }),

        setSortOrder: (order) =>
          set((state) => {
            state.sortOrder = order
          }),

        // Computed selectors
        getFilteredWorkspaces: () => {
          const state = get()
          let filtered = [...state.workspaces]

          // Фильтрация по типу
          if (state.showPersonalOnly) {
            filtered = filtered.filter(ws => ws.isPersonal)
          } else if (state.showTeamOnly) {
            filtered = filtered.filter(ws => !ws.isPersonal)
          }

          // Поиск по названию и описанию
          if (state.searchQuery) {
            const query = state.searchQuery.toLowerCase()
            filtered = filtered.filter(ws =>
              ws.name.toLowerCase().includes(query) ||
              ws.description?.toLowerCase().includes(query)
            )
          }

          // Фильтрация по тегам
          if (state.selectedTags.length > 0) {
            filtered = filtered.filter(ws =>
              state.selectedTags.some(tag =>
                ws.defaultTags.includes(tag)
              )
            )
          }

          // Сортировка
          filtered.sort((a, b) => {
            let aValue: string | Date
            let bValue: string | Date

            switch (state.sortBy) {
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

            if (state.sortOrder === 'asc') {
              return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
            } else {
              return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
            }
          })

          return filtered
        },

        getPersonalWorkspaces: () => {
          return get().workspaces.filter(ws => ws.isPersonal)
        },

        getTeamWorkspaces: () => {
          return get().workspaces.filter(ws => !ws.isPersonal)
        },

        getWorkspaceById: (id) => {
          return get().workspaces.find(ws => ws.id === id)
        },

        getAllTags: () => {
          const allTags = get().workspaces.flatMap(ws => ws.defaultTags)
          return [...new Set(allTags)].sort()
        },

        // Utility actions
        reset: () =>
          set((state) => {
            Object.assign(state, initialState)
          }),

        clearFilters: () =>
          set((state) => {
            state.searchQuery = ''
            state.selectedTags = []
            state.showPersonalOnly = false
            state.showTeamOnly = false
          }),
      })),
      {
        name: 'workspace-store',
        partialize: (state) => ({
          currentWorkspace: state.currentWorkspace,
          viewMode: state.viewMode,
          sortBy: state.sortBy,
          sortOrder: state.sortOrder,
        }),
      }
    ),
    {
      name: 'workspace-store',
    }
  )
)
