import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useAppStore } from '@/stores/appStore'
import { usePomodoroStore } from '@/stores/pomodoroStore'
import { cn } from '@/utils/helpers'
import { ROUTES } from '@/constants'
import { DemoBanner } from './DemoBanner'
import { CreateTaskModal } from './CreateTaskModal'
import { WorkspaceSwitcher } from './WorkspaceSwitcher'

interface LayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Панель', href: ROUTES.DASHBOARD, icon: '📊' },
  { name: 'Задачи', href: ROUTES.TASKS, icon: '✅' },
  { name: 'Пространства', href: ROUTES.WORKSPACES, icon: '🏢' },
  { name: 'Проекты', href: ROUTES.PROJECTS, icon: '📁' },
  { name: 'Сад', href: ROUTES.GARDEN, icon: '🌱' },
  { name: 'Аналитика', href: ROUTES.ANALYTICS, icon: '📈' },
  { name: 'Настройки', href: ROUTES.SETTINGS, icon: '⚙️' },
]

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation()
  // const navigate = useNavigate() // TODO: использовать при необходимости
  const { currentUser, logout } = useAuth()
  const { sidebarOpen, setSidebarOpen } = useAppStore()
  const { status, timeRemaining, sessionType, pauseTimer, resumeTimer, stopTimer } = usePomodoroStore()
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleCreateTask = (taskData: any) => {
    // Здесь будет логика сохранения задачи
    console.log('Создаётся задача:', taskData)
    // TODO: Интеграция с backend/Firebase
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b">
            <h1 className="text-xl font-bold text-gray-900">ProgressQuest</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 lg:hidden"
            >
              ✕
            </button>
          </div>

          {/* Pomodoro Timer */}
          {status !== 'idle' && (
            <div className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="text-center">
                <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                  {sessionType === 'work' ? 'Работа' : sessionType === 'short_break' ? 'Короткий перерыв' : 'Длинный перерыв'}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {formatTime(timeRemaining)}
                </div>
                <div className="flex justify-center space-x-2">
                  {status === 'running' ? (
                    <button
                      onClick={pauseTimer}
                      className="px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Пауза
                    </button>
                  ) : (
                    <button
                      onClick={resumeTimer}
                      className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Продолжить
                    </button>
                  )}
                  <button
                    onClick={stopTimer}
                    className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Стоп
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-6 py-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href ||
                (item.href !== ROUTES.DASHBOARD && location.pathname.startsWith(item.href))
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  )}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User Menu */}
          <div className="px-6 py-4 border-t">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {currentUser?.photoURL ? (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || ''}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-sm text-gray-600">👤</span>
                  </div>
                )}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {currentUser?.displayName || 'Пользователь'}
                </p>
                <div className="flex space-x-2 mt-1">
                  <Link
                    to={ROUTES.PROFILE}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Профиль
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Выйти
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={cn(
        'transition-all duration-200 ease-in-out',
        sidebarOpen ? 'lg:pl-64' : ''
      )}>
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            ☰
          </button>
          
          <div className="flex items-center space-x-4">
            {/* Workspace Switcher */}
            <WorkspaceSwitcher className="w-64" compact={false} />
            
            {/* Quick actions */}
            <button
              onClick={() => setIsCreateTaskModalOpen(true)}
              className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              + Новая задача
            </button>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="p-6">
            <DemoBanner />
            {children}
          </div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </div>
  )
}
