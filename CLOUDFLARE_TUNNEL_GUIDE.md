# Using Cloudflare Tunnel (cloudflared) for HTTPS

## ✅ Installed Successfully!

Cloudflare Tunnel is installed and ready to use. It works just like ngrok!

## Quick Start

### Step 1: Start the Tunnel

In a **new terminal window**, run:

```powershell
cloudflared tunnel --url http://localhost:3000
```

You'll see output like:
```
+--------------------------------------------------------------------------------------------+
|  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable): |
|  https://abc123-def456.trycloudflare.com                                                   |
+--------------------------------------------------------------------------------------------+
```

### Step 2: Copy the HTTPS URL

Copy the HTTPS URL (e.g., `https://abc123-def456.trycloudflare.com`)

### Step 3: Update Xero App

1. Go to https://developer.xero.com/myapps
2. Edit your app
3. Set redirect URI to: `https://abc123-def456.trycloudflare.com/callback`

### Step 4: Update .env

Edit your `.env` file:
```
XERO_REDIRECT_URI=https://abc123-def456.trycloudflare.com/callback
FRONTEND_URL=https://abc123-def456.trycloudflare.com
```

### Step 5: Start Your Backend

```powershell
npm run server
```

### Step 6: Access Your App

Use the Cloudflare tunnel URL (not localhost):
- `https://abc123-def456.trycloudflare.com`

---

## Notes

- **Keep the cloudflared terminal open** - closing it will stop the tunnel
- The URL changes each time you restart cloudflared (free tier)
- Works exactly like ngrok for Xero OAuth callbacks!

## Alternative: Fix ngrok Installation

If you prefer ngrok, add Windows Defender exception:
1. Windows Security → Virus & threat protection → Manage settings
2. Exclusions → Add folder: `C:\Users\Salash\scoop\apps\ngrok`
3. Then: `scoop install ngrok`

