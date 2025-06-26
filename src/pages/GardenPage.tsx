
export const GardenPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Виртуальный сад</h1>
        <p className="text-gray-600">Выращивайте растения за выполненные задачи</p>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-8 min-h-[400px]">
        <div className="text-center">
          <div className="text-6xl mb-4">🌱</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Ваш сад пуст</h3>
          <p className="text-gray-600 mb-6">
            Выполняйте задачи, чтобы получать семена и выращивать растения
          </p>
          <div className="bg-white p-4 rounded-lg shadow-sm inline-block">
            <p className="text-sm text-gray-600">Семена: <span className="font-bold">0</span></p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-2xl mb-2">🌸</div>
          <h4 className="font-medium">Цветы</h4>
          <p className="text-sm text-gray-600">0 растений</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-2xl mb-2">🌳</div>
          <h4 className="font-medium">Деревья</h4>
          <p className="text-sm text-gray-600">0 растений</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-2xl mb-2">🌿</div>
          <h4 className="font-medium">Травы</h4>
          <p className="text-sm text-gray-600">0 растений</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-2xl mb-2">🍄</div>
          <h4 className="font-medium">Грибы</h4>
          <p className="text-sm text-gray-600">0 растений</p>
        </div>
      </div>
    </div>
  );
};
