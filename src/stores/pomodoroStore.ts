import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { PomodoroSession, PomodoroSettings } from '@/types'
import { POMODORO } from '@/constants'

type PomodoroStatus = 'idle' | 'running' | 'paused' | 'completed'
type SessionType = 'work' | 'short_break' | 'long_break'

interface PomodoroState {
  // Timer state
  timeRemaining: number
  totalTime: number
  status: PomodoroStatus
  sessionType: SessionType
  currentSession: PomodoroSession | null
  
  // Session tracking
  completedPomodoros: number
  dailyGoal: number
  
  // Settings
  settings: PomodoroSettings
  
  // Current task
  currentTaskId: string | null
  
  // Actions
  startTimer: (taskId?: string) => void
  pauseTimer: () => void
  resumeTimer: () => void
  stopTimer: () => void
  completeSession: () => void
  skipSession: () => void
  resetTimer: () => void
  setTimeRemaining: (time: number) => void
  setSettings: (settings: Partial<PomodoroSettings>) => void
  setDailyGoal: (goal: number) => void
  setCurrentTask: (taskId: string | null) => void
  tick: () => void
}

const defaultSettings: PomodoroSettings = {
  workDuration: POMODORO.DEFAULT_WORK_DURATION / 60, // Convert to minutes
  shortBreakDuration: POMODORO.DEFAULT_SHORT_BREAK / 60,
  longBreakDuration: POMODORO.DEFAULT_LONG_BREAK / 60,
  longBreakInterval: POMODORO.DEFAULT_LONG_BREAK_INTERVAL,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  soundEnabled: true,
  soundVolume: 50,
}

const initialState = {
  timeRemaining: defaultSettings.workDuration * 60,
  totalTime: defaultSettings.workDuration * 60,
  status: 'idle' as PomodoroStatus,
  sessionType: 'work' as SessionType,
  currentSession: null,
  completedPomodoros: 0,
  dailyGoal: 8,
  settings: defaultSettings,
  currentTaskId: null,
}

export const usePomodoroStore = create<PomodoroState>()(
  devtools(
    immer((set) => ({
      ...initialState,

      startTimer: (taskId) =>
        set((state) => {
          const { settings, sessionType } = state
          let duration: number

          switch (sessionType) {
            case 'work':
              duration = settings.workDuration * 60
              break
            case 'short_break':
              duration = settings.shortBreakDuration * 60
              break
            case 'long_break':
              duration = settings.longBreakDuration * 60
              break
          }

          state.status = 'running'
          state.timeRemaining = duration
          state.totalTime = duration
          state.currentTaskId = taskId || null
          
          // Create new session
          state.currentSession = {
            id: Date.now().toString(),
            taskId: taskId,
            workspaceId: '', // TODO: Get from current workspace
            userId: '', // TODO: Get from current user
            type: sessionType,
            duration,
            startTime: new Date(),
            isCompleted: false,
            isPaused: false,
            pausedDuration: 0,
            tags: [],
          }
        }),

      pauseTimer: () =>
        set((state) => {
          if (state.status === 'running') {
            state.status = 'paused'
            if (state.currentSession) {
              state.currentSession.isPaused = true
            }
          }
        }),

      resumeTimer: () =>
        set((state) => {
          if (state.status === 'paused') {
            state.status = 'running'
            if (state.currentSession) {
              state.currentSession.isPaused = false
            }
          }
        }),

      stopTimer: () =>
        set((state) => {
          state.status = 'idle'
          state.timeRemaining = state.totalTime
          state.currentSession = null
          state.currentTaskId = null
        }),

      completeSession: () =>
        set((state) => {
          if (state.currentSession) {
            state.currentSession.isCompleted = true
            state.currentSession.endTime = new Date()
          }

          if (state.sessionType === 'work') {
            state.completedPomodoros += 1
            
            // Determine next session type
            const isLongBreakTime = 
              state.completedPomodoros % state.settings.longBreakInterval === 0
            
            state.sessionType = isLongBreakTime ? 'long_break' : 'short_break'
          } else {
            state.sessionType = 'work'
          }

          state.status = 'completed'
          state.timeRemaining = 0
        }),

      skipSession: () =>
        set((state) => {
          if (state.sessionType === 'work') {
            const isLongBreakTime = 
              (state.completedPomodoros + 1) % state.settings.longBreakInterval === 0
            state.sessionType = isLongBreakTime ? 'long_break' : 'short_break'
          } else {
            state.sessionType = 'work'
          }

          state.status = 'idle'
          state.currentSession = null
          state.currentTaskId = null
        }),

      resetTimer: () =>
        set((state) => {
          Object.assign(state, initialState)
        }),

      setTimeRemaining: (time) =>
        set((state) => {
          state.timeRemaining = time
        }),

      setSettings: (newSettings) =>
        set((state) => {
          state.settings = { ...state.settings, ...newSettings }
          
          // Update timer if idle and session type matches
          if (state.status === 'idle') {
            switch (state.sessionType) {
              case 'work':
                state.timeRemaining = state.settings.workDuration * 60
                state.totalTime = state.settings.workDuration * 60
                break
              case 'short_break':
                state.timeRemaining = state.settings.shortBreakDuration * 60
                state.totalTime = state.settings.shortBreakDuration * 60
                break
              case 'long_break':
                state.timeRemaining = state.settings.longBreakDuration * 60
                state.totalTime = state.settings.longBreakDuration * 60
                break
            }
          }
        }),

      setDailyGoal: (goal) =>
        set((state) => {
          state.dailyGoal = goal
        }),

      setCurrentTask: (taskId) =>
        set((state) => {
          state.currentTaskId = taskId
        }),

      tick: () =>
        set((state) => {
          if (state.status === 'running' && state.timeRemaining > 0) {
            state.timeRemaining -= 1
            
            if (state.timeRemaining === 0) {
              // Auto-complete session
              if (state.currentSession) {
                state.currentSession.isCompleted = true
                state.currentSession.endTime = new Date()
              }

              if (state.sessionType === 'work') {
                state.completedPomodoros += 1
                
                const isLongBreakTime = 
                  state.completedPomodoros % state.settings.longBreakInterval === 0
                
                state.sessionType = isLongBreakTime ? 'long_break' : 'short_break'
              } else {
                state.sessionType = 'work'
              }

              state.status = 'completed'
            }
          }
        }),
    })),
    {
      name: 'pomodoro-store',
    }
  )
)
