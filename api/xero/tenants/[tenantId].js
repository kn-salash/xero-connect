const { tokenStorage } = require('../../utils/xero');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract tenantId from URL path: /api/xero/tenants/[tenantId]
    const urlParts = req.url.split('/');
    const tenantId = urlParts[urlParts.length - 1];
    
    if (!tenantId || tenantId === 'tenants') {
      return res.status(400).json({ error: 'tenantId is required' });
    }

    const removed = tokenStorage.removeTenant(tenantId);
    
    if (removed) {
      res.json({ success: true, message: 'Tenant disconnected successfully' });
    } else {
      res.status(500).json({ error: 'Failed to remove tenant' });
    }
  } catch (error) {
    console.error('Error removing tenant:', error);
    res.status(500).json({ error: 'Failed to remove tenant', details: error.message });
  }
};

