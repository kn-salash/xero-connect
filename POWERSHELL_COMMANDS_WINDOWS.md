# PowerShell Commands - Windows Only

## Check Server Status

### Check if Backend is Running (Port 5000)

```powershell
Test-NetConnection -ComputerName localhost -Port 5000 -InformationLevel Quiet
```

### Check if React is Running (Port 3000)

```powershell
Test-NetConnection -ComputerName localhost -Port 3000 -InformationLevel Quiet
```

### Check Both Ports

```powershell
$backend = Test-NetConnection -ComputerName localhost -Port 5000 -InformationLevel Quiet -WarningAction SilentlyContinue
$react = Test-NetConnection -ComputerName localhost -Port 3000 -InformationLevel Quiet -WarningAction SilentlyContinue

if ($backend) { Write-Host "Backend: Running" -ForegroundColor Green } else { Write-Host "Backend: Not running" -ForegroundColor Red }
if ($react) { Write-Host "React: Running" -ForegroundColor Green } else { Write-Host "React: Not running" -ForegroundColor Red }
```

## Start Servers

### Start Backend Only

```powershell
cd c:\xampp\htdocs\xero-connect
npm run server
```

### Start React Only

```powershell
cd c:\xampp\htdocs\xero-connect
npm start
```

### Start Both Together

```powershell
cd c:\xampp\htdocs\xero-connect
npm run dev
```

## Check Processes

### Find Node Processes

```powershell
Get-Process -Name node -ErrorAction SilentlyContinue | Select-Object Id, ProcessName, Path
```

### Find Process Using Port 5000

```powershell
Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object LocalPort, State, OwningProcess
```

### Stop Process on Port 5000

```powershell
$process = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($process) { Stop-Process -Id $process -Force }
```

## Test Backend Health

```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing
```

## View Environment Variables

```powershell
Get-Content .env
```

## View Specific Environment Variables

```powershell
Get-Content .env | Select-String -Pattern "XERO_REDIRECT_URI|FRONTEND_URL"
```

## Check File Exists

```powershell
Test-Path .env
Test-Path server\index.js
```

## List Directory Contents

```powershell
Get-ChildItem
Get-ChildItem -Directory
Get-ChildItem -File
```

## Read File Content

```powershell
Get-Content .env
Get-Content package.json
```

## Write to File

```powershell
"New content" | Set-Content filename.txt
Add-Content filename.txt -Value "Append this"
```

## Sleep/Wait

```powershell
Start-Sleep -Seconds 5
Start-Sleep -Milliseconds 500
```

