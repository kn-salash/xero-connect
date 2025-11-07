import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Accounts from './Accounts';
import TenantSelector from './TenantSelector';
import './Dashboard.css';

const Dashboard = ({ setIsAuthenticated, tenants, setTenants }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTenantId, setSelectedTenantId] = useState(null);

  useEffect(() => {
    // Set default tenant if available
    if (tenants && tenants.length > 0 && !selectedTenantId) {
      setSelectedTenantId(tenants[0].tenantId);
    }
  }, [tenants, selectedTenantId]);

  const handleLogout = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
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
      <div className="container">
        <div className="header">
          <div>
            <h1>Xero Dashboard</h1>
            <p>Manage your Xero accounting data</p>
          </div>
          <button 
            className="btn btn-secondary"
            onClick={handleLogout}
            disabled={loading}
          >
            {loading ? 'Logging out...' : 'Logout'}
          </button>
        </div>

        {error && (
          <div className="error">
            {error}
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

        {selectedTenantId && (
          <Accounts tenantId={selectedTenantId} />
        )}

        {tenants && tenants.length === 0 && (
          <div className="card">
            <p>No tenants connected. Please connect a Xero organization.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

