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
    const { tenantId } = req.query;
    
    if (!tenantId) {
      return res.status(400).json({ error: 'tenantId is required' });
    }

    const tokenSet = tokenStorage.getTokenForTenant(tenantId);
    
    if (!tokenSet) {
      return res.status(401).json({ error: 'Tenant not found or not authenticated' });
    }

    const xero = getXeroClient();
    await xero.setTokenSet(tokenSet);
    
    const response = await xero.accountingApi.getAccounts(tenantId);
    
    res.json({ 
      accounts: response.body.accounts || [],
      count: response.body.accounts ? response.body.accounts.length : 0,
      tenantId: tenantId
    });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ 
      error: 'Failed to fetch accounts', 
      details: error.message 
    });
  }
};

