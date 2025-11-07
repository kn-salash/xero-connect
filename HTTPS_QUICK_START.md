# HTTPS Setup - Quick Guide

## ✅ Fixed Windows Compatibility

Installed `cross-env` to fix Windows PowerShell compatibility.

## Two Options for HTTPS

### Option 1: ngrok (Easiest - Recommended)

**Steps:**
1. Download ngrok: https://ngrok.com/download
2. Extract `ngrok.exe`
3. Run: `ngrok http 3000`
4. Copy HTTPS URL (e.g., `https://abc123.ngrok.io`)
5. Update Xero app redirect URI to: `https://abc123.ngrok.io/callback`
6. Update `.env`:
   ```
   XERO_REDIRECT_URI=https://abc123.ngrok.io/callback
   FRONTEND_URL=https://abc123.ngrok.io
   ```
7. Restart backend: `npm run server`
8. Access via ngrok URL (not localhost)

**Pros**: No certificate setup, works immediately  
**Cons**: URL changes each restart (free plan)

---

### Option 2: Local HTTPS (If Certificate Generated)

**If certificates were generated successfully:**

1. Update Xero app redirect URI to: `https://localhost:3000/callback`
2. Update `.env`:
   ```
   XERO_REDIRECT_URI=https://localhost:3000/callback
   FRONTEND_URL=https://localhost:3000
   ```
3. Start with HTTPS:
   ```powershell
   npm run dev:https
   ```
4. Accept browser certificate warning
5. Access: `https://localhost:3000`

**Pros**: Permanent solution  
**Cons**: Browser warnings, requires OpenSSL

---

## Recommendation

**Use ngrok** - it's the easiest solution for Windows development!

1. Start ngrok: `ngrok http 3000`
2. Use the HTTPS URL it provides
3. Update Xero app and .env
4. Done!

