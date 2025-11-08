import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Callback from './components/Callback';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/xero/auth-status', {
        credentials: 'include',
        signal: AbortSignal.timeout(5000) // Reduced timeout
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setIsAuthenticated(data.authenticated || false);
      setTenants(data.tenants || []);
    } catch (error) {
      console.error('Error checking auth status:', error);
      // Don't block rendering if backend is down
      setIsAuthenticated(false);
      setTenants([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
          />
          <Route 
            path="/callback" 
            element={<Callback setIsAuthenticated={setIsAuthenticated} setTenants={setTenants} />} 
          />
          <Route 
            path="/dashboard/*" 
            element={
              isAuthenticated ? (
                <Dashboard 
                  setIsAuthenticated={setIsAuthenticated} 
                  tenants={tenants}
                  setTenants={setTenants}
                />
              ) : (
                <Navigate to="/" />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

