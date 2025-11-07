const { tokenStorage } = require('./utils/xero');

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
    const tenants = tokenStorage.getAllTenants();
    
    if (tenants.length === 0) {
      return res.json({ authenticated: false, tenants: [] });
    }

    res.json({ 
      authenticated: true,
      tenants: tenants,
      defaultTenantId: tenants[0]?.tenantId
    });
  } catch (error) {
    console.error('Error checking auth status:', error);
    res.json({ authenticated: false, tenants: [] });
  }
};

