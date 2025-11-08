const { getSession } = require('./login');
const userStorage = require('../utils/userStorage');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Session-Id');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sessionId = req.headers['x-session-id'] || req.query.sessionId;

    if (!sessionId) {
      return res.json({ authenticated: false });
    }

    const session = getSession(sessionId);

    if (!session) {
      return res.json({ authenticated: false });
    }

    const user = userStorage.getUserById(session.userId);

    if (!user) {
      return res.json({ authenticated: false });
    }

    res.json({
      authenticated: true,
      user: user
    });
  } catch (error) {
    console.error('Error checking session:', error);
    res.json({ authenticated: false });
  }
};

