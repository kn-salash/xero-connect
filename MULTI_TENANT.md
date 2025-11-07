# Multiple Tenants Support

## Overview

The application now supports storing tokens and tenant information in a JSON file, allowing you to connect multiple Xero organizations (tenants).

## Features

✅ **JSON Storage**: Tokens stored in `data/tokens.json`  
✅ **Multiple Tenants**: Connect and manage multiple Xero organizations  
✅ **Tenant Selector**: Switch between connected organizations  
✅ **Persistent Storage**: Tokens persist across server restarts  
✅ **Disconnect Tenants**: Remove individual tenant connections  

## Storage Structure

Tokens are stored in `data/tokens.json`:

```json
{
  "tenants": [
    {
      "tenantId": "xxx-xxx-xxx",
      "tenantName": "My Company Ltd",
      "tokenSet": { ... },
      "createdAt": "2025-11-07T19:00:00.000Z",
      "updatedAt": "2025-11-07T19:00:00.000Z"
    }
  ]
}
```

## API Endpoints

### Get All Tenants
```
GET /api/xero/tenants
```

### Get Accounts for Tenant
```
GET /api/xero/accounts?tenantId=xxx-xxx-xxx
```

### Disconnect Tenant
```
DELETE /api/xero/tenants/:tenantId
```

### Auth Status (returns all tenants)
```
GET /api/xero/auth-status
```

## Usage

1. **Connect First Tenant**:
   - Click "Connect to Xero"
   - Authorize the first organization
   - Token is saved to JSON file

2. **Connect Additional Tenants**:
   - Click "+ Connect Another Organization"
   - Authorize another organization
   - Both tenants are stored

3. **Switch Between Tenants**:
   - Click on a tenant card to select it
   - Accounts will load for the selected tenant

4. **Disconnect Tenant**:
   - Click "Disconnect" button on tenant card
   - Token is removed from JSON file

## Security Notes

- `data/tokens.json` is in `.gitignore` - never commit tokens
- Tokens contain sensitive OAuth credentials
- In production, consider using a database instead of JSON files
- Implement proper encryption for stored tokens

## File Structure

```
server/
  utils/
    tokenStorage.js    # JSON file operations
  routes/
    xero.js            # Updated routes for multi-tenant
data/
  tokens.json          # Stored tokens (created automatically)
```

## Migration from Session Storage

The system has been migrated from session-based storage to JSON file storage:
- ✅ Tokens persist across server restarts
- ✅ Multiple tenants supported
- ✅ No session dependency for token storage

