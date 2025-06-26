# БЫСТРОЕ РЕШЕНИЕ ПРОБЛЕМЫ ERR_CONNECTION_REFUSED

## Проблема
Ваше приложение пытается подключиться к Firebase Functions эмулятору, но получает ошибку:
```
POST http://localhost:5001/progress-quest-universal/us-central1/getUserWorkspaces net::ERR_CONNECTION_REFUSED
```

## Причина
Firebase эмуляторы не запущены или проект не настроен.

## РЕШЕНИЕ

### Шаг 1: Откройте обычную командную строку (cmd)
1. Нажмите Win + R
2. Введите `cmd` и нажмите Enter
3. Перейдите в папку проекта:
   ```
   cd "A:\Progects\Progress Quest Universal\ProgressQuestWeb"
   ```

### Шаг 2: Установите зависимости
```bash
npm install
cd functions
npm install
cd ..
```

### Шаг 3: Запустите эмуляторы
```bash
npx firebase emulators:start --project=demo-test
```

### Шаг 4: В новом окне cmd запустите приложение
```bash
npm run dev
```

## Альтернативное решение через batch файл

1. Откройте проводник
2. Найдите файл `start-dev.bat` в папке проекта
3. Дважды кликните на него

## Проверка работы

1. Откройте http://localhost:4000 - Firebase Emulators UI
2. Откройте http://localhost:5173 - ваше приложение
3. В консоли браузера должно появиться: "✅ Functions emulator connected"

## Если все еще не работает

Возможные причины:
1. **Порт занят** - закройте другие приложения, использующие порты 5001, 4000, 5173
2. **Firewall** - разрешите доступ к портам
3. **Antivirus** - временно отключите или добавьте исключение

## Файлы которые должны быть созданы:
- ✅ `.env` - с переменной VITE_USE_FIREBASE_EMULATORS=true
- ✅ `.firebaserc` - с настройкой проекта
- ✅ `functions/` - папка с Cloud Functions
- ✅ `functions/package.json` - зависимости Functions
- ✅ `functions/src/index.ts` - код Functions

Все эти файлы уже созданы автоматически!
