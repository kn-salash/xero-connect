// User storage for authentication
// In production, use a proper database (Vercel Postgres, Supabase, etc.)

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const USER_FILE_PATH = path.join('/tmp', 'users.json');

// In-memory cache
let userCache = null;

function readUsers() {
  try {
    if (userCache !== null) {
      return userCache;
    }

    if (fs.existsSync(USER_FILE_PATH)) {
      const fileContent = fs.readFileSync(USER_FILE_PATH, 'utf8');
      userCache = JSON.parse(fileContent);
      return userCache;
    }

    userCache = { users: [] };
    return userCache;
  } catch (error) {
    console.error('Error reading users:', error);
    userCache = { users: [] };
    return userCache;
  }
}

function writeUsers(data) {
  try {
    userCache = data;
    fs.writeFileSync(USER_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing users:', error);
    return false;
  }
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function createUser(username, password, email = null) {
  try {
    const data = readUsers();
    
    // Check if user already exists
    if (data.users.find(u => u.username === username)) {
      return { success: false, error: 'Username already exists' };
    }

    const user = {
      id: crypto.randomUUID(),
      username,
      passwordHash: hashPassword(password),
      email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      xeroTenants: [] // Array of tenant IDs linked to this user
    };

    data.users.push(user);
    
    if (writeUsers(data)) {
      return { success: true, user: { ...user, passwordHash: undefined } };
    }
    
    return { success: false, error: 'Failed to save user' };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error: error.message };
  }
}

function authenticateUser(username, password) {
  try {
    const data = readUsers();
    const user = data.users.find(u => u.username === username);
    
    if (!user) {
      return { success: false, error: 'Invalid username or password' };
    }

    const passwordHash = hashPassword(password);
    
    if (user.passwordHash !== passwordHash) {
      return { success: false, error: 'Invalid username or password' };
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    user.updatedAt = new Date().toISOString();
    writeUsers(data);

    return { 
      success: true, 
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        xeroTenants: user.xeroTenants || []
      }
    };
  } catch (error) {
    console.error('Error authenticating user:', error);
    return { success: false, error: error.message };
  }
}

function getUserById(userId) {
  try {
    const data = readUsers();
    const user = data.users.find(u => u.id === userId);
    
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      xeroTenants: user.xeroTenants || []
    };
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

function linkTenantToUser(userId, tenantId) {
  try {
    const data = readUsers();
    const user = data.users.find(u => u.id === userId);
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (!user.xeroTenants) {
      user.xeroTenants = [];
    }

    if (!user.xeroTenants.includes(tenantId)) {
      user.xeroTenants.push(tenantId);
      user.updatedAt = new Date().toISOString();
      writeUsers(data);
    }

    return { success: true };
  } catch (error) {
    console.error('Error linking tenant:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  createUser,
  authenticateUser,
  getUserById,
  linkTenantToUser
};

