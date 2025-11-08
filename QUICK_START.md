# Quick Start Guide - PowerShell

## Start Both Servers

```powershell
cd c:\xampp\htdocs\xero-connect
npm run dev
```

This starts:
- Backend server on port 5000
- React app on port 3000

## Start Servers Separately

### Backend Only
```powershell
cd c:\xampp\htdocs\xero-connect
npm run server
```

### React Only
```powershell
cd c:\xampp\htdocs\xero-connect
npm start
```

## Check Server Status

```powershell
# Check backend
Test-NetConnection -ComputerName localhost -Port 5000 -InformationLevel Quiet

# Check React
Test-NetConnection -ComputerName localhost -Port 3000 -InformationLevel Quiet
```

## Access Your App

Once servers are running:
- Local: http://localhost:3000

## Stop Servers

Press `Ctrl+C` in the terminal where servers are running.

