const https = require('https');
const fs = require('fs');
const path = require('path');

// Certificate paths
const KEY_PATH = path.join(__dirname, 'server.key');
const CERT_PATH = path.join(__dirname, 'server.crt');

// Check if certificates exist
if (!fs.existsSync(KEY_PATH) || !fs.existsSync(CERT_PATH)) {
  console.log('SSL certificates not found. Generating self-signed certificate...');
  console.log('Run: npm run generate-cert');
  console.log('Or use ngrok for easier setup.');
  process.exit(1);
}

const options = {
  key: fs.readFileSync(KEY_PATH),
  cert: fs.readFileSync(CERT_PATH)
};

module.exports = options;

