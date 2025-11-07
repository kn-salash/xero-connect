import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const Callback = ({ setIsAuthenticated, setTenants }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the authorization code from URL
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
          console.error('Xero authorization error:', error);
          navigate('/?error=' + encodeURIComponent(error));
          return;
        }

        if (!code) {
          console.error('No authorization code received');
          navigate('/?error=no_code');
          return;
        }

        // Send the code to backend to exchange for tokens
        // The backend will handle the OAuth callback and store tokens in session
        await axios.get(`/api/xero/callback?code=${code}`, {
          withCredentials: true,
          timeout: 10000
        });

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
          navigate('/dashboard');
        } else {
          navigate('/?error=auth_failed');
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
          navigate('/?error=' + encodeURIComponent(err.message || 'callback_failed'));
        }
      }
    };

    handleCallback();
  }, [navigate, setIsAuthenticated, setTenants, searchParams]);

  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Completing authentication...</p>
    </div>
  );
};

export default Callback;

