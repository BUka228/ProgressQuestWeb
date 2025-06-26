import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { User, Workspace, Project } from '@/types'
// import { WorkspaceClientDto } from '@/services/workspaceService' // TODO: использовать при необходимости

interface AppState {
  // User state
  currentUser: User | null
  
  // Current workspace and project
  currentWorkspace: Workspace | null
  currentProject: Project | null
  
  // UI state
  sidebarOpen: boolean
  theme: 'light' | 'dark' | 'system'
  
  // Loading states
  isLoading: boolean
  isInitializing: boolean
  
  // Error state
  error: string | null
  
  // Actions
  setCurrentUser: (user: User | null) => void
  setCurrentWorkspace: (workspace: Workspace | null) => void
  setCurrentProject: (project: Project | null) => void
  setSidebarOpen: (open: boolean) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setLoading: (loading: boolean) => void
  setInitializing: (initializing: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  reset: () => void
}

const initialState = {
  currentUser: null,
  currentWorkspace: null,
  currentProject: null,
  sidebarOpen: true,
  theme: 'system' as const,
  isLoading: false,
  isInitializing: true,
  error: null,
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,

        setCurrentUser: (user) =>
          set((state) => {
            state.currentUser = user
          }),

        setCurrentWorkspace: (workspace) =>
          set((state) => {
            state.currentWorkspace = workspace
          }),

        setCurrentProject: (project) =>
          set((state) => {
            state.currentProject = project
          }),

        setSidebarOpen: (open) =>
          set((state) => {
            state.sidebarOpen = open
          }),

        setTheme: (theme) =>
          set((state) => {
            state.theme = theme
          }),

        setLoading: (loading) =>
          set((state) => {
            state.isLoading = loading
          }),

        setInitializing: (initializing) =>
          set((state) => {
            state.isInitializing = initializing
          }),

        setError: (error) =>
          set((state) => {
            state.error = error
          }),

        clearError: () =>
          set((state) => {
            state.error = null
          }),

        reset: () =>
          set((state) => {
            Object.assign(state, initialState)
          }),
      })),
      {
        name: 'app-store',
        partialize: (state) => ({
          sidebarOpen: state.sidebarOpen,
          theme: state.theme,
          currentWorkspace: state.currentWorkspace,
          currentProject: state.currentProject,
        }),
      }
    ),
    {
      name: 'app-store',
    }
  )
)
