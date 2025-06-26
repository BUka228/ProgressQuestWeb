
export const ProjectsPage = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Проекты</h1>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          Новый проект
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-dashed border-gray-200 flex flex-col items-center justify-center min-h-[200px]">
          <div className="text-gray-400 text-4xl mb-4">+</div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">Создать проект</h3>
          <p className="text-gray-500 text-sm text-center">
            Организуйте свои задачи в проекты для лучшего управления
          </p>
        </div>
      </div>
    </div>
  );
};
