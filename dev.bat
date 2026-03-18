@echo off
REM Focus Tracker - Development Server Startup Script (Windows)

echo.
echo 🚀 Focus Tracker - Starting Development Server
echo ==================================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
)

REM Start dev server
echo.
echo ✅ Starting Next.js Development Server...
echo.
echo 🌐 Local:   http://localhost:3000
echo 🌐 Network: http://192.168.x.x:3000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev
pause
