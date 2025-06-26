Write-Host "Installing Firebase Functions dependencies..." -ForegroundColor Green
Set-Location functions
npm install
Set-Location ..

Write-Host "Starting Firebase emulators with demo project..." -ForegroundColor Green
npx firebase emulators:start --project=demo-test

Read-Host "Press Enter to exit"
