// Application constants
export const APP_NAME = 'ProgressQuest Universal'
export const APP_VERSION = '1.0.0'

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/app',
  TASKS: '/app/tasks',
  PROJECTS: '/app/projects',
  GARDEN: '/app/garden',
  ANALYTICS: '/app/analytics',
  SETTINGS: '/app/settings',
  PROFILE: '/app/profile',
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'theme',
  USER_PREFERENCES: 'user_preferences',
  POMODORO_SETTINGS: 'pomodoro_settings',
  LAST_WORKSPACE: 'last_workspace',
} as const

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const

// Validation
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_TASK_TITLE_LENGTH: 100,
  MAX_TASK_DESCRIPTION_LENGTH: 1000,
  MAX_PROJECT_NAME_LENGTH: 50,
  MAX_WORKSPACE_NAME_LENGTH: 50,
} as const

// Pomodoro Timer
export const POMODORO = {
  DEFAULT_WORK_DURATION: 25 * 60, // 25 minutes in seconds
  DEFAULT_SHORT_BREAK: 5 * 60,   // 5 minutes in seconds
  DEFAULT_LONG_BREAK: 15 * 60,   // 15 minutes in seconds
  DEFAULT_LONG_BREAK_INTERVAL: 4, // Every 4 pomodoros
} as const

// XP and Levels
export const GAMIFICATION = {
  XP_PER_TASK: 10,
  XP_PER_POMODORO: 5,
  XP_BONUS_STREAK: 5,
  BASE_XP_FOR_LEVEL: 100,
  XP_MULTIPLIER: 1.5,
} as const

// Theme Colors
export const THEME_COLORS = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const

// Task Status Colors
export const STATUS_COLORS = {
  todo: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  review: 'bg-purple-100 text-purple-800',
  done: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
} as const

// Priority Colors
export const PRIORITY_COLORS = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
} as const

// Garden Plant Categories
export const PLANT_CATEGORIES = {
  FLOWERS: 'flowers',
  TREES: 'trees',
  HERBS: 'herbs',
  MUSHROOMS: 'mushrooms',
} as const

// Achievement Categories
export const ACHIEVEMENT_CATEGORIES = {
  TASKS: 'tasks',
  POMODORO: 'pomodoro',
  STREAK: 'streak',
  SOCIAL: 'social',
  GARDEN: 'garden',
} as const

// Notification Types
export const NOTIFICATION_TYPES = {
  TASK_REMINDER: 'task_reminder',
  POMODORO_BREAK: 'pomodoro_break',
  ACHIEVEMENT: 'achievement',
  INVITATION: 'invitation',
  MENTION: 'mention',
  SYSTEM: 'system',
} as const

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Ошибка сети. Проверьте подключение к интернету.',
  UNAUTHORIZED: 'Недостаточно прав доступа.',
  NOT_FOUND: 'Запрашиваемый ресурс не найден.',
  VALIDATION_ERROR: 'Ошибка валидации данных.',
  UNKNOWN_ERROR: 'Произошла неизвестная ошибка.',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  TASK_CREATED: 'Задача успешно создана',
  TASK_UPDATED: 'Задача обновлена',
  TASK_DELETED: 'Задача удалена',
  PROJECT_CREATED: 'Проект создан',
  PROJECT_UPDATED: 'Проект обновлен',
  SETTINGS_SAVED: 'Настройки сохранены',
  PROFILE_UPDATED: 'Профиль обновлен',
} as const
