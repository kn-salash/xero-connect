@echo off
echo Starting Xero Connect Backend Server...
echo.
cd /d "%~dp0"
node server/index.js
pause

