# Quick Start Guide for React App

## Starting the React App

The React app needs to be started separately from the backend server.

### Method 1: Start Both Servers Together (Recommended)

Open PowerShell in the project directory and run:
```powershell
npm run dev
```

This will start:
- Backend server on port 5000
- React app on port 3000

### Method 2: Start React App Separately

**Terminal 1 - Backend:**
```powershell
npm run server
```

**Terminal 2 - React App:**
```powershell
npm start
```

### Method 3: Using Batch File

Double-click `start-server.bat` to start the backend, then run `npm start` in another terminal.

## Troubleshooting

### React App Won't Start

1. **Check if port 3000 is already in use:**
   ```powershell
   netstat -ano | findstr :3000
   ```

2. **Kill any processes using port 3000:**
   ```powershell
   # Find the PID from netstat output, then:
   taskkill /PID <PID> /F
   ```

3. **Clear cache and reinstall:**
   ```powershell
   Remove-Item -Recurse -Force node_modules
   Remove-Item package-lock.json
   npm install
   npm start
   ```

### Common Errors

- **"Port 3000 is already in use"**: Another app is using port 3000. Kill it or change the port.
- **"Cannot find module"**: Run `npm install` again.
- **Compilation errors**: Check the terminal output for specific error messages.

### Check if React App is Running

Open browser and go to: http://localhost:3000

You should see the Xero Connect login page.

## Expected Behavior

1. React app compiles (takes 30-60 seconds first time)
2. Browser automatically opens to http://localhost:3000
3. You see "Xero Connect" login page
4. Backend server should be running on port 5000

## Notes

- First compilation may take 1-2 minutes
- Keep the terminal window open while the app is running
- Press Ctrl+C to stop the React app
- The app will automatically reload when you make code changes

