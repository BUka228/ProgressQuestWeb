@echo off
echo Installing Firebase Functions dependencies...
cd functions
call npm install
cd ..

echo Starting Firebase emulators with demo project...
call npx firebase emulators:start --project=demo-test

pause
