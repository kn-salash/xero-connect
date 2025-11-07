# React App Not Working - Quick Fix

## The Problem
http://localhost:3000 is not accessible because the React development server isn't running.

## Solution

### Step 1: Make sure backend is running
The backend server should be running on port 5000. Check with:
```powershell
Invoke-WebRequest -Uri http://localhost:5000/api/health
```

### Step 2: Start the React App

**Option A: Using npm (Recommended)**
```powershell
cd c:\xampp\htdocs\xero-connect
npm start
```

**Option B: Using the batch file**
Double-click `start-react.bat` in the project folder.

**Option C: Start both together**
```powershell
npm run dev
```

### Step 3: Wait for compilation
- First time: 30-60 seconds
- Subsequent: 10-20 seconds
- Look for: "Compiled successfully!" message
- Browser should auto-open to http://localhost:3000

### Step 4: If it still doesn't work

1. **Check for errors in the terminal** - Look for red error messages
2. **Check if port 3000 is blocked:**
   ```powershell
   netstat -ano | findstr :3000
   ```
3. **Kill any processes on port 3000:**
   ```powershell
   # Find PID from netstat, then:
   taskkill /PID <PID> /F
   ```
4. **Try a different port:**
   ```powershell
   $env:PORT=3001
   npm start
   ```

## What You Should See

When React app starts successfully:
- Terminal shows: "Compiled successfully!"
- Browser opens automatically to http://localhost:3000
- You see "Xero Connect" login page
- No errors in browser console (F12)

## Current Status

✅ Backend server: Running on port 5000
❌ React app: Needs to be started
✅ Dependencies: Installed
✅ Files: All present

## Next Steps

1. Open a new PowerShell window
2. Navigate to: `cd c:\xampp\htdocs\xero-connect`
3. Run: `npm start`
4. Wait for compilation
5. Open browser to http://localhost:3000

