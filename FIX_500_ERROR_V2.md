# Quick Fix for 500 Error

## The Problem
Getting "Request failed with status code 500" when clicking "Connect to Xero"

## Most Common Causes

### 1. Missing Xero Credentials in .env

**Check your .env file:**
```powershell
Get-Content .env
```

**Make sure it has:**
```
XERO_CLIENT_ID=your-actual-client-id
XERO_CLIENT_SECRET=your-actual-client-secret
XERO_REDIRECT_URI=http://localhost:3000/callback
```

### 2. Server Needs Restart

After adding/updating .env file, restart the server:

```powershell
# Stop server (Ctrl+C in terminal)
# Then restart:
npm run server
```

### 3. Check Browser Console

Open browser console (F12) and check:
- Network tab → Look at the failed request
- Console tab → Look for error messages
- The error response should show details

### 4. Check Server Terminal

Look at the backend server terminal for error messages:
- Should show: "Error building consent URL: ..."
- This will tell you exactly what's wrong

## Quick Test

Test the endpoint directly:
```powershell
Invoke-WebRequest -Uri http://localhost:5000/api/xero/login -UseBasicParsing
```

If you see an error, it will show the details.

## Expected Behavior

When working correctly:
- Status: 200
- Response: `{"consentUrl":"https://login.xero.com/..."}`

When credentials missing:
- Status: 500
- Response: `{"error":"Xero credentials not configured",...}`

## Next Steps

1. ✅ Verify .env file has correct credentials
2. ✅ Restart backend server
3. ✅ Check browser console for detailed error
4. ✅ Check server terminal for error logs
5. ✅ Try connecting again

The improved error handling should now show you exactly what's wrong!

