const https = require('https');
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const xeroRoutes = require('./routes/xero');

const app = express();
const PORT = process.env.PORT || 5000;

// SSL certificate paths
const KEY_PATH = path.join(__dirname, 'server.key');
const CERT_PATH = path.join(__dirname, 'server.crt');

// Check if certificates exist
if (!fs.existsSync(KEY_PATH) || !fs.existsSync(CERT_PATH)) {
  console.error('SSL certificates not found!');
  console.error('Run: npm run generate-cert');
  console.error('Or use ngrok for easier setup.');
  process.exit(1);
}

const httpsOptions = {
  key: fs.readFileSync(KEY_PATH),
  cert: fs.readFileSync(CERT_PATH)
};

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true } // HTTPS required
}));

// Routes
app.use('/api/xero', xeroRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running on HTTPS' });
});

https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`HTTPS Server running on https://localhost:${PORT}`);
  console.log('Note: You may need to accept the self-signed certificate in your browser');
});

