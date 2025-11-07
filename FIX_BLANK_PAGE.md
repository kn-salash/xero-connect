# Troubleshooting Blank Page

## Common Causes

### 1. Backend Not Running
If backend is down, the auth check might hang or fail, causing blank page.

**Fix:** Make sure backend is running on port 5000

### 2. React Not Fully Compiled
React might still be compiling.

**Fix:** Wait 30-60 seconds, check terminal for "Compiled successfully!"

### 3. JavaScript Errors
Check browser console (F12) for errors.

**Fix:** Look for red error messages in console

### 4. CORS Issues
Backend might not be allowing requests.

**Fix:** Check backend CORS configuration

## Quick Checks

1. **Open Browser Console (F12)**
   - Look for errors (red text)
   - Check Network tab for failed requests

2. **Check Terminal**
   - Is React compiled? Look for "Compiled successfully!"
   - Are there any error messages?

3. **Verify Servers**
   - Backend: http://localhost:5000/api/health
   - React: http://localhost:3000

## What I Fixed

- Reduced auth check timeout from 10s to 5s
- Made sure page renders even if backend is down
- Page should show login screen even if backend isn't running

## Next Steps

1. Check browser console (F12) for errors
2. Check terminal for compilation status
3. Verify both servers are running
4. Try refreshing the page (Ctrl+F5)

