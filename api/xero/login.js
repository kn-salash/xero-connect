let getXeroClient, tokenStorage;

try {
  const xeroUtils = require('../utils/xero');
  getXeroClient = xeroUtils.getXeroClient;
  tokenStorage = xeroUtils.tokenStorage;
} catch (error) {
  console.error('Error loading xero utils:', error);
  module.exports = async (req, res) => {
    res.status(500).json({ 
      error: 'Failed to load required modules', 
      details: error.message 
    });
  };
  return;
}

module.exports = async (req, res) => {
  try {
    // Set CORS headers
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

    if (!process.env.XERO_CLIENT_ID || !process.env.XERO_CLIENT_SECRET) {
      return res.status(500).json({ 
        error: 'Xero credentials not configured', 
        details: 'Please set XERO_CLIENT_ID and XERO_CLIENT_SECRET in Vercel environment variables' 
      });
    }

    const xero = getXeroClient();
    const consentUrl = await xero.buildConsentUrl();
    
    res.json({ consentUrl });
  } catch (error) {
    console.error('Error building consent URL:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to generate login URL', 
      details: error.message || 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

