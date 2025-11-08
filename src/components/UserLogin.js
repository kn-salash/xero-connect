import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserLogin.css';

const UserLogin = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // Login
        const response = await axios.post('/api/auth/login', {
          username: formData.username,
          password: formData.password
        });

        if (response.data.success) {
          // Store session ID
          localStorage.setItem('sessionId', response.data.sessionId);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          if (onLogin) {
            onLogin(response.data.user, response.data.sessionId);
          }
          
          navigate('/dashboard');
        } else {
          setError(response.data.error || 'Login failed');
        }
      } else {
        // Register
        const response = await axios.post('/api/auth/register', {
          username: formData.username,
          password: formData.password,
          email: formData.email || null
        });

        if (response.data.success) {
          setError(null);
          setIsLogin(true);
          // Auto-fill username after registration
          setFormData({ ...formData, password: '' });
          setError('Registration successful! Please login.');
        } else {
          setError(response.data.error || 'Registration failed');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      const errorMsg = err.response?.data?.error || err.message || 'An error occurred';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-login-container">
      <div className="user-login-card">
        <div className="user-login-header">
          <h1>Xero Connect</h1>
          <p>{isLogin ? 'Login to your account' : 'Create a new account'}</p>
        </div>

        {error && (
          <div className={`error-message ${error.includes('successful') ? 'success' : ''}`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="user-login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              minLength={3}
              placeholder="Enter your username"
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="email">Email (Optional)</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Enter your password"
            />
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? (isLogin ? 'Logging in...' : 'Registering...') : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>

        <div className="user-login-footer">
          <p>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button 
              type="button"
              className="toggle-button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setFormData({ username: '', password: '', email: '' });
              }}
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;

