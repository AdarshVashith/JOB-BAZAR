@echo off
REM Windows Setup Script for Authentication App

echo =====================================
echo Authentication App Setup Script
echo =====================================
echo.

REM Check Node.js installation
node -v >nul 2>&1
if errorlevel 1 (
    echo X Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo OK Node.js version:
node -v
echo OK npm version:
npm -v
echo.

REM Backend setup
echo Setting up Backend...
cd backend

if not exist ".env" (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo OK .env file created
) else (
    echo WARNING .env file already exists
)

echo Installing backend dependencies...
call npm install

if errorlevel 1 (
    echo X Backend installation failed
    pause
    exit /b 1
)
echo OK Backend dependencies installed
echo.

REM Frontend setup
echo Setting up Frontend...
cd ..\frontend

if not exist ".env" (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo OK .env file created
) else (
    echo WARNING .env file already exists
)

echo Installing frontend dependencies...
call npm install

if errorlevel 1 (
    echo X Frontend installation failed
    pause
    exit /b 1
)
echo OK Frontend dependencies installed
echo.

REM Summary
echo =====================================
echo OK Setup Completed Successfully!
echo =====================================
echo.

echo Next steps:
echo 1. Ensure MongoDB is running
echo 2. Start Backend (from backend folder):
echo    npm start
echo 3. Start Frontend (from frontend folder in new terminal):
echo    npm start
echo 4. Open browser and navigate to http://localhost:3000
echo.
echo For more information, see README.md or QUICKSTART.md
echo.
pause