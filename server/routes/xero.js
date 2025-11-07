const express = require('express');
const router = express.Router();
const { XeroClient } = require('xero-node');
const tokenStorage = require('../utils/tokenStorage');

// Initialize Xero Client
const xero = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID,
  clientSecret: process.env.XERO_CLIENT_SECRET,
  redirectUris: [process.env.XERO_REDIRECT_URI || 'http://localhost:3000/callback'],
  scopes: 'openid profile email accounting.settings accounting.transactions accounting.contacts.read offline_access'.split(' ')
});

// Login - Get authorization URL
router.get('/login', async (req, res) => {
  try {
    // Validate environment variables
    if (!process.env.XERO_CLIENT_ID || !process.env.XERO_CLIENT_SECRET) {
      console.error('Missing Xero credentials in environment variables');
      return res.status(500).json({ 
        error: 'Xero credentials not configured', 
        details: 'Please set XERO_CLIENT_ID and XERO_CLIENT_SECRET in your .env file' 
      });
    }

    const consentUrl = await xero.buildConsentUrl();
    res.json({ consentUrl });
  } catch (error) {
    console.error('Error building consent URL:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to generate login URL', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Callback - Handle OAuth callback
router.get('/callback', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ error: 'Authorization code not provided' });
    }

    console.log('Processing OAuth callback with code:', code.substring(0, 10) + '...');
    console.log('Request URL:', req.url);
    console.log('Original URL:', req.originalUrl);
    
    // Xero apiCallback needs the full callback URL with query string
    // Build it from the request - use originalUrl which includes the path and query
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log('Full callback URL for Xero:', fullUrl);
    
    try {
      const tokenSet = await xero.apiCallback(fullUrl);
      console.log('Token set received successfully');
      console.log('Tenants count:', xero.tenants ? xero.tenants.length : 0);
      
      if (!xero.tenants || xero.tenants.length === 0) {
        console.error('No tenants returned from Xero');
        return res.status(500).json({ error: 'No tenants returned from Xero', details: 'Check Xero app configuration' });
      }
      
      const tenantId = xero.tenants[0].tenantId;
      const tenantName = xero.tenants[0].tenantName || 'Unknown Tenant';
      
      console.log('Tenant ID:', tenantId);
      console.log('Tenant Name:', tenantName);
      console.log('Saving token for tenant...');
      
      // Store token set in JSON file
      const saved = tokenStorage.saveTokenForTenant(tenantId, tenantName, tokenSet);
      
      if (!saved) {
        console.error('Failed to save token to file');
        return res.status(500).json({ error: 'Failed to save token', details: 'Check server logs and file permissions' });
      }
      
      console.log('Token saved successfully!');
      
      // Return success with tenant info
      res.json({ 
        success: true, 
        message: 'Authentication successful',
        tenantId: tenantId,
        tenantName: tenantName
      });
    } catch (apiError) {
      console.error('Xero API callback error:', apiError);
      console.error('Error message:', apiError.message);
      console.error('Error stack:', apiError.stack);
      throw apiError; // Re-throw to be caught by outer catch
    }
  } catch (error) {
    console.error('Error in callback handler:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Authentication failed', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Check if user is authenticated and get all tenants
router.get('/auth-status', async (req, res) => {
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
});

// Get all connected tenants
router.get('/tenants', async (req, res) => {
  try {
    const tenants = tokenStorage.getAllTenants();
    res.json({ tenants });
  } catch (error) {
    console.error('Error fetching tenants:', error);
    res.status(500).json({ error: 'Failed to fetch tenants', details: error.message });
  }
});

// Get Accounts
router.get('/accounts', async (req, res) => {
  try {
    const { tenantId } = req.query;
    
    if (!tenantId) {
      return res.status(400).json({ error: 'tenantId is required' });
    }

    // Get token for the specified tenant
    const tokenSet = tokenStorage.getTokenForTenant(tenantId);
    
    if (!tokenSet) {
      return res.status(401).json({ error: 'Tenant not found or not authenticated' });
    }

    // Set token set for Xero client
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
});

// Disconnect a tenant
router.delete('/tenants/:tenantId', async (req, res) => {
  try {
    const { tenantId } = req.params;
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
});

// Logout - Clear all tenants (optional, can keep them)
router.post('/logout', (req, res) => {
  // Option 1: Keep tenants, just clear session
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.json({ message: 'Logged out successfully' });
  });
  
  // Option 2: Remove all tenants (uncomment to use)
  // const data = tokenStorage.readTokens();
  // data.tenants = [];
  // tokenStorage.writeTokens(data);
  // res.json({ message: 'Logged out and all tenants disconnected' });
});

module.exports = router;

