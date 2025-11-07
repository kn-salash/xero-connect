@echo off
echo ========================================
echo Starting Xero Connect React App
echo ========================================
echo.
echo Make sure the backend server is running first!
echo Backend should be on: http://localhost:5000
echo.
echo Starting React app on: http://localhost:3000
echo.
cd /d "%~dp0"
set BROWSER=none
call npm start
pause

