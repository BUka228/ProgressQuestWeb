import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-9xl font-bold text-gray-300 mb-4">404</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Страница не найдена</h1>
        <p className="text-xl text-gray-600 mb-8">
          Извините, запрашиваемая страница не существует.
        </p>
        <Link 
          to="/" 
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
};
