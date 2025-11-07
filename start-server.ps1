# PowerShell script to start the backend server
Write-Host "Starting Xero Connect Backend Server..." -ForegroundColor Green
Write-Host ""
Set-Location $PSScriptRoot
node server/index.js

