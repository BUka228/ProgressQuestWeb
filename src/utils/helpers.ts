import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Combine class names utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// Throttle function
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Format duration in seconds to human readable format
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours}ч ${minutes}м ${remainingSeconds}с`
  } else if (minutes > 0) {
    return `${minutes}м ${remainingSeconds}с`
  } else {
    return `${remainingSeconds}с`
  }
}

// Calculate XP required for a specific level
export function calculateXPForLevel(level: number): number {
  const baseXP = 100
  const multiplier = 1.5
  return Math.floor(baseXP * Math.pow(multiplier, level - 1))
}

// Calculate level from total XP
export function calculateLevelFromXP(totalXP: number): number {
  let level = 1
  let requiredXP = 0
  
  while (requiredXP <= totalXP) {
    level++
    requiredXP += calculateXPForLevel(level)
  }
  
  return level - 1
}

// Get XP progress for current level
export function getXPProgress(totalXP: number): { currentLevel: number; currentLevelXP: number; nextLevelXP: number; progress: number } {
  const currentLevel = calculateLevelFromXP(totalXP)
  const currentLevelStartXP = Array.from({ length: currentLevel - 1 }, (_, i) => calculateXPForLevel(i + 1)).reduce((a, b) => a + b, 0)
  const currentLevelXP = totalXP - currentLevelStartXP
  const nextLevelXP = calculateXPForLevel(currentLevel + 1)
  const progress = Math.round((currentLevelXP / nextLevelXP) * 100)

  return {
    currentLevel,
    currentLevelXP,
    nextLevelXP,
    progress
  }
}

// Capitalize first letter
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

// Format number with thousand separators
export function formatNumber(num: number): string {
  return num.toLocaleString('ru-RU')
}

// Get random element from array
export function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

// Sleep function for async operations
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
