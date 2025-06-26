// Пользователь
export interface User {
  id: string
  email: string
  displayName: string
  photoURL?: string
  role: 'free' | 'premium' | 'admin'
  createdAt: Date
  updatedAt: Date
  preferences: UserPreferences
  achievements: string[]
  level: number
  xp: number
  streakCount: number
  totalTasksCompleted: number
  totalPomodoroCompleted: number
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  notifications: NotificationSettings
  pomodoro: PomodoroSettings
  gamification: GamificationSettings
}

export interface NotificationSettings {
  email: boolean
  push: boolean
  desktop: boolean
  taskReminders: boolean
  pomodoroBreaks: boolean
  achievements: boolean
  weeklyReports: boolean
}

export interface PomodoroSettings {
  workDuration: number // в минутах
  shortBreakDuration: number
  longBreakDuration: number
  longBreakInterval: number // после скольких циклов
  autoStartBreaks: boolean
  autoStartPomodoros: boolean
  soundEnabled: boolean
  soundVolume: number
}

export interface GamificationSettings {
  showBadges: boolean
  showLevel: boolean
  showXP: boolean
  showStreak: boolean
  gardenEnabled: boolean
  soundEffects: boolean
}

// Рабочие пространства
export interface Workspace {
  id: string
  name: string
  description?: string
  ownerId: string
  type: 'personal' | 'team'
  members: WorkspaceMember[]
  createdAt: Date
  updatedAt: Date
  settings: WorkspaceSettings
  isArchived: boolean
}

export interface WorkspaceMember {
  userId: string
  email: string
  displayName: string
  role: 'owner' | 'admin' | 'member' | 'viewer'
  joinedAt: Date
  permissions: Permission[]
}

export interface Permission {
  resource: 'tasks' | 'projects' | 'members' | 'settings'
  actions: ('create' | 'read' | 'update' | 'delete')[]
}

export interface WorkspaceSettings {
  isPublic: boolean
  allowMemberInvites: boolean
  defaultTaskView: 'list' | 'kanban' | 'calendar' | 'timeline'
  workingHours: {
    start: string // HH:mm
    end: string // HH:mm
    workDays: number[] // 0-6, 0 = воскресенье
  }
  timezone: string
}

// Проекты
export interface Project {
  id: string
  name: string
  description?: string
  color: string
  icon?: string
  workspaceId: string
  ownerId: string
  isArchived: boolean
  createdAt: Date
  updatedAt: Date
  settings: ProjectSettings
  stats: ProjectStats
}

export interface ProjectSettings {
  isPublic: boolean
  defaultAssignee?: string
  template?: TaskTemplate
  autoArchive: boolean
  autoArchiveDays: number
}

export interface ProjectStats {
  totalTasks: number
  completedTasks: number
  activeTasks: number
  overdueTasks: number
  totalTimeSpent: number // в минутах
}

export interface TaskTemplate {
  title: string
  description?: string
  priority: TaskPriority
  estimatedDuration?: number
  tags: string[]
  subtasks: Omit<TaskTemplate, 'subtasks'>[]
}

// Задачи
export interface Task {
  id: string
  title: string
  description?: string
  projectId?: string
  workspaceId: string
  assigneeId?: string
  createdById: string
  parentId?: string // для подзадач
  status: TaskStatus
  priority: TaskPriority
  tags: string[]
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
  estimatedDuration?: number // в минутах
  actualDuration?: number // в минутах
  pomodoroCount: number
  attachments: TaskAttachment[]
  comments: TaskComment[]
  dependencies: TaskDependency[]
  customFields: Record<string, any>
  isArchived: boolean
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done' | 'cancelled'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface TaskAttachment {
  id: string
  name: string
  url: string
  type: string
  size: number
  uploadedAt: Date
  uploadedBy: string
}

export interface TaskComment {
  id: string
  content: string
  authorId: string
  createdAt: Date
  updatedAt: Date
  isEdited: boolean
  mentions: string[]
}

export interface TaskDependency {
  id: string
  type: 'blocks' | 'blocked_by'
  taskId: string
}

// Пользовательские представления
export interface CustomView {
  id: string
  name: string
  description?: string
  workspaceId: string
  createdById: string
  type: 'list' | 'kanban' | 'calendar' | 'timeline' | 'analytics'
  filters: ViewFilter[]
  sorting: ViewSorting[]
  grouping?: ViewGrouping
  settings: ViewSettings
  isShared: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ViewFilter {
  field: string
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'in' | 'not_in' | 'is_empty' | 'is_not_empty'
  value: any
  logic?: 'and' | 'or'
}

export interface ViewSorting {
  field: string
  direction: 'asc' | 'desc'
}

export interface ViewGrouping {
  field: string
  showEmptyGroups: boolean
}

export interface ViewSettings {
  columns?: string[] // для списочного представления
  showSubtasks: boolean
  showCompleted: boolean
  showArchived: boolean
  colorBy?: string
  density: 'compact' | 'normal' | 'comfortable'
}

// Pomodoro
export interface PomodoroSession {
  id: string
  taskId?: string
  workspaceId: string
  userId: string
  type: 'work' | 'short_break' | 'long_break'
  duration: number // в секундах
  startTime: Date
  endTime?: Date
  isCompleted: boolean
  isPaused: boolean
  pausedDuration: number // в секундах
  tags: string[]
  notes?: string
}

// Достижения и геймификация
export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: 'tasks' | 'pomodoro' | 'streak' | 'social' | 'garden'
  type: 'single' | 'progressive'
  requirements: AchievementRequirement[]
  rewards: AchievementReward[]
  isSecret: boolean
}

export interface AchievementRequirement {
  type: 'task_count' | 'pomodoro_count' | 'streak_days' | 'level_reached' | 'custom'
  value: number
  timeframe?: 'daily' | 'weekly' | 'monthly' | 'all_time'
}

export interface AchievementReward {
  type: 'xp' | 'badge' | 'garden_item' | 'custom'
  value: number | string
}

export interface UserAchievement {
  achievementId: string
  userId: string
  unlockedAt: Date
  progress: number // 0-100
}

// Сад
export interface GardenPlant {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlockRequirements: AchievementRequirement[]
  growthStages: GrowthStage[]
}

export interface GrowthStage {
  name: string
  icon: string
  requiredXP: number
  duration: number // в часах
}

export interface UserGardenPlant {
  id: string
  userId: string
  plantId: string
  plantedAt: Date
  currentStage: number
  currentXP: number
  position: { x: number; y: number }
  isWatered: boolean
  lastWateredAt?: Date
}

// Уведомления
export interface Notification {
  id: string
  userId: string
  type: 'task_reminder' | 'pomodoro_break' | 'achievement' | 'invitation' | 'mention' | 'system'
  title: string
  message: string
  data?: Record<string, any>
  isRead: boolean
  createdAt: Date
  scheduledFor?: Date
}

// Аналитика
export interface AnalyticsData {
  period: 'day' | 'week' | 'month' | 'year'
  startDate: Date
  endDate: Date
  metrics: {
    tasksCompleted: number
    tasksCreated: number
    pomodoroSessions: number
    timeSpent: number // в минутах
    productivity: number // 0-100
    streakDays: number
    xpGained: number
  }
  charts: {
    tasksPerDay: { date: string; count: number }[]
    pomodoroPerDay: { date: string; count: number; duration: number }[]
    productivityTrend: { date: string; score: number }[]
    categoryBreakdown: { category: string; count: number; percentage: number }[]
  }
}

// API Response типы
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T = any> {
  items: T[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}

// Формы
export interface LoginForm {
  email: string
  password: string
  rememberMe: boolean
}

export interface RegisterForm {
  email: string
  password: string
  confirmPassword: string
  displayName: string
  acceptTerms: boolean
}

export interface TaskForm {
  title: string
  description?: string
  projectId?: string
  assigneeId?: string
  priority: TaskPriority
  tags: string[]
  dueDate?: Date
  estimatedDuration?: number
}

export interface ProjectForm {
  name: string
  description?: string
  color: string
  icon?: string
  isPublic: boolean
}

export interface WorkspaceForm {
  name: string
  description?: string
  type: 'personal' | 'team'
  isPublic: boolean
}

// Константы
export const TASK_PRIORITIES: Record<TaskPriority, { label: string; color: string; icon: string }> = {
  low: { label: 'Низкий', color: 'text-green-600', icon: '🔵' },
  medium: { label: 'Средний', color: 'text-yellow-600', icon: '🟡' },
  high: { label: 'Высокий', color: 'text-orange-600', icon: '🟠' },
  urgent: { label: 'Срочный', color: 'text-red-600', icon: '🔴' }
}

export const TASK_STATUSES: Record<TaskStatus, { label: string; color: string; icon: string }> = {
  todo: { label: 'К выполнению', color: 'text-gray-600', icon: '⚪' },
  in_progress: { label: 'В работе', color: 'text-blue-600', icon: '🔵' },
  review: { label: 'На проверке', color: 'text-purple-600', icon: '🟣' },
  done: { label: 'Выполнено', color: 'text-green-600', icon: '✅' },
  cancelled: { label: 'Отменено', color: 'text-red-600', icon: '❌' }
}
