@echo off
cd /d "%~dp0"
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

echo Starting Web Server...
call npm run dev
