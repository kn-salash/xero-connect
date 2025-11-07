# Start React App - Step by Step

## Current Status
✅ Backend server: Running on port 5000
❌ React app: Not running on port 3000

## How to Start React App

### Method 1: Using PowerShell (Recommended)

1. Open a **NEW PowerShell window** (keep the backend running)
2. Navigate to project:
   ```powershell
   cd c:\xampp\htdocs\xero-connect
   ```
3. Start React app:
   ```powershell
   npm start
   ```
4. Wait 30-60 seconds for compilation
5. Browser should open to http://localhost:3000

### Method 2: Using Batch File

1. Double-click `start-react.bat` in the project folder
2. Wait for compilation
3. Open browser to http://localhost:3000

### Method 3: Start Both Together

If you want to restart everything:
1. Stop the backend (Ctrl+C in its terminal)
2. Run:
   ```powershell
   npm run dev
   ```
3. This starts both backend and React app

## Troubleshooting

### If npm start doesn't work:

1. **Check for errors in terminal** - Look for red error messages
2. **Try clearing cache:**
   ```powershell
   Remove-Item -Recurse -Force node_modules\.cache
   npm start
   ```
3. **Check if port 3000 is blocked:**
   ```powershell
   netstat -ano | findstr :3000
   ```
4. **Use a different port:**
   ```powershell
   $env:PORT=3001
   npm start
   ```
   Then access: http://localhost:3001

### Common Issues:

- **"Port 3000 is already in use"**: Another app is using it. Kill it or use port 3001
- **"Cannot find module"**: Run `npm install` again
- **Compilation errors**: Check terminal for specific errors

## What You Should See

When React starts successfully:
```
Compiled successfully!

You can now view xero-connect in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

## Important Notes

- Keep the terminal window open while React is running
- Backend must be running on port 5000 for the app to work
- First compilation takes longer (30-60 seconds)
- Press Ctrl+C to stop React app

