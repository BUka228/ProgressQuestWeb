import { useState } from 'react';

type SettingsSection = 'general' | 'notifications' | 'pomodoro' | 'gamification' | 'security';

export const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');

  const sections = [
    { id: 'general' as const, name: 'Общие', icon: '⚙️' },
    { id: 'notifications' as const, name: 'Уведомления', icon: '🔔' },
    { id: 'pomodoro' as const, name: 'Pomodoro', icon: '🍅' },
    { id: 'gamification' as const, name: 'Геймификация', icon: '🎮' },
    { id: 'security' as const, name: 'Безопасность', icon: '🔒' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6 text-slate-700">Общие настройки</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Тема
                </label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 text-slate-700 font-medium">
                  <option>Системная</option>
                  <option>Светлая</option>
                  <option>Темная</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Язык
                </label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 text-slate-700 font-medium">
                  <option>Русский</option>
                  <option>English</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Часовой пояс
                </label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 text-slate-700 font-medium">
                  <option>UTC+3 (Москва)</option>
                  <option>UTC+0 (GMT)</option>
                </select>
              </div>
              <div className="pt-4">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 shadow-md font-medium transition-all duration-200 hover:shadow-lg">
                  Сохранить изменения
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'notifications':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6 text-slate-700">Настройки уведомлений</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700">Уведомления о задачах</h3>
                  <p className="text-xs text-slate-500">Получать уведомления о новых задачах</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700">Pomodoro уведомления</h3>
                  <p className="text-xs text-slate-500">Уведомления о окончании сессий</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700">Достижения</h3>
                  <p className="text-xs text-slate-500">Уведомления о новых достижениях</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        );
      
      case 'pomodoro':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6 text-slate-700">Настройки Pomodoro</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Продолжительность рабочей сессии (минут)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  defaultValue="25"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 text-slate-700 font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Короткий перерыв (минут)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  defaultValue="5"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 text-slate-700 font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Длинный перерыв (минут)
                </label>
                <input
                  type="number"
                  min="10"
                  max="60"
                  defaultValue="15"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 text-slate-700 font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Количество сессий до длинного перерыва
                </label>
                <input
                  type="number"
                  min="2"
                  max="8"
                  defaultValue="4"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 text-slate-700 font-medium"
                />
              </div>
            </div>
          </div>
        );
      
      case 'gamification':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6 text-slate-700">Настройки геймификации</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700">Система опыта</h3>
                  <p className="text-xs text-slate-500">Получать опыт за выполненные задачи</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700">Достижения</h3>
                  <p className="text-xs text-slate-500">Отображать достижения и награды</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700">Виртуальный сад</h3>
                  <p className="text-xs text-slate-500">Выращивать растения за выполненные задачи</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        );
      
      case 'security':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6 text-slate-700">Настройки безопасности</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-4">Смена пароля</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Текущий пароль
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Новый пароль
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Подтверждение пароля
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 text-slate-700"
                    />
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Изменить пароль
                  </button>
                </div>
              </div>
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-4 text-red-600">Опасная зона</h3>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                  Удалить аккаунт
                </button>
                <p className="text-xs text-slate-500 mt-2">Это действие нельзя отменить</p>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-indigo-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 drop-shadow-sm">Настройки</h1>
        <p className="text-slate-600 font-medium">Персонализируйте свой опыт использования</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-white/50 p-4">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-3 ${
                    activeSection === section.id
                      ? 'bg-blue-100 text-blue-800 shadow-sm border border-blue-200'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  <span className="text-lg">{section.icon}</span>
                  <span>{section.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-white/50 p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};
