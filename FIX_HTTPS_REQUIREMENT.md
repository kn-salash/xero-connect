# Fix HTTPS Requirement for Xero Callback

## Problem
Xero requires HTTPS for callback URLs, but we're using HTTP (`http://localhost:3000/callback`)

## Solutions

### Option 1: Use ngrok (Easiest - Recommended)

**Install ngrok:**
1. Download from https://ngrok.com/download
2. Extract and add to PATH, or use from download folder

**Start ngrok:**
```powershell
# In a new terminal
ngrok http 3000
```

**Update Xero App:**
1. ngrok will give you a URL like: `https://abc123.ngrok.io`
2. Set redirect URI in Xero app to: `https://abc123.ngrok.io/callback`
3. Update `.env`:
   ```
   XERO_REDIRECT_URI=https://abc123.ngrok.io/callback
   ```

**Update backend to handle ngrok:**
- The backend needs to accept requests from the ngrok URL
- Update CORS in `server/index.js`

### Option 2: Use HTTP for localhost (If Xero Allows)

Some OAuth providers allow HTTP for `localhost` in development:
1. Try setting redirect URI in Xero app to: `http://localhost:3000/callback`
2. Make sure `.env` has: `XERO_REDIRECT_URI=http://localhost:3000/callback`
3. Restart backend server

### Option 3: Set up Local SSL Certificate

More complex but permanent solution for local development.

## Quick Fix with ngrok

1. **Install ngrok** (if not installed)
2. **Start ngrok:**
   ```powershell
   ngrok http 3000
   ```
3. **Copy the HTTPS URL** (e.g., `https://abc123.ngrok.io`)
4. **Update Xero app redirect URI** to: `https://abc123.ngrok.io/callback`
5. **Update .env:**
   ```
   XERO_REDIRECT_URI=https://abc123.ngrok.io/callback
   ```
6. **Restart backend server**
7. **Access app via ngrok URL:** `https://abc123.ngrok.io`

## Important Notes

- ngrok URL changes each time you restart (unless you have a paid plan)
- For development, free ngrok is fine
- In production, use a real domain with SSL certificate

