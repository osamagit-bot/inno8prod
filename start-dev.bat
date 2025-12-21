@echo off
echo Starting Inno8 Website Development Servers...

REM Start Django backend
echo Starting Django backend on port 8010...
start "Django Backend" cmd /k "cd backend && venv\Scripts\activate && python manage.py runserver 8010"

REM Wait a moment for Django to start
timeout /t 3 /nobreak > nul

REM Start Next.js frontend
echo Starting Next.js frontend on port 3000...
start "Next.js Frontend" cmd /k "npm run dev"

echo Both servers are starting...
echo Frontend: http://localhost:3000
echo Backend: http://localhost:8010
pause