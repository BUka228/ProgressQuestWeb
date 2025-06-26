@echo off
echo Testing Firebase emulators...
echo.
echo Current directory: %CD%
echo.
echo Starting emulators...
npx firebase emulators:start --project=demo-test
