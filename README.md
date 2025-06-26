# ProgressQuest Universal - Web Application

Полнофункциональное веб-приложение для повышения продуктивности с элементами геймификации.

## 🌟 Особенности

- **Управление задачами** - Создание, редактирование и отслеживание задач
- **Система проектов** - Организация задач по проектам
- **Pomodoro таймер** - Техника Pomodoro для фокусировки
- **Геймификация** - XP, уровни, достижения и стрики
- **Виртуальный сад** - Выращивание растений за выполнение задач
- **Аналитика** - Подробная статистика продуктивности
- **Темная/светлая тема** - Переключение тем
- **Реальное время** - Синхронизация данных в реальном времени
- **Адаптивный дизайн** - Работает на всех устройствах

## 🛠 Технологический стек

### Frontend
- **React 18** - UI библиотека
- **TypeScript** - Типизированный JavaScript
- **Vite** - Сборщик и инструмент разработки
- **Tailwind CSS** - CSS фреймворк
- **Radix UI** - Компоненты интерфейса

### State Management
- **Zustand** - Управление состоянием
- **React Query** - Кэширование и синхронизация данных
- **Immer** - Иммутабельные обновления

### Backend & Database
- **Firebase** - Backend-as-a-Service
  - Authentication - Аутентификация пользователей
  - Firestore - NoSQL база данных
  - Cloud Functions - Серверная логика
  - Storage - Хранение файлов
  - Hosting - Хостинг приложения

### Development Tools
- **ESLint** - Линтер JavaScript/TypeScript
- **Prettier** - Форматтер кода
- **Husky** - Git hooks

## 🚀 Быстрый старт

### Предварительные требования

- Node.js 18.0.0 или выше
- npm или yarn
- Firebase аккаунт

### Установка

1. **Клонирование репозитория**
```bash
git clone https://github.com/your-username/progressquest-universal.git
cd progressquest-universal
```

2. **Установка зависимостей**
```bash
npm install
```

3. **Настройка Firebase**

   a. Создайте новый проект в [Firebase Console](https://console.firebase.google.com/)
   
   b. Включите следующие сервисы:
   - Authentication (Email/Password, Google)
   - Firestore Database
   - Storage
   - Hosting

   c. Скопируйте конфигурацию Firebase из настроек проекта

4. **Настройка переменных окружения**

Создайте файл `.env.local` в корне проекта:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdefghijklmnop

VITE_APP_NAME=ProgressQuest Universal
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development

VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_GARDEN=true
VITE_ENABLE_COLLABORATION=true
```

5. **Настройка Firestore правил безопасности**

Скопируйте содержимое `firestore.rules` в Firebase Console > Firestore Database > Rules

6. **Настройка индексов Firestore**

Импортируйте `firestore.indexes.json` в Firebase Console или создайте индексы автоматически при первых запросах

### Запуск проекта

```bash
# Режим разработки
npm run dev

# Сборка для продакшена
npm run build

# Предварительный просмотр продакшен сборки
npm run preview

# Линтинг
npm run lint

# Проверка типов
npm run type-check
```

## 📁 Структура проекта

```
src/
├── components/          # React компоненты
│   ├── ui/             # Базовые UI компоненты
│   ├── Layout.tsx      # Основной макет
│   └── ProtectedRoute.tsx
├── pages/              # Страницы приложения
│   ├── LandingPage.tsx
│   ├── DashboardPage.tsx
│   ├── TasksPage.tsx
│   └── ...
├── contexts/           # React контексты
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── stores/             # Zustand стейт менеджеры
│   ├── appStore.ts
│   └── pomodoroStore.ts
├── hooks/              # Кастомные React хуки
│   ├── useTasks.ts
│   └── ...
├── services/           # API сервисы
│   ├── firebase.ts
│   ├── userService.ts
│   ├── taskService.ts
│   └── ...
├── utils/              # Утилиты
│   ├── helpers.ts
│   └── dateTime.ts
├── types/              # TypeScript типы
│   └── index.ts
├── constants/          # Константы приложения
│   └── index.ts
└── lib/                # Конфигурация библиотек
    └── firebase.ts
```

## 🔧 Конфигурация

### Firebase

1. **Authentication Providers**
   - Email/Password
   - Google Sign-in

2. **Firestore Collections**
   - `users` - Пользователи
   - `workspaces` - Рабочие пространства
   - `projects` - Проекты
   - `tasks` - Задачи
   - `pomodoroSessions` - Pomodoro сессии
   - `userAchievements` - Достижения пользователей
   - `gardenPlants` - Растения сада
   - `notifications` - Уведомления

3. **Storage Structure**
   ```
   /users/{userId}/
   ├── avatar.jpg
   └── attachments/
       └── {taskId}/
   ```

### Environment Variables

| Переменная | Описание | Обязательная |
|------------|----------|--------------|
| `VITE_FIREBASE_API_KEY` | Firebase API ключ | ✅ |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth домен | ✅ |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | ✅ |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage bucket | ✅ |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging ID | ✅ |
| `VITE_FIREBASE_APP_ID` | Firebase App ID | ✅ |
| `VITE_ENABLE_ANALYTICS` | Включить аналитику | ❌ |
| `VITE_ENABLE_GARDEN` | Включить виртуальный сад | ❌ |

## 🚀 Развертывание

### Firebase Hosting

1. **Установка Firebase CLI**
```bash
npm install -g firebase-tools
```

2. **Авторизация**
```bash
firebase login
```

3. **Инициализация проекта**
```bash
firebase init
```

4. **Сборка и развертывание**
```bash
npm run build
firebase deploy
```

### Альтернативные платформы

- **Vercel**: Подключите GitHub репозиторий
- **Netlify**: Drag & drop папки `dist`
- **GitHub Pages**: Используйте GitHub Actions

## 🧪 Тестирование

```bash
# Запуск тестов
npm run test

# Покрытие тестами
npm run test:coverage

# E2E тесты
npm run test:e2e
```

## 📊 Производительность

- **Lighthouse Score**: 90+
- **Bundle Size**: ~500KB gzipped
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3s

## 🔐 Безопасность

- HTTPS Only
- Firebase Security Rules
- Input Sanitization
- XSS Protection
- CSRF Protection

## 🤝 Вклад в проект

1. Fork проекта
2. Создайте feature ветку (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в ветку (`git push origin feature/amazing-feature`)
5. Создайте Pull Request

## 📝 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 🆘 Поддержка

- 📧 Email: support@progressquest.com
- 💬 Discord: [ProgressQuest Community](https://discord.gg/progressquest)
- 📖 Wiki: [Project Wiki](https://github.com/your-username/progressquest-universal/wiki)

## 🗺 Roadmap

### v1.1.0
- [ ] Мобильное приложение (React Native)
- [ ] Командная работа в реальном времени
- [ ] Интеграции с внешними сервисами

### v1.2.0
- [ ] AI-помощник для планирования
- [ ] Расширенная аналитика
- [ ] Темплейты проектов

### v2.0.0
- [ ] Белые лейблы
- [ ] Enterprise функции
- [ ] API для интеграций

## 🙏 Благодарности

- [React](https://reactjs.org/) - UI библиотека
- [Firebase](https://firebase.google.com/) - Backend платформа
- [Tailwind CSS](https://tailwindcss.com/) - CSS фреймворк
- [Radix UI](https://www.radix-ui.com/) - UI примитивы
