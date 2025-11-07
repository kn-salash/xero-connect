const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const KEY_PATH = path.join(__dirname, '..', 'server', 'server.key');
const CERT_PATH = path.join(__dirname, '..', 'server', 'server.crt');

console.log('Generating self-signed SSL certificate for localhost...');
console.log('This will allow HTTPS on localhost\n');

try {
  // Check if OpenSSL is available
  execSync('openssl version', { stdio: 'ignore' });
  
  // Generate private key
  console.log('1. Generating private key...');
  execSync(`openssl genrsa -out "${KEY_PATH}" 2048`, { stdio: 'inherit' });
  
  // Generate certificate
  console.log('2. Generating certificate...');
  // Set OPENSSL_CONF to empty to avoid config file issues on Windows
  const env = { ...process.env };
  delete env.OPENSSL_CONF;
  execSync(`openssl req -new -x509 -key "${KEY_PATH}" -out "${CERT_PATH}" -days 365 -subj "/CN=localhost"`, { 
    stdio: 'inherit',
    env: env
  });
  
  console.log('\n✓ SSL certificate generated successfully!');
  console.log(`  Key: ${KEY_PATH}`);
  console.log(`  Cert: ${CERT_PATH}`);
  console.log('\nNext steps:');
  console.log('1. Update Xero app redirect URI to: https://localhost:3000/callback');
  console.log('2. Update .env: XERO_REDIRECT_URI=https://localhost:3000/callback');
  console.log('3. Run: npm run dev:https');
  console.log('4. Accept the self-signed certificate warning in your browser');
  
} catch (error) {
  console.error('\n✗ Error generating certificate');
  console.error('Error:', error.message);
  console.error('\nAlternative: Use ngrok (easier)');
  console.error('1. Install ngrok: https://ngrok.com/download');
  console.error('2. Run: ngrok http 3000');
  console.error('3. Use the ngrok HTTPS URL');
}

