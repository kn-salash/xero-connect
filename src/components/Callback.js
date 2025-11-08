import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './Callback.css';

const Callback = ({ setIsAuthenticated, setTenants }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Completing authentication...');
  const [tenantInfo, setTenantInfo] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the authorization code from URL
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
          console.error('Xero authorization error:', error);
          setStatus('error');
          setMessage('Authentication failed: ' + decodeURIComponent(error));
          setTimeout(() => {
            navigate('/?error=' + encodeURIComponent(error));
          }, 3000);
          return;
        }

        if (!code) {
          console.error('No authorization code received');
          setStatus('error');
          setMessage('No authorization code received');
          setTimeout(() => {
            navigate('/?error=no_code');
          }, 3000);
          return;
        }

        setStatus('processing');
        setMessage('Exchanging authorization code for tokens...');

        // Send the code to backend to exchange for tokens
        const callbackResponse = await axios.get(`/api/xero/callback?code=${code}`, {
          withCredentials: true,
          timeout: 10000
        });

        // If we got a success response with tenant info, show it
        if (callbackResponse.data.success && callbackResponse.data.tenantName) {
          setTenantInfo({
            tenantId: callbackResponse.data.tenantId,
            tenantName: callbackResponse.data.tenantName
          });
          setStatus('success');
          setMessage(`Successfully connected to ${callbackResponse.data.tenantName}!`);
        } else {
          setStatus('processing');
          setMessage('Verifying authentication...');
        }

        // Check auth status after callback
        const authCheck = await axios.get('/api/xero/auth-status', {
          withCredentials: true,
          timeout: 10000
        });

        if (authCheck.data.authenticated) {
          setIsAuthenticated(true);
          if (setTenants) {
            setTenants(authCheck.data.tenants || []);
          }
          
          // Update status if not already success
          setStatus('success');
          const tenantName = authCheck.data.tenants?.[0]?.tenantName || tenantInfo?.tenantName || 'Xero';
          setMessage(`Successfully connected to ${tenantName}!`);
          
          if (!tenantInfo && authCheck.data.tenants?.[0]) {
            setTenantInfo({
              tenantId: authCheck.data.tenants[0].tenantId,
              tenantName: authCheck.data.tenants[0].tenantName
            });
          }
          
          // Redirect to dashboard after showing success message
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          setStatus('error');
          setMessage('Authentication verification failed');
          setTimeout(() => {
            navigate('/?error=auth_failed');
          }, 3000);
        }
      } catch (err) {
        console.error('Callback error:', err);
        // Backend might redirect, so check auth status after a delay
        if (err.response?.status >= 300 && err.response?.status < 400) {
          // It's a redirect, wait and check auth
          setTimeout(async () => {
            try {
              const authCheck = await axios.get('/api/xero/auth-status', {
                withCredentials: true,
                timeout: 10000
              });
              if (authCheck.data.authenticated) {
                setIsAuthenticated(true);
                if (setTenants) {
                  setTenants(authCheck.data.tenants || []);
                }
                navigate('/dashboard');
              } else {
                navigate('/');
              }
            } catch (e) {
              navigate('/');
            }
          }, 1000);
        } else {
          // Extract error message properly
          let errorMessage = 'callback_failed';
          
          try {
            if (err.response?.data) {
              const errorData = err.response.data;
              if (typeof errorData === 'string') {
                errorMessage = errorData;
              } else if (errorData && typeof errorData === 'object') {
                if (errorData.error) {
                  errorMessage = typeof errorData.error === 'string' 
                    ? errorData.error 
                    : (errorData.details || JSON.stringify(errorData.error));
                } else if (errorData.details) {
                  errorMessage = typeof errorData.details === 'string'
                    ? errorData.details
                    : JSON.stringify(errorData.details);
                } else {
                  errorMessage = JSON.stringify(errorData);
                }
              }
            } else if (err.message) {
              errorMessage = typeof err.message === 'string' ? err.message : JSON.stringify(err.message);
            }
          } catch (e) {
            errorMessage = 'Authentication failed';
          }
          
          // Ensure errorMessage is always a string
          if (typeof errorMessage !== 'string') {
            try {
              errorMessage = JSON.stringify(errorMessage);
            } catch (e) {
              errorMessage = 'Authentication failed';
            }
          }
          
          navigate('/?error=' + encodeURIComponent(errorMessage));
        }
      }
    };

    handleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, setIsAuthenticated, setTenants, searchParams]);

  return (
    <div className="callback-container">
      {status === 'processing' && (
        <div className="callback-content">
          <div className="spinner"></div>
          <p className="callback-message">{message}</p>
        </div>
      )}
      
      {status === 'success' && (
        <div className="callback-content success">
          <div className="success-icon">✓</div>
          <h2 className="success-title">Authentication Successful!</h2>
          <p className="callback-message">{message}</p>
          {tenantInfo && (
            <div className="tenant-info">
              <p><strong>Organization:</strong> {tenantInfo.tenantName}</p>
            </div>
          )}
          <p className="redirect-message">Redirecting to dashboard...</p>
        </div>
      )}
      
      {status === 'error' && (
        <div className="callback-content error">
          <div className="error-icon">✗</div>
          <h2 className="error-title">Authentication Failed</h2>
          <p className="callback-message">{message}</p>
          <p className="redirect-message">Redirecting to login...</p>
        </div>
      )}
    </div>
  );
};

export default Callback;

