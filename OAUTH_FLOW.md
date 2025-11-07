# OAuth Flow Explanation

## Complete Authentication Flow

### 1. **Initial Login** (`http://localhost:3000/`)
   - User clicks "Connect to Xero" button
   - Frontend calls: `GET /api/xero/login`
   - Backend returns Xero consent URL
   - User is redirected to Xero login page

### 2. **Xero Authorization**
   - User logs in to Xero
   - User authorizes the application
   - Xero redirects back to: `http://localhost:3000/callback?code=AUTHORIZATION_CODE`

### 3. **Callback Processing** (`http://localhost:3000/callback`)
   - React `Callback` component receives the authorization code
   - Frontend sends code to backend: `GET /api/xero/callback?code=...`
   - Backend exchanges code for access tokens
   - Backend stores tokens in session
   - Backend returns success response

### 4. **Dashboard Redirect** (`http://localhost:3000/dashboard`)
   - Frontend checks authentication status
   - If authenticated, navigates to `/dashboard`
   - Dashboard displays accounts from Xero

## URL Flow Summary

```
http://localhost:3000/
    ↓ (Click "Connect to Xero")
Xero Login Page
    ↓ (Authorize)
http://localhost:3000/callback?code=...
    ↓ (Process callback)
http://localhost:3000/dashboard
```

## Important Points

1. **Redirect URI**: Must be set to `http://localhost:3000/callback` in Xero app settings
2. **Session**: Tokens are stored in backend session (cookies)
3. **Frontend Navigation**: React Router handles navigation between pages
4. **Error Handling**: Errors are passed via URL params and displayed on login page

## After Authentication

Once authenticated:
- User stays on `http://localhost:3000/dashboard`
- Can view accounts, logout, etc.
- Session persists until logout or expiration

## Logout Flow

- User clicks logout
- Frontend calls: `POST /api/xero/logout`
- Backend destroys session
- Frontend redirects to: `http://localhost:3000/`

