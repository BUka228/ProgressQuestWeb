import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const ProfilePage = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const [isEditingName, setIsEditingName] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(currentUser?.displayName || '');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDisplayName.trim()) {
      toast.error('Имя не может быть пустым');
      return;
    }
    
    try {
      await updateUserProfile(newDisplayName.trim());
      setIsEditingName(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const formatJoinDate = (user: any) => {
    if (user?.metadata?.creationTime) {
      return new Date(user.metadata.creationTime).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return 'Неизвестно';
  };

  const getEmailVerificationStatus = () => {
    if (currentUser?.emailVerified) {
      return { text: 'Подтвержден', color: 'text-green-600' };
    }
    return { text: 'Не подтвержден', color: 'text-orange-600' };
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-purple-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 drop-shadow-sm">Профиль</h1>
        <p className="text-slate-600 font-medium">Управляйте своим профилем и достижениями</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-white/50 p-6 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'Пользователь'}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl text-slate-600">👤</span>
              )}
            </div>
            
            {isEditingName ? (
              <form onSubmit={handleUpdateProfile} className="mb-4">
                <input
                  type="text"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-center font-semibold"
                  autoFocus
                />
                <div className="flex justify-center space-x-2 mt-2">
                  <button
                    type="submit"
                    className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                  >
                    Сохранить
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingName(false);
                      setNewDisplayName(currentUser?.displayName || '');
                    }}
                    className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                  >
                    Отмена
                  </button>
                </div>
              </form>
            ) : (
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-1 text-slate-800">
                  {currentUser?.displayName || 'Пользователь'}
                </h2>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-sm text-purple-600 hover:text-purple-800 underline"
                >
                  Изменить имя
                </button>
              </div>
            )}
            
            <p className="text-slate-600 mb-2">{currentUser?.email}</p>
            <div className={`text-xs ${getEmailVerificationStatus().color} mb-4`}>
              Email: {getEmailVerificationStatus().text}
            </div>
            
            <div className="border-t border-slate-200 pt-4">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-purple-600">1</div>
                <div className="text-sm text-slate-600">Уровень</div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                <div className="bg-purple-600 h-2 rounded-full" style={{width: '0%'}}></div>
              </div>
              <div className="text-sm text-slate-600">0 / 100 XP</div>
            </div>
            
            <div className="border-t border-slate-200 pt-4 mt-4">
              <div className="text-xs text-slate-500">
                Регистрация: {formatJoinDate(currentUser)}
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-white/50 p-6 mt-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Статистика</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Выполнено задач:</span>
                <span className="font-semibold text-slate-800">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Pomodoro сессий:</span>
                <span className="font-semibold text-slate-800">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Дней подряд:</span>
                <span className="font-semibold text-slate-800">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Проектов:</span>
                <span className="font-semibold text-slate-800">0</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-white/50 p-6 mb-6">
            <h3 className="text-xl font-semibold mb-6 text-slate-700">Информация об аккаунте</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Отображаемое имя
                </label>
                <div className="px-3 py-2 border border-slate-300 rounded-md bg-slate-50 text-slate-700">
                  {currentUser?.displayName || 'Не указано'}
                </div>
                <p className="text-xs text-slate-500 mt-1">Используйте кнопку "Изменить имя" в боковой панели</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email адрес
                </label>
                <div className="px-3 py-2 border border-slate-300 rounded-md bg-slate-50 text-slate-700">
                  {currentUser?.email}
                </div>
                <p className="text-xs text-slate-500 mt-1">Email нельзя изменить после регистрации</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Статус верификации
                </label>
                <div className={`px-3 py-2 border border-slate-300 rounded-md ${currentUser?.emailVerified ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                  {currentUser?.emailVerified ? '✅ Email подтвержден' : '⚠️ Email не подтвержден'}
                </div>
                {!currentUser?.emailVerified && (
                  <p className="text-xs text-orange-600 mt-1">Проверьте почту и подтвердите email адрес</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Провайдер входа
                </label>
                <div className="px-3 py-2 border border-slate-300 rounded-md bg-slate-50 text-slate-700">
                  {currentUser?.providerData?.[0]?.providerId === 'google.com' ? '🔗 Google' : '📧 Email/Пароль'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-white/50 p-6">
            <h3 className="text-xl font-semibold mb-6 text-slate-700">Достижения</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg hover:shadow-md transition-all duration-200">
                <div className="text-2xl mb-2">🏆</div>
                <div className="text-sm font-medium text-slate-700">Первые шаги</div>
                <div className="text-xs text-slate-500">Заблокировано</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg hover:shadow-md transition-all duration-200">
                <div className="text-2xl mb-2">⭐</div>
                <div className="text-sm font-medium text-slate-700">Продуктивный</div>
                <div className="text-xs text-slate-500">Заблокировано</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg hover:shadow-md transition-all duration-200">
                <div className="text-2xl mb-2">🔥</div>
                <div className="text-sm font-medium text-slate-700">Streak мастер</div>
                <div className="text-xs text-slate-500">Заблокировано</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg hover:shadow-md transition-all duration-200">
                <div className="text-2xl mb-2">🌱</div>
                <div className="text-sm font-medium text-slate-700">Садовник</div>
                <div className="text-xs text-slate-500">Заблокировано</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
