import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = ({ onLogout, tenants, selectedTenantId, onSelectTenant }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || (location.pathname === '/dashboard' && path === '/dashboard/home');
  };

  return (
    <nav className="main-navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <h2>Xero Connect</h2>
        </div>
        
        {tenants && tenants.length > 0 && (
          <div className="nav-tenant-selector">
            <label htmlFor="tenant-select" className="tenant-label">Organization:</label>
            <select
              id="tenant-select"
              className="tenant-select"
              value={selectedTenantId || ''}
              onChange={(e) => onSelectTenant && onSelectTenant(e.target.value)}
            >
              {tenants.map((tenant) => (
                <option key={tenant.tenantId} value={tenant.tenantId}>
                  {tenant.tenantName || tenant.tenantId}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="nav-links">
          <button
            className={`nav-link ${isActive('/dashboard/home') ? 'active' : ''}`}
            onClick={() => navigate('/dashboard/home')}
          >
            Home
          </button>
          <button
            className={`nav-link ${isActive('/dashboard/accounts') ? 'active' : ''}`}
            onClick={() => navigate('/dashboard/accounts')}
          >
            Accounts
          </button>
          <button
            className={`nav-link ${isActive('/dashboard/contacts') ? 'active' : ''}`}
            onClick={() => navigate('/dashboard/contacts')}
          >
            Contacts
          </button>
        </div>
        <div className="nav-actions">
          <button className="nav-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

