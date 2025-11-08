const { XeroClient } = require('xero-node');
const tokenStorage = require('./tokenStorage');

// Initialize Xero Client
function getXeroClient() {
  return new XeroClient({
    clientId: process.env.XERO_CLIENT_ID,
    clientSecret: process.env.XERO_CLIENT_SECRET,
    redirectUris: [
      process.env.XERO_REDIRECT_URI || 
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api/xero/callback` : 'http://localhost:3000/callback')
    ],
    scopes: 'openid profile email accounting.settings accounting.transactions accounting.contacts.read offline_access'.split(' ')
  });
}

module.exports = {
  getXeroClient,
  tokenStorage
};

