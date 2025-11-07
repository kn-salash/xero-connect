# Fix ERR_CONNECTION_REFUSED

## What ERR_CONNECTION_REFUSED Means

This error means:
- **React app is NOT running on port 3000**
- The browser can't connect because nothing is listening on that port

## Solution

### Step 1: Start React App

React needs to be started separately. Run this command:

```powershell
cd c:\xampp\htdocs\xero-connect
npm start
```

### Step 2: Wait for Compilation

- **First time**: 30-60 seconds
- **Subsequent**: 10-20 seconds
- **Look for**: "Compiled successfully!" message

### Step 3: Verify It's Running

Check if port 3000 is listening:
```powershell
netstat -ano | findstr ":3000" | findstr "LISTENING"
```

If you see output, React is running!

## Why This Happens

- React app must be started with `npm start`
- It's not automatically running
- Backend (port 5000) and React (port 3000) are separate processes

## Quick Start Both Servers

**Option 1: Together**
```powershell
npm run dev
```

**Option 2: Separately**
```powershell
# Terminal 1 - Backend
npm run server

# Terminal 2 - React  
npm start
```

## Current Status

✅ Backend: Should be running on port 5000
❌ React: NOT running (that's why ERR_CONNECTION_REFUSED)

## After Starting React

1. Wait for "Compiled successfully!" message
2. Open http://localhost:3000
3. Should see "Xero Connect" login page
4. No more ERR_CONNECTION_REFUSED!

The React app is now starting. Wait 30-60 seconds for compilation!

