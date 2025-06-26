
export const DashboardPage = () => {
  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 drop-shadow-sm">Панель управления</h1>
        <p className="text-slate-600 font-medium">Добро пожаловать в ProgressQuest Universal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
          <h3 className="text-lg font-semibold mb-2 text-slate-700">Всего задач</h3>
          <p className="text-3xl font-bold text-blue-600 drop-shadow-sm">0</p>
        </div>
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
          <h3 className="text-lg font-semibold mb-2 text-slate-700">Выполнено</h3>
          <p className="text-3xl font-bold text-emerald-600 drop-shadow-sm">0</p>
        </div>
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
          <h3 className="text-lg font-semibold mb-2 text-slate-700">Уровень</h3>
          <p className="text-3xl font-bold text-purple-600 drop-shadow-sm">1</p>
        </div>
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
          <h3 className="text-lg font-semibold mb-2 text-slate-700">Опыт</h3>
          <p className="text-3xl font-bold text-orange-600 drop-shadow-sm">0</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
          <h3 className="text-xl font-semibold mb-4 text-slate-700">Последние задачи</h3>
          <p className="text-slate-500 font-medium">Задач пока нет</p>
        </div>
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
          <h3 className="text-xl font-semibold mb-4 text-slate-700">Активность</h3>
          <p className="text-slate-500 font-medium">График активности</p>
        </div>
      </div>
    </div>
  );
};
