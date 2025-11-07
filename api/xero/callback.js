const { getXeroClient, tokenStorage } = require('./utils/xero');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ error: 'Authorization code not provided' });
    }

    const xero = getXeroClient();
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const fullUrl = `${protocol}://${host}${req.url}`;
    
    const tokenSet = await xero.apiCallback(fullUrl);
    
    if (!xero.tenants || xero.tenants.length === 0) {
      return res.status(500).json({ error: 'No tenants returned from Xero' });
    }
    
    const tenantId = xero.tenants[0].tenantId;
    const tenantName = xero.tenants[0].tenantName || 'Unknown Tenant';
    
    const saved = tokenStorage.saveTokenForTenant(tenantId, tenantName, tokenSet);
    
    if (!saved) {
      return res.status(500).json({ error: 'Failed to save token' });
    }
    
    res.json({ 
      success: true, 
      message: 'Authentication successful',
      tenantId: tenantId,
      tenantName: tenantName
    });
  } catch (error) {
    console.error('Error in callback handler:', error);
    res.status(500).json({ 
      error: 'Authentication failed', 
      details: error.message
    });
  }
};

