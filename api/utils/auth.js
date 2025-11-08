// Authentication middleware for protecting API endpoints
// Requires API_KEY or API_PASSWORD in environment variables

function authenticateRequest(req, res) {
  // Skip authentication for OPTIONS requests (CORS preflight)
  if (req.method === 'OPTIONS') {
    return true;
  }

  // Get API key/password from environment
  const requiredApiKey = process.env.API_KEY || process.env.API_PASSWORD;
  
  // If no API key is set, allow access (for development)
  if (!requiredApiKey) {
    console.warn('Warning: No API_KEY or API_PASSWORD set. Allowing unauthenticated access.');
    return true;
  }

  // Check for API key in headers (X-API-Key or Authorization)
  const apiKey = req.headers['x-api-key'] || 
                 req.headers['authorization']?.replace('Bearer ', '') ||
                 req.headers['authorization']?.replace('Basic ', '') ||
                 req.query?.apiKey;

  if (!apiKey) {
    res.status(401).json({ 
      error: 'Unauthorized',
      message: 'API key required. Provide it in X-API-Key header, Authorization header, or apiKey query parameter.'
    });
    return false;
  }

  // Verify API key
  if (apiKey !== requiredApiKey) {
    res.status(403).json({ 
      error: 'Forbidden',
      message: 'Invalid API key'
    });
    return false;
  }

  // Authentication successful
  return true;
}

module.exports = authenticateRequest;

