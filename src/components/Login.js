import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check for error in URL (from callback)
    const urlError = searchParams.get('error');
    if (urlError) {
      setError(decodeURIComponent(urlError));
    }
  }, [searchParams]);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('/api/xero/login', {
        withCredentials: true,
        timeout: 10000
      });
      if (response.data.consentUrl) {
        // Redirect to Xero consent URL
        window.location.href = response.data.consentUrl;
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.code === 'ECONNREFUSED') {
        setError('Connection refused. Please make sure the backend server is running on port 5000. Run: npm run server');
      } else if (err.response) {
        // Server responded with error
        const errorMsg = err.response.data?.error || err.response.data?.details || err.response.statusText;
        const details = err.response.data?.details ? ` (${err.response.data.details})` : '';
        setError(`Server error: ${errorMsg}${details}`);
      } else if (err.request) {
        setError('No response from server. Please check if the backend is running on port 5000.');
      } else {
        setError(err.message || 'Failed to initiate login. Please check your server configuration.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Xero Connect</h1>
          <p>Connect your Xero accounting software</p>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="login-content">
          <p className="login-description">
            Click the button below to authenticate with Xero. You'll be redirected to Xero's 
            secure login page to authorize this application.
          </p>
          
          <button 
            className="login-button" 
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Connecting...' : 'Connect to Xero'}
          </button>
        </div>

        <div className="login-footer">
          <p className="info-text">
            <strong>Note:</strong> Make sure your backend server is running on port 5000 
            and your Xero app credentials are configured in the .env file.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

