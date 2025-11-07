# Quick HTTPS Setup - Windows

## Problem
- Windows doesn't support `HTTPS=true` syntax
- SSL certificates not generated

## Solution: Use ngrok (Easiest for Windows)

### Step 1: Install ngrok
1. Download from: https://ngrok.com/download
2. Extract `ngrok.exe` to a folder
3. Add to PATH or use full path

### Step 2: Start ngrok
```powershell
# In a new terminal
ngrok http 3000
```

### Step 3: Copy HTTPS URL
You'll see something like:
```
Forwarding  https://abc123-def456.ngrok.io -> http://localhost:3000
```

### Step 4: Update Xero App
1. Go to https://developer.xero.com/myapps
2. Set redirect URI to: `https://abc123-def456.ngrok.io/callback`

### Step 5: Update .env
```
XERO_REDIRECT_URI=https://abc123-def456.ngrok.io/callback
FRONTEND_URL=https://abc123-def456.ngrok.io
```

### Step 6: Restart Backend
```powershell
npm run server
```

### Step 7: Access via ngrok
- Use: `https://abc123-def456.ngrok.io`
- NOT: `http://localhost:3000`

## Alternative: Generate SSL Certificate (If OpenSSL Available)

If you have OpenSSL installed:
```powershell
npm run generate-cert
npm run dev:https
```

But ngrok is much easier!

