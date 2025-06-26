
export const SettingsPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Настройки</h1>
        <p className="text-gray-600">Персонализируйте свой опыт использования</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <nav className="space-y-2">
              <button className="w-full text-left px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                Общие
              </button>
              <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                Уведомления
              </button>
              <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                Pomodoro
              </button>
              <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                Геймификация
              </button>
              <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                Безопасность
              </button>
            </nav>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Общие настройки</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тема
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Системная</option>
                  <option>Светлая</option>
                  <option>Темная</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Язык
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Русский</option>
                  <option>English</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Часовой пояс
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>UTC+3 (Москва)</option>
                  <option>UTC+0 (GMT)</option>
                </select>
              </div>

              <div className="pt-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Сохранить изменения
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
