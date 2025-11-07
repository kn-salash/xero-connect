# Xero HTTPS Redirect URI Setup

## The Problem
Xero requires HTTPS for callback URLs, but localhost uses HTTP.

## Solution: Use ngrok

### Step 1: Install ngrok
1. Download from: https://ngrok.com/download
2. Extract the executable
3. Add to PATH or use full path

### Step 2: Start ngrok
```powershell
# In a new terminal window
ngrok http 3000
```

You'll see output like:
```
Forwarding  https://abc123-def456.ngrok.io -> http://localhost:3000
```

### Step 3: Update Xero App Settings
1. Go to https://developer.xero.com/myapps
2. Select your app
3. Add redirect URI: `https://abc123-def456.ngrok.io/callback`
4. Save

### Step 4: Update .env File
```
XERO_REDIRECT_URI=https://abc123-def456.ngrok.io/callback
FRONTEND_URL=https://abc123-def456.ngrok.io
```

### Step 5: Restart Backend Server
```powershell
npm run server
```

### Step 6: Access Your App
- Use the ngrok HTTPS URL: `https://abc123-def456.ngrok.io`
- Not `http://localhost:3000`

## Important Notes

- **ngrok URL changes** each time you restart (free plan)
- **Keep ngrok running** while developing
- **Update Xero redirect URI** if ngrok URL changes
- **Update .env** if ngrok URL changes

## Alternative: Try HTTP First

Some Xero apps allow HTTP for localhost:
1. Try setting redirect URI to: `http://localhost:3000/callback` in Xero app
2. If it works, you don't need ngrok
3. If Xero rejects it, use ngrok

