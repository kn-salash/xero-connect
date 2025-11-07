# Cloudflare Tunnel Troubleshooting

## Check if Tunnel is Running

```powershell
Get-Process -Name cloudflared -ErrorAction SilentlyContinue
```

If nothing is returned, the tunnel is not running.

## Start Cloudflare Tunnel

Open a **NEW PowerShell terminal** and run:

```powershell
cloudflared tunnel --url http://localhost:3000
```

You should see output like:
```
+--------------------------------------------------------------------------------------------+
|  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable): |
|  https://abc123-def456.trycloudflare.com                                                   |
+--------------------------------------------------------------------------------------------+
```

## Important Notes

1. **Keep the tunnel terminal open** - Closing it stops the tunnel
2. **URL changes** - Each time you restart cloudflared, you get a new URL
3. **Update Xero app** - You must update the redirect URI in Xero each time the URL changes

## Common Issues

### Tunnel Not Running
- Start cloudflared in a separate terminal
- Keep that terminal open

### URL Not Working
- Check if React is running on port 3000
- Verify cloudflared is forwarding to localhost:3000
- Try accessing http://localhost:3000 directly first

### New Tunnel URL
If you restart cloudflared and get a new URL:
1. Copy the new HTTPS URL
2. Update Xero app redirect URI
3. Update .env file:
   ```
   XERO_REDIRECT_URI=https://new-url.trycloudflare.com/callback
   FRONTEND_URL=https://new-url.trycloudflare.com
   ```
4. Restart backend server

## Test Locally First

Before using tunnel, test locally:
- http://localhost:3000 (should work)
- http://localhost:5000/api/health (should return OK)

If local works but tunnel doesn't, the issue is with cloudflared.


