// Token storage adapter for Vercel serverless functions
// Note: In production, use Vercel KV, Supabase, or another database
// This is a temporary in-memory solution (tokens will be lost on cold start)

let tokenStore = { tenants: [] };

// For Vercel, we should use Vercel KV or a database
// This is a placeholder that needs to be replaced
function readTokens() {
  try {
    // TODO: Replace with Vercel KV or database call
    // For now, return in-memory store
    return tokenStore;
  } catch (error) {
    console.error('Error reading tokens:', error);
    return { tenants: [] };
  }
}

function writeTokens(data) {
  try {
    // TODO: Replace with Vercel KV or database call
    tokenStore = data;
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

