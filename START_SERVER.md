# Start Backend Server

## Quick Start Commands

### Start Backend Server Only

```powershell
cd c:\xampp\htdocs\xero-connect
npm run server
```

### Start Both Backend and React Together

```powershell
cd c:\xampp\htdocs\xero-connect
npm run dev
```

### Check if Server is Running

```powershell
# Check port 5000
Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue

# Test health endpoint
Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing
```

### Stop Server

Press `Ctrl+C` in the terminal where the server is running.

## Troubleshooting

### Port Already in Use

If port 5000 is already in use:

```powershell
# Find process using port 5000
$process = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($process) { 
    Write-Host "Process ID: $process"
    Stop-Process -Id $process -Force
}
```

### Check Server Logs

Look at the terminal output for error messages. Common issues:
- Missing `.env` file
- Missing Xero credentials in `.env`
- Port conflicts

