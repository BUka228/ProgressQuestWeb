import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithPopup,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase' // Import googleProvider
import { toast } from 'sonner'

interface AuthContextType {
  currentUser: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, displayName: string) => Promise<void>
  logout: () => Promise<void>
  loginWithGoogle: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateUserProfile: (displayName: string) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  loading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast.success('Успешный вход в систему!')
    } catch (error: any) {
      console.error('Login error:', error)
      switch (error.code) {
        case 'auth/user-not-found':
          toast.error('Пользователь с таким email не найден')
          break
        case 'auth/wrong-password':
          toast.error('Неверный пароль')
          break
        case 'auth/invalid-email':
          toast.error('Неверный формат email')
          break
        case 'auth/too-many-requests':
          toast.error('Слишком много неудачных попыток. Попробуйте позже')
          break
        case 'auth/network-request-failed':
          toast.error('Ошибка подключения к серверу. Проверьте интернет соединение')
          break
        default:
          toast.error('Ошибка входа: ' + error.message)
      }
      throw error
    }
  }

  const register = async (email: string, password: string, displayName: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(result.user, { displayName })
      await sendEmailVerification(result.user)
      toast.success('Регистрация успешна! Проверьте email для подтверждения.')
    } catch (error: any) {
      console.error('Registration error:', error)
      switch (error.code) {
        case 'auth/email-already-in-use':
          toast.error('Пользователь с таким email уже существует')
          break
        case 'auth/weak-password':
          toast.error('Пароль должен содержать минимум 6 символов')
          break
        case 'auth/invalid-email':
          toast.error('Неверный формат email')
          break
        case 'auth/network-request-failed':
          toast.error('Ошибка подключения к серверу. Проверьте интернет соединение')
          break
        default:
          toast.error('Ошибка регистрации: ' + error.message)
      }
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      toast.success('Вы успешно вышли из системы')
    } catch (error: any) {
      console.error('Logout error:', error)
      toast.error('Ошибка выхода из системы')
      throw error
    }
  }

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider) // Use imported googleProvider
      toast.success('Успешный вход через Google!')
    } catch (error: any) {
      console.error('Google login error:', error)
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        // Пользователь закрыл окно - не показываем ошибку
        return
      } else if (error.code === 'auth/network-request-failed') {
        toast.error('Ошибка подключения к серверу. Проверьте интернет соединение')
      } else {
        toast.error('Ошибка входа через Google: ' + error.message)
      }
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email)
      toast.success('Инструкции по сбросу пароля отправлены на email')
    } catch (error: any) {
      console.error('Password reset error:', error)
      switch (error.code) {
        case 'auth/user-not-found':
          toast.error('Пользователь с таким email не найден')
          break
        case 'auth/invalid-email':
          toast.error('Неверный формат email')
          break
        case 'auth/network-request-failed':
          toast.error('Ошибка подключения к серверу. Проверьте интернет соединение')
          break
        default:
          toast.error('Ошибка сброса пароля: ' + error.message)
      }
      throw error
    }
  }

  const updateUserProfile = async (displayName: string) => {
    try {
      if (currentUser) {
        await updateProfile(currentUser, { displayName })
        toast.success('Профиль обновлен')
      }
    } catch (error: any) {
      console.error('Profile update error:', error)
      if (error.code === 'auth/network-request-failed') {
        toast.error('Ошибка подключения к серверу. Проверьте интернет соединение')
      } else {
        toast.error('Ошибка обновления профиля: ' + error.message)
      }
      throw error
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      if (currentUser && currentUser.email) {
        const credential = EmailAuthProvider.credential(currentUser.email, currentPassword)
        await reauthenticateWithCredential(currentUser, credential)
        await updatePassword(currentUser, newPassword)
        toast.success('Пароль успешно изменен')
      }
    } catch (error: any) {
      console.error('Password change error:', error)
      switch (error.code) {
        case 'auth/wrong-password':
          toast.error('Неверный текущий пароль')
          break
        case 'auth/weak-password':
          toast.error('Новый пароль должен содержать минимум 6 символов')
          break
        case 'auth/network-request-failed':
          toast.error('Ошибка подключения к серверу. Проверьте интернет соединение')
          break
        default:
          toast.error('Ошибка изменения пароля: ' + error.message)
      }
      throw error
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value: AuthContextType = {
    currentUser,
    login,
    register,
    logout,
    loginWithGoogle,
    resetPassword,
    updateUserProfile,
    changePassword,
    loading,
    isAuthenticated: !!currentUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

