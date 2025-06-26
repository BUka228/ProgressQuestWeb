@echo off
echo Starting ProgressQuest Universal Development Environment
echo.

echo [1/3] Installing dependencies...
call npm install

echo [2/3] Installing Firebase Functions dependencies...
cd functions
call npm install
cd ..

echo [3/3] Starting development servers...
start "Firebase Emulators" cmd /k "npx firebase emulators:start --project=demo-test"
timeout /t 5 /nobreak
start "Vite Dev Server" cmd /k "npm run dev"

echo.
echo Development environment started!
echo - Firebase Emulators UI: http://localhost:4000
echo - Web App: http://localhost:5173
echo.
pause
