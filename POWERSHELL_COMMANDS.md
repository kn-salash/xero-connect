# PowerShell Commands Reference

## Starting Cloudflare Tunnel

Open a **NEW PowerShell terminal** and run:

```powershell
cloudflared tunnel --url http://localhost:3000
```

## Starting Backend Server

In your project directory:

```powershell
cd c:\xampp\htdocs\xero-connect
npm run server
```

## Starting React App (if needed separately)

```powershell
cd c:\xampp\htdocs\xero-connect
$env:BROWSER='none'
npm start
```

## Starting Both Together

```powershell
cd c:\xampp\htdocs\xero-connect
npm run dev
```

## Checking if Ports are in Use

```powershell
# Check port 5000 (backend)
Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue

# Check port 3000 (React)
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
```

## Stopping Processes on Ports

```powershell
# Find and stop process on port 5000
$process = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($process) { Stop-Process -Id $process -Force }

# Find and stop process on port 3000
$process = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($process) { Stop-Process -Id $process -Force }
```

## Testing Backend Health

```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing
```

## Viewing Environment Variables

```powershell
Get-Content .env
```

## Installing Packages

```powershell
npm install
```

## Checking Node Version

```powershell
node --version
npm --version
```

