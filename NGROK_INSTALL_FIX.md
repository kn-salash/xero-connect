# ngrok Installation Issue - Windows Defender Blocking

## Problem
Windows Defender is blocking ngrok download/extraction.

## Solutions

### Option 1: Add Windows Defender Exception (Recommended)

1. Open Windows Security:
   - Press `Win + I` → Update & Security → Windows Security
   - Or search "Windows Security" in Start menu

2. Go to Virus & threat protection → Manage settings

3. Under Exclusions, click "Add or remove exclusions"

4. Add folder exclusion:
   - `C:\Users\Salash\scoop\apps\ngrok`

5. Then try installing again:
   ```powershell
   scoop install ngrok
   ```

### Option 2: Manual Download ngrok

1. Download directly: https://ngrok.com/download
2. Extract `ngrok.exe` to a folder (e.g., `C:\tools\ngrok\`)
3. Add to PATH or use full path:
   ```powershell
   $env:Path += ";C:\tools\ngrok"
   ```

---

## After Installation

Once ngrok is installed:

1. Start ngrok:
   ```powershell
   ngrok http 3000
   ```

2. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

3. Update Xero app redirect URI to: `https://abc123.ngrok.io/callback`

4. Update `.env`:
   ```
   XERO_REDIRECT_URI=https://abc123.ngrok.io/callback
   FRONTEND_URL=https://abc123.ngrok.io
   ```

5. Start backend:
   ```powershell
   npm run server
   ```

6. Access via ngrok URL!

