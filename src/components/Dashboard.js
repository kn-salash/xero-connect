import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navigation from './Navigation';
import Home from './Home';
import Accounts from './Accounts';
import Contacts from './Contacts';
import TenantSelector from './TenantSelector';
import './Dashboard.css';

const Dashboard = ({ setIsAuthenticated, tenants, setTenants }) => {
  const [error, setError] = useState(null);
  const [selectedTenantId, setSelectedTenantId] = useState(null);

  useEffect(() => {
    // Set default tenant if available
    if (tenants && tenants.length > 0 && !selectedTenantId) {
      setSelectedTenantId(tenants[0].tenantId);
    }
  }, [tenants, selectedTenantId]);

  const handleLogout = async () => {
    try {
      await axios.post('/api/xero/logout', {}, {
        withCredentials: true,
        timeout: 10000
      });
      setIsAuthenticated(false);
      setTenants([]);
    } catch (err) {
      setError('Failed to logout');
      console.error('Logout error:', err);
    }
  };

  const handleDisconnectTenant = async (tenantId) => {
    try {
      await axios.delete(`/api/xero/tenants/${tenantId}`, {
        withCredentials: true,
        timeout: 10000
      });
      
      // Refresh tenants list
      const response = await axios.get('/api/xero/tenants', {
        withCredentials: true,
        timeout: 10000
      });
      
      if (setTenants) {
        setTenants(response.data.tenants || []);
      }
      
      // If disconnected tenant was selected, select first available
      if (selectedTenantId === tenantId) {
        const updatedTenants = response.data.tenants || [];
        if (updatedTenants.length > 0) {
          setSelectedTenantId(updatedTenants[0].tenantId);
        } else {
          setIsAuthenticated(false);
        }
      }
    } catch (err) {
      setError('Failed to disconnect tenant');
      console.error('Disconnect error:', err);
    }
  };

  return (
    <div className="dashboard-container">
      <Navigation 
        onLogout={handleLogout}
        tenants={tenants}
        selectedTenantId={selectedTenantId}
        onSelectTenant={setSelectedTenantId}
      />
      
      <div className="container">
        {error && (
          <div className="error">
            {typeof error === 'string' ? error : String(error)}
          </div>
        )}

        {tenants && tenants.length > 0 && (
          <TenantSelector
            tenants={tenants}
            selectedTenantId={selectedTenantId}
            onSelectTenant={setSelectedTenantId}
            onDisconnectTenant={handleDisconnectTenant}
          />
        )}

        {tenants && tenants.length === 0 && (
          <div className="card">
            <p>No tenants connected. Please connect a Xero organization.</p>
          </div>
        )}

        {selectedTenantId && (
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard/home" replace />} />
            <Route path="/home" element={<Home tenantId={selectedTenantId} />} />
            <Route path="/accounts" element={<Accounts tenantId={selectedTenantId} />} />
            <Route path="/contacts" element={<Contacts tenantId={selectedTenantId} />} />
          </Routes>
        )}

        {!selectedTenantId && tenants.length > 0 && (
          <div className="card">
            <p>Please select a tenant to view data.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

