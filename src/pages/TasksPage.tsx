import { useState } from 'react';
import { CreateTaskModal } from '@/components/CreateTaskModal';

export const TasksPage = () => {
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);

  const handleCreateTask = (taskData: any) => {
    // Здесь будет логика сохранения задачи
    console.log('Создаётся задача на странице задач:', taskData);
    // TODO: Интеграция с backend/Firebase
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 drop-shadow-sm">Задачи</h1>
        <button
          onClick={() => setIsCreateTaskModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md transition-all duration-200 hover:shadow-lg"
        >
          + Новая задача
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <div className="flex space-x-4 mb-6">
            <button className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
              Все
            </button>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              К выполнению
            </button>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              В работе
            </button>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              Выполнено
            </button>
          </div>

          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">Задач пока нет</p>
            <p className="text-slate-400 mt-2">Создайте свою первую задачу, чтобы начать</p>
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </div>
  );
};
