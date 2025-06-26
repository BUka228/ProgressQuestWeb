import { app } from '@/lib/firebase'

// Initialize Firebase app
export function initializeApp() {
  return app
}

// Utility function to handle Firebase errors
export function handleFirebaseError(error: any): string {
  switch (error.code) {
    case 'auth/user-not-found':
      return 'Пользователь не найден'
    case 'auth/wrong-password':
      return 'Неверный пароль'
    case 'auth/email-already-in-use':
      return 'Email уже используется'
    case 'auth/weak-password':
      return 'Пароль должен содержать минимум 6 символов'
    case 'auth/invalid-email':
      return 'Неверный формат email'
    case 'auth/too-many-requests':
      return 'Слишком много попыток. Попробуйте позже'
    case 'permission-denied':
      return 'Недостаточно прав доступа'
    case 'not-found':
      return 'Документ не найден'
    case 'already-exists':
      return 'Документ уже существует'
    case 'resource-exhausted':
      return 'Превышен лимит запросов'
    case 'unavailable':
      return 'Сервис временно недоступен'
    default:
      console.error('Firebase error:', error)
      return error.message || 'Произошла неизвестная ошибка'
  }
}
