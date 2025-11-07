const fs = require('fs');
const path = require('path');

const TOKENS_FILE = path.join(__dirname, '../data/tokens.json');

// Ensure data directory exists
const dataDir = path.dirname(TOKENS_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize tokens file if it doesn't exist
if (!fs.existsSync(TOKENS_FILE)) {
  fs.writeFileSync(TOKENS_FILE, JSON.stringify({ tenants: [] }, null, 2));
}

// Read tokens from file
function readTokens() {
  try {
    const data = fs.readFileSync(TOKENS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading tokens file:', error);
    return { tenants: [] };
  }
}

// Write tokens to file
function writeTokens(data) {
  try {
    fs.writeFileSync(TOKENS_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing tokens file:', error);
    return false;
  }
}

// Get token for a tenant
function getTokenForTenant(tenantId) {
  const data = readTokens();
  const tenant = data.tenants.find(t => t.tenantId === tenantId);
  return tenant ? tenant.tokenSet : null;
}

// Save token for a tenant
function saveTokenForTenant(tenantId, tenantName, tokenSet) {
  try {
    // Ensure tokenSet is serializable - extract only necessary fields
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

    const result = writeTokens(data);
    if (result) {
      console.log(`Token saved for tenant: ${tenantName} (${tenantId})`);
    } else {
      console.error('Failed to write tokens to file');
    }
    return result;
  } catch (error) {
    console.error('Error saving token for tenant:', error);
    console.error('Error stack:', error.stack);
    return false;
  }
}

// Get all tenants
function getAllTenants() {
  const data = readTokens();
  return data.tenants.map(t => ({
    tenantId: t.tenantId,
    tenantName: t.tenantName,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt
  }));
}

// Remove tenant
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

