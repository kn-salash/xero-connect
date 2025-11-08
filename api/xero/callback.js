const { getXeroClient, tokenStorage } = require('../utils/xero');

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
    
    console.log('Processing OAuth callback with code:', code.substring(0, 10) + '...');
    console.log('Full callback URL:', fullUrl);
    
    const tokenSet = await xero.apiCallback(fullUrl);
    console.log('Token set received successfully');
    
    // After apiCallback, we need to update tenants to populate xero.tenants array
    // This fetches the connected organizations
    try {
      await xero.updateTenants();
      console.log('Tenants updated, count:', xero.tenants ? xero.tenants.length : 0);
    } catch (updateError) {
      console.error('Error updating tenants:', updateError);
      // If updateTenants fails, try to get connections directly
      try {
        const connectionsResponse = await xero.identityApi.getConnections();
        if (connectionsResponse.body && connectionsResponse.body.length > 0) {
          console.log('Found connections via identity API:', connectionsResponse.body.length);
          xero.tenants = connectionsResponse.body.map(conn => ({
            tenantId: conn.tenantId,
            tenantName: conn.tenantName || 'Unknown Tenant'
          }));
        }
      } catch (connError) {
        console.error('Error fetching connections from identity API:', connError);
      }
    }
    
    if (!xero.tenants || xero.tenants.length === 0) {
      console.error('No tenants returned from Xero');
      return res.status(500).json({ 
        error: 'No tenants returned from Xero',
        details: 'Please ensure your Xero app has access to at least one organization'
      });
    }
    
    const tenantId = xero.tenants[0].tenantId;
    const tenantName = xero.tenants[0].tenantName || 'Unknown Tenant';
    
    console.log('Saving token for tenant:', tenantId, tenantName);
    const saved = tokenStorage.saveTokenForTenant(tenantId, tenantName, tokenSet);
    
    if (!saved) {
      console.error('Failed to save token');
      return res.status(500).json({ error: 'Failed to save token' });
    }
    
    console.log('Token saved successfully');
    res.json({ 
      success: true, 
      message: 'Authentication successful',
      tenantId: tenantId,
      tenantName: tenantName
    });
  } catch (error) {
    console.error('Error in callback handler:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Authentication failed', 
      details: error.message || 'Unknown error occurred'
    });
  }
};

