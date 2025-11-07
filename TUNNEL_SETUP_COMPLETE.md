# Cloudflare Tunnel Setup - Complete

## ✅ Tunnel Active

**HTTPS URL:** `https://myers-professional-develops-ted.trycloudflare.com`

## Configuration Updated

The `.env` file has been updated with:
- `XERO_REDIRECT_URI=https://myers-professional-develops-ted.trycloudflare.com/callback`
- `FRONTEND_URL=https://myers-professional-develops-ted.trycloudflare.com`

## Next Steps

### 1. Update Xero App Settings

1. Go to: https://developer.xero.com/myapps
2. Click on your app
3. Under "Redirect URI", add or update:
   ```
   https://myers-professional-develops-ted.trycloudflare.com/callback
   ```
4. Save changes

### 2. Restart Backend Server

If your backend is running, restart it to load the new environment variables:

```powershell
# Stop current server (Ctrl+C), then:
npm run server
```

### 3. Access Your App

Open your browser and go to:
```
https://myers-professional-develops-ted.trycloudflare.com
```

### 4. Test Login

Click "Connect to Xero" - it should now redirect properly with HTTPS!

---

## Important Notes

- **Keep cloudflared running** - The tunnel will stop if you close that terminal
- **URL changes** - Each time you restart cloudflared, you'll get a new URL
- **Update Xero app** - You'll need to update the redirect URI in Xero each time the URL changes

## Troubleshooting

If login doesn't work:
1. Verify `.env` has the correct URL
2. Verify Xero app redirect URI matches exactly
3. Check backend logs for errors
4. Make sure cloudflared tunnel is still running

