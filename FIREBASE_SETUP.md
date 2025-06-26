# Firebase Setup для ProgressQuest Universal

## Быстрый старт

### Вариант 1: Автоматический запуск (рекомендуется)
Запустите `start-dev.bat` - это установит зависимости и запустит все необходимые сервисы.

### Вариант 2: Ручной запуск

1. **Установка зависимостей:**
   ```bash
   npm install
   cd functions
   npm install
   cd ..
   ```

2. **Запуск Firebase эмуляторов:**
   ```bash
   npm run emulators
   # или
   npx firebase emulators:start --project=demo-test
   ```

3. **Запуск веб-приложения (в новом терминале):**
   ```bash
   npm run dev
   ```

## Решение проблемы ERR_CONNECTION_REFUSED

Ошибка `POST http://localhost:5001/... net::ERR_CONNECTION_REFUSED` возникает по следующим причинам:

### 1. Firebase Emulators не запущены
**Решение:** Запустите эмуляторы:
```bash
npm run emulators
```
или
```bash
npx firebase emulators:start
```

### 2. Отсутствует файл .env
**Решение:** Убедитесь, что файл `.env` создан и содержит:
```env
VITE_USE_FIREBASE_EMULATORS=true
```

### 3. Отсутствует папка functions
**Решение:** Уже создана автоматически со всеми необходимыми файлами.

## Проверка работы

1. **Firebase Emulators UI:** http://localhost:4000
2. **Веб-приложение:** http://localhost:5173 (или другой порт, указанный Vite)

В консоли браузера должно появиться сообщение:
```
✅ Functions emulator connected
```

## Структура Firebase Functions

```
functions/
├── src/
│   └── index.ts          # Основные Cloud Functions
├── package.json          # Зависимости Functions
└── tsconfig.json         # TypeScript конфигурация
```

## Доступные Cloud Functions

- `getUserWorkspaces` - получение рабочих пространств пользователя
- `createWorkspace` - создание нового рабочего пространства  
- `getWorkspaceDetails` - получение деталей рабочего пространства
- `updateWorkspace` - обновление рабочего пространства
- `deleteWorkspace` - удаление рабочего пространства

## Troubleshooting

### Проблема с кодировкой в PowerShell
Если команды не работают из-за символа "з" в начале:
1. Используйте предоставленные `.bat` файлы
2. Или запускайте команды через обычную командную строку (cmd)

### Functions не компилируются
```bash
cd functions
npm run build
```

### Порт 5001 занят
Проверьте, что другие процессы не используют порт 5001:
```bash
netstat -ano | findstr :5001
```

### Очистка и переустановка
```bash
# Очистка node_modules
rm -rf node_modules functions/node_modules
npm install
cd functions && npm install
```

## Полезные команды

```bash
# Запуск только Functions эмулятора
npm run emulators:ui

# Проверка статуса эмуляторов
firebase emulators:exec --only functions "echo 'Functions running'"

# Сборка Functions
cd functions && npm run build

# Проверка TypeScript
cd functions && npx tsc --noEmit
```
