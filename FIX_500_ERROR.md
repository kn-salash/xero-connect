# Troubleshooting 500 Error on Login

## Error: "Request failed with status code 500"

This error occurs when clicking "Connect to Xero" button.

## Common Causes and Solutions

### 1. Missing Xero Credentials in .env File

**Check if .env file exists and has credentials:**
```powershell
# Check if .env exists
Test-Path .env

# View .env content (be careful not to expose credentials)
Get-Content .env
```

**Solution:**
1. Copy `.env.example` to `.env` if it doesn't exist
2. Add your Xero credentials:
   ```
   XERO_CLIENT_ID=your-client-id-here
   XERO_CLIENT_SECRET=your-client-secret-here
   XERO_REDIRECT_URI=http://localhost:3000/callback
   ```

### 2. Backend Server Not Reading .env File

**Check:**
- Is the backend server running?
- Did you restart the server after adding .env?

**Solution:**
1. Stop the backend server (Ctrl+C)
2. Restart it: `npm run server`
3. Try again

### 3. Xero Client Initialization Error

The error might be in how XeroClient is initialized.

**Check backend logs** for specific error messages.

### 4. Improved Error Messages

The app now shows more detailed error messages. Check:
- Browser console (F12) for full error details
- Backend terminal for server-side errors

## Debugging Steps

1. **Check browser console (F12)**:
   - Look for the full error response
   - Check Network tab for the failed request

2. **Check backend terminal**:
   - Look for error logs when clicking the button
   - Should show: "Error building consent URL: ..."

3. **Test endpoint directly**:
   ```powershell
   Invoke-WebRequest -Uri http://localhost:5000/api/xero/login -UseBasicParsing
   ```

4. **Verify .env file**:
   ```powershell
   # Make sure these are set
   Get-Content .env | Select-String "XERO_CLIENT"
   ```

## Quick Fix

1. Ensure `.env` file exists with correct credentials
2. Restart backend server: `npm run server`
3. Refresh React app: http://localhost:3000
4. Try clicking "Connect to Xero" again
5. Check error message - it should now be more descriptive

## Getting Xero Credentials

1. Go to https://developer.xero.com/myapps
2. Create a new app or select existing
3. Set redirect URI to: `http://localhost:3000/callback`
4. Copy Client ID and Client Secret
5. Add to `.env` file

