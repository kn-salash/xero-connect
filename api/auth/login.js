const userStorage = require('../utils/userStorage');
const crypto = require('crypto');

// Simple session storage (in production, use Redis or database)
const sessions = {};

function createSession(userId) {
  const sessionId = crypto.randomUUID();
  sessions[sessionId] = {
    userId,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
  };
  return sessionId;
}

function getSession(sessionId) {
  const session = sessions[sessionId];
  if (!session) {
    return null;
  }
  
  // Check if session expired
  if (new Date(session.expiresAt) < new Date()) {
    delete sessions[sessionId];
    return null;
  }
  
  return session;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username and password are required' 
      });
    }

    const result = userStorage.authenticateUser(username, password);

    if (result.success) {
      const sessionId = createSession(result.user.id);
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        user: result.user,
        sessionId: sessionId
      });
    } else {
      res.status(401).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({
      error: 'Failed to login',
      details: error.message
    });
  }
};

// Export session functions for use in other endpoints
module.exports.getSession = getSession;
module.exports.sessions = sessions;

