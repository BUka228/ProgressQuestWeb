
export const GardenPage = () => {
  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-green-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 drop-shadow-sm">Виртуальный сад</h1>
        <p className="text-slate-600 font-medium">Выращивайте растения за выполненные задачи</p>
      </div>

      <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-lg p-8 min-h-[400px] shadow-lg border border-white/50">
        <div className="text-center">
          <div className="text-6xl mb-4">🌱</div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2 drop-shadow-sm">Ваш сад пуст</h3>
          <p className="text-slate-600 mb-6 font-medium">
            Выполняйте задачи, чтобы получать семена и выращивать растения
          </p>
          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-md inline-block border border-white/50">
            <p className="text-sm text-slate-700 font-medium">Семена: <span className="font-bold">0</span></p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg text-center border border-white/50 hover:shadow-xl transition-all duration-300">
          <div className="text-2xl mb-2">🌸</div>
          <h4 className="font-semibold text-slate-700 drop-shadow-sm">Цветы</h4>
          <p className="text-sm text-slate-600 font-medium">0 растений</p>
        </div>
        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg text-center border border-white/50 hover:shadow-xl transition-all duration-300">
          <div className="text-2xl mb-2">🌳</div>
          <h4 className="font-semibold text-slate-700 drop-shadow-sm">Деревья</h4>
          <p className="text-sm text-slate-600 font-medium">0 растений</p>
        </div>
        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg text-center border border-white/50 hover:shadow-xl transition-all duration-300">
          <div className="text-2xl mb-2">🌿</div>
          <h4 className="font-semibold text-slate-700 drop-shadow-sm">Травы</h4>
          <p className="text-sm text-slate-600 font-medium">0 растений</p>
        </div>
        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg text-center border border-white/50 hover:shadow-xl transition-all duration-300">
          <div className="text-2xl mb-2">🍄</div>
          <h4 className="font-semibold text-slate-700 drop-shadow-sm">Грибы</h4>
          <p className="text-sm text-slate-600 font-medium">0 растений</p>
        </div>
      </div>
    </div>
  );
};
