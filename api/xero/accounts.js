const { getXeroClient, tokenStorage } = require('../utils/xero');
const authenticateRequest = require('../utils/auth');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-API-Key, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Check authentication (except for OPTIONS)
  if (!authenticateRequest(req, res)) {
    return; // Response already sent by authenticateRequest
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
    
    // Fetch all accounts including bank accounts
    // The where parameter can filter, but we want all accounts
    const response = await xero.accountingApi.getAccounts(tenantId, null, 'where=Status=="ACTIVE" OR Status=="ARCHIVED"');
    
    const allAccounts = response.body.accounts || [];
    
    // Filter and categorize accounts
    const bankAccounts = allAccounts.filter(acc => 
      acc.type === 'BANK' || 
      acc.type === 'CURRENT' || 
      acc.name?.toLowerCase().includes('bank') ||
      acc.name?.toLowerCase().includes('checking') ||
      acc.name?.toLowerCase().includes('savings')
    );
    
    const otherAccounts = allAccounts.filter(acc => 
      !bankAccounts.some(bank => bank.accountID === acc.accountID)
    );
    
    res.json({ 
      accounts: allAccounts,
      bankAccounts: bankAccounts,
      otherAccounts: otherAccounts,
      count: allAccounts.length,
      bankCount: bankAccounts.length,
      tenantId: tenantId,
      summary: {
        total: allAccounts.length,
        bank: bankAccounts.length,
        other: otherAccounts.length,
        active: allAccounts.filter(acc => acc.status === 'ACTIVE').length,
        archived: allAccounts.filter(acc => acc.status === 'ARCHIVED').length
      }
    });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ 
      error: 'Failed to fetch accounts', 
      details: error.message 
    });
  }
};

