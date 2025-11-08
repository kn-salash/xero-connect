const userStorage = require('../utils/userStorage');

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
    const { username, password, email } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username and password are required' 
      });
    }

    if (username.length < 3) {
      return res.status(400).json({ 
        error: 'Username must be at least 3 characters' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters' 
      });
    }

    const result = userStorage.createUser(username, password, email);

    if (result.success) {
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        user: result.user
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      error: 'Failed to register user',
      details: error.message
    });
  }
};

