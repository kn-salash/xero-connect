# Troubleshooting Connection Issues

## ✅ Server Status
The backend server is now running on **http://localhost:5000**

## Common Issues and Solutions

### 1. "Connection Refused" Error

**Cause**: The backend server is not running or React app can't reach it.

**Solution**:
```powershell
# Make sure you're in the project directory
cd c:\xampp\htdocs\xero-connect

# Start the backend server (in one terminal)
npm run server
# OR
node server/index.js
# OR double-click: start-server.bat

# In another terminal, start the React app
npm start
```

### 2. Check if Server is Running

```powershell
# Test the server
Invoke-WebRequest -Uri http://localhost:5000/api/health -UseBasicParsing

# Check if port 5000 is in use
netstat -ano | findstr :5000
```

### 3. Port Already in Use

If port 5000 is already in use:
```powershell
# Find and stop the process
Get-Process -Name node | Stop-Process -Force

# Or change the port in .env file
# PORT=5001
```

### 4. CORS Issues

The server is configured to accept requests from `http://localhost:3000`. Make sure:
- React app runs on port 3000 (default)
- Backend runs on port 5000 (default)
- Both are running simultaneously

### 5. Quick Start (Both Servers)

```powershell
# Start both servers together
npm run dev
```

This will start:
- Backend on http://localhost:5000
- Frontend on http://localhost:3000

## Testing the Connection

1. **Open browser console** (F12)
2. **Navigate to** http://localhost:3000
3. **Check for errors** in the console
4. **Click "Connect to Xero"** button
5. **Check the error message** - it will now show helpful details

## Updated Error Messages

The app now shows specific error messages:
- "Connection refused" → Backend server not running
- "Failed to fetch" → Network/CORS issue
- Other errors → Check server logs

## Manual Server Start

If `npm run dev` doesn't work, start servers separately:

**Terminal 1 (Backend)**:
```powershell
cd c:\xampp\htdocs\xero-connect
npm run server
```

**Terminal 2 (Frontend)**:
```powershell
cd c:\xampp\htdocs\xero-connect
npm start
```

## Verify Setup

1. ✅ Backend server responds: http://localhost:5000/api/health
2. ✅ Login endpoint works: http://localhost:5000/api/xero/login
3. ✅ React app loads: http://localhost:3000
4. ✅ No CORS errors in browser console

