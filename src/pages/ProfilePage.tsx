
export const ProfilePage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Профиль</h1>
        <p className="text-gray-600">Управляйте своим профилем и достижениями</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl text-gray-500">👤</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">Пользователь</h2>
            <p className="text-gray-600 mb-4">user@example.com</p>
            
            <div className="border-t pt-4">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-purple-600">1</div>
                <div className="text-sm text-gray-600">Уровень</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div className="bg-purple-600 h-2 rounded-full" style={{width: '0%'}}></div>
              </div>
              <div className="text-sm text-gray-600">0 / 100 XP</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">Статистика</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Выполнено задач:</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pomodoro сессий:</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Дней подряд:</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Проектов:</span>
                <span className="font-semibold">0</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-6">Личная информация</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Имя
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue="Пользователь"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue="user@example.com"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Сохранить изменения
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-6">Достижения</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">🏆</div>
                <div className="text-sm font-medium">Первые шаги</div>
                <div className="text-xs text-gray-500">Заблокировано</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">⭐</div>
                <div className="text-sm font-medium">Продуктивный</div>
                <div className="text-xs text-gray-500">Заблокировано</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">🔥</div>
                <div className="text-sm font-medium">Streak мастер</div>
                <div className="text-xs text-gray-500">Заблокировано</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">🌱</div>
                <div className="text-sm font-medium">Садовник</div>
                <div className="text-xs text-gray-500">Заблокировано</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
