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
      try {
        const decoded = decodeURIComponent(urlError);
        // Ensure it's a string, not an object
        setError(typeof decoded === 'string' ? decoded : String(decoded));
      } catch (e) {
        setError('An error occurred');
      }
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
      let errorMessage = 'Failed to initiate login. Please check your server configuration.';
      
      if (err.code === 'ECONNREFUSED') {
        errorMessage = 'Connection refused. Please make sure the backend server is running on port 5000. Run: npm run server';
      } else if (err.response) {
        // Server responded with error
        const errorData = err.response.data || {};
        let errorMsg = '';
        let detailsMsg = '';
        
        // Safely extract error message
        if (typeof errorData === 'string') {
          errorMsg = errorData;
        } else if (errorData && typeof errorData === 'object') {
          if (errorData.error) {
            if (typeof errorData.error === 'string') {
              errorMsg = errorData.error;
            } else {
              try {
                errorMsg = JSON.stringify(errorData.error);
              } catch (e) {
                errorMsg = 'Unknown error';
              }
            }
          }
          
          if (errorData.details) {
            if (typeof errorData.details === 'string') {
              detailsMsg = ` (${errorData.details})`;
            } else {
              try {
                detailsMsg = ` (${JSON.stringify(errorData.details)})`;
              } catch (e) {
                // Ignore details if can't stringify
              }
            }
          }
          
          // If no error message found, try to stringify the whole object
          if (!errorMsg && Object.keys(errorData).length > 0) {
            try {
              errorMsg = JSON.stringify(errorData);
            } catch (e) {
              errorMsg = 'Server returned an error';
            }
          }
        }
        
        if (!errorMsg) {
          errorMsg = err.response.statusText || 'Server error';
        }
        
        errorMessage = `Server error: ${errorMsg}${detailsMsg}`;
      } else if (err.request) {
        errorMessage = 'No response from server. Please check if the backend is running on port 5000.';
      } else if (err.message) {
        errorMessage = typeof err.message === 'string' ? err.message : JSON.stringify(err.message);
      }
      
      setError(errorMessage);
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
            {typeof error === 'string' ? error : String(error)}
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

