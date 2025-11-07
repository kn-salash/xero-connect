# HTTPS Setup for Xero - Two Options

## Option 1: Use ngrok (Easiest - Recommended)

### Steps:
1. **Download ngrok**: https://ngrok.com/download
2. **Start ngrok** (in a new terminal):
   ```powershell
   ngrok http 3000
   ```
3. **Copy the HTTPS URL** (e.g., `https://abc123-def456.ngrok.io`)
4. **Update Xero App**:
   - Go to https://developer.xero.com/myapps
   - Set redirect URI to: `https://abc123-def456.ngrok.io/callback`
5. **Update .env**:
   ```
   XERO_REDIRECT_URI=https://abc123-def456.ngrok.io/callback
   FRONTEND_URL=https://abc123-def456.ngrok.io
   ```
6. **Restart backend server**
7. **Access app via ngrok URL** (not localhost)

**Pros**: Easy, no certificate setup  
**Cons**: URL changes each time (free plan)

---

## Option 2: Set up HTTPS on localhost

### Steps:
1. **Generate SSL certificate**:
   ```powershell
   npm run generate-cert
   ```
   (Requires OpenSSL installed)

2. **Update Xero App**:
   - Set redirect URI to: `https://localhost:3000/callback`

3. **Update .env**:
   ```
   XERO_REDIRECT_URI=https://localhost:3000/callback
   FRONTEND_URL=https://localhost:3000
   ```

4. **Start servers with HTTPS**:
   ```powershell
   npm run dev:https
   ```

5. **Accept certificate warning** in browser (self-signed cert)

**Pros**: Permanent solution  
**Cons**: Requires OpenSSL, browser warnings

---

## Quick Start (ngrok)

```powershell
# Terminal 1: Start ngrok
ngrok http 3000

# Terminal 2: Update .env with ngrok URL
# Then start servers normally
npm run dev
```

## Current Status

- ✅ Backend configured to accept HTTPS frontend URL
- ✅ CORS updated to use FRONTEND_URL env variable
- ⏳ Need to set up HTTPS (ngrok or local certificate)

Choose the option that works best for you!

