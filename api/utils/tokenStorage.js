// Token storage adapter for Vercel serverless functions
// Uses JSON file storage in /tmp directory (persists across function invocations)
// Note: For production, consider Vercel KV, Supabase, or a database for better persistence

const fs = require('fs');
const path = require('path');

// Use /tmp directory which persists across Vercel function invocations
const TOKEN_FILE_PATH = path.join('/tmp', 'xero-tokens.json');

// In-memory cache for faster access
let tokenStoreCache = null;

function readTokens() {
  try {
    // Return cached version if available
    if (tokenStoreCache !== null) {
      return tokenStoreCache;
    }

    // Try to read from file
    if (fs.existsSync(TOKEN_FILE_PATH)) {
      const fileContent = fs.readFileSync(TOKEN_FILE_PATH, 'utf8');
      tokenStoreCache = JSON.parse(fileContent);
      return tokenStoreCache;
    }

    // Return empty store if file doesn't exist
    tokenStoreCache = { tenants: [] };
    return tokenStoreCache;
  } catch (error) {
    console.error('Error reading tokens:', error);
    // Return empty store on error
    tokenStoreCache = { tenants: [] };
    return tokenStoreCache;
  }
}

function writeTokens(data) {
  try {
    // Update cache
    tokenStoreCache = data;
    
    // Write to JSON file
    fs.writeFileSync(TOKEN_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing tokens:', error);
    return false;
  }
}

function getTokenForTenant(tenantId) {
  const data = readTokens();
  const tenant = data.tenants.find(t => t.tenantId === tenantId);
  return tenant ? tenant.tokenSet : null;
}

function saveTokenForTenant(tenantId, tenantName, tokenSet) {
  try {
    const serializableTokenSet = {
      access_token: tokenSet.access_token,
      refresh_token: tokenSet.refresh_token,
      id_token: tokenSet.id_token,
      token_type: tokenSet.token_type,
      expires_at: tokenSet.expires_at,
      expires_in: tokenSet.expires_in,
      scope: tokenSet.scope
    };
    
    const data = readTokens();
    const existingIndex = data.tenants.findIndex(t => t.tenantId === tenantId);
    
    const tenantData = {
      tenantId,
      tenantName,
      tokenSet: serializableTokenSet,
      createdAt: existingIndex >= 0 ? data.tenants[existingIndex].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      data.tenants[existingIndex] = tenantData;
    } else {
      data.tenants.push(tenantData);
    }

    return writeTokens(data);
  } catch (error) {
    console.error('Error saving token for tenant:', error);
    return false;
  }
}

function getAllTenants() {
  const data = readTokens();
  return data.tenants.map(t => ({
    tenantId: t.tenantId,
    tenantName: t.tenantName,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt
  }));
}

function removeTenant(tenantId) {
  const data = readTokens();
  data.tenants = data.tenants.filter(t => t.tenantId !== tenantId);
  return writeTokens(data);
}

module.exports = {
  readTokens,
  writeTokens,
  getTokenForTenant,
  saveTokenForTenant,
  getAllTenants,
  removeTenant
};

