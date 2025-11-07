const { getXeroClient, tokenStorage } = require('./utils/xero');

module.exports = async (req, res) => {
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

  try {
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
    res.status(500).json({ 
      error: 'Failed to generate login URL', 
      details: error.message
    });
  }
};

