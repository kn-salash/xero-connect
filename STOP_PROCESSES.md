# Stop Processes on Ports - PowerShell

## Stop Process on Port 5000 (Backend)

```powershell
$connection = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($connection) {
    $processId = $connection | Select-Object -ExpandProperty OwningProcess -Unique
    Stop-Process -Id $processId -Force
    Write-Host "Stopped process on port 5000"
}
```

## Stop Process on Port 3000 (React)

```powershell
$connection = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($connection) {
    $processId = $connection | Select-Object -ExpandProperty OwningProcess -Unique
    Stop-Process -Id $processId -Force
    Write-Host "Stopped process on port 3000"
}
```

## Stop All Node Processes

```powershell
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
```

## Check What's Using a Port

```powershell
Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object LocalPort, State, OwningProcess
```

## Restart Servers

After stopping processes:

```powershell
cd c:\xampp\htdocs\xero-connect
npm run dev
```

