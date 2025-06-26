
export const AnalyticsPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Аналитика</h1>
        <p className="text-gray-600">Отслеживайте свою продуктивность и прогресс</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Задачи за неделю</h3>
          <p className="text-2xl font-bold text-blue-600">0</p>
          <p className="text-sm text-gray-500 mt-1">+0% к прошлой неделе</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Pomodoro сессии</h3>
          <p className="text-2xl font-bold text-green-600">0</p>
          <p className="text-sm text-gray-500 mt-1">+0% к прошлой неделе</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Продуктивность</h3>
          <p className="text-2xl font-bold text-purple-600">0%</p>
          <p className="text-sm text-gray-500 mt-1">+0% к прошлой неделе</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Streak дней</h3>
          <p className="text-2xl font-bold text-orange-600">0</p>
          <p className="text-sm text-gray-500 mt-1">Дней подряд</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Активность по дням</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">График активности</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Распределение по категориям</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Круговая диаграмма</p>
          </div>
        </div>
      </div>
    </div>
  );
};
