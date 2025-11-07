# Debugging 500 Error on Callback

## Current Status

✅ **Tokens File**: `server/data/tokens.json` exists  
❌ **Tokens Stored**: 0 tenants (empty)  
❌ **Error**: 500 Internal Server Error on callback

## What's Happening

The callback endpoint `/api/xero/callback?code=...` is returning 500 error, which prevents tokens from being saved.

## Check Backend Terminal

**Look at your backend server terminal window** - you should now see detailed logs:

1. `Processing OAuth callback with code: ...`
2. `Request URL: /api/xero/callback?code=...`
3. `Full callback URL for Xero: ...`
4. **Error messages** showing what's failing

## Common Causes

### 1. Redirect URI Mismatch
- Xero redirects to: `http://localhost:3000/callback`
- But backend receives: `http://localhost:5000/api/xero/callback`
- **Fix**: The redirect URI in Xero app should match what you're using

### 2. Xero Credentials Issue
- Client ID or Secret incorrect
- **Check**: `.env` file has correct credentials

### 3. Token Exchange Failing
- Xero API rejecting the callback
- **Check**: Backend logs for specific error

## Next Steps

1. **Restart backend server** to see new detailed logs
2. **Try connecting again**
3. **Check backend terminal** for error details
4. **Share the error message** from backend terminal

## What I Fixed

- Added detailed logging at each step
- Better error messages
- Token storage path verified

The backend terminal will now show exactly where it's failing!

