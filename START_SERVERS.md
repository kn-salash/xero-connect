# Quick Start Guide - Starting Everything

## Starting Both Servers

### Method 1: Automatic (Just Run This)

I've opened two PowerShell windows for you:
- **Backend Server** (port 5000) - Should be running
- **React App** (port 3000) - Compiling (wait 30-60 seconds)

### Method 2: Manual Start

**Terminal 1 - Backend:**
```powershell
cd c:\xampp\htdocs\xero-connect
npm run server
```

**Terminal 2 - React:**
```powershell
cd c:\xampp\htdocs\xero-connect
npm start
```

### Method 3: Both Together

```powershell
cd c:\xampp\htdocs\xero-connect
npm run dev
```

## What to Expect

1. **Backend Server** (port 5000):
   - Starts immediately
   - Shows: "Server running on port 5000"
   - Available at: http://localhost:5000

2. **React App** (port 3000):
   - Takes 30-60 seconds to compile (first time)
   - Shows compilation progress
   - When ready: "Compiled successfully!"
   - Available at: http://localhost:3000

## Verify Everything is Running

**Check Backend:**
```powershell
Invoke-WebRequest -Uri http://localhost:5000/api/health
```

**Check React:**
- Open browser: http://localhost:3000
- Should see "Xero Connect" login page

## Troubleshooting

**If React doesn't start:**
- Check the React terminal window for errors
- Make sure port 3000 isn't blocked
- Try: `npm start` again

**If Backend doesn't start:**
- Check the backend terminal window for errors
- Make sure .env file has Xero credentials
- Try: `npm run server` again

## Next Steps

1. Wait for React to finish compiling
2. Open http://localhost:3000 in browser
3. Click "Connect to Xero"
4. Complete authentication
5. View your accounts!

