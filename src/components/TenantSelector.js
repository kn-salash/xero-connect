import React from 'react';
import './TenantSelector.css';

const TenantSelector = ({ tenants, selectedTenantId, onSelectTenant, onDisconnectTenant }) => {
  const handleDisconnect = async (tenantId, tenantName) => {
    if (window.confirm(`Are you sure you want to disconnect "${tenantName}"?`)) {
      onDisconnectTenant(tenantId);
    }
  };

  return (
    <div className="card tenant-selector-card">
      <div className="tenant-selector-header">
        <h2>Connected Organizations</h2>
        <span className="tenant-count">{tenants.length} connected</span>
      </div>
      
      <div className="tenant-list">
        {tenants.map((tenant) => (
          <div 
            key={tenant.tenantId} 
            className={`tenant-item ${selectedTenantId === tenant.tenantId ? 'active' : ''}`}
            onClick={() => onSelectTenant(tenant.tenantId)}
          >
            <div className="tenant-info">
              <div className="tenant-name">{tenant.tenantName || 'Unknown Tenant'}</div>
              <div className="tenant-meta">
                <span className="tenant-id">ID: {tenant.tenantId}</span>
                <span className="tenant-date">
                  Connected: {new Date(tenant.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="tenant-actions">
              {selectedTenantId === tenant.tenantId && (
                <span className="active-badge">Active</span>
              )}
              <button
                className="btn btn-danger btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDisconnect(tenant.tenantId, tenant.tenantName);
                }}
                title="Disconnect this organization"
              >
                Disconnect
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="tenant-selector-footer">
        <a href="/" className="btn btn-primary">
          + Connect Another Organization
        </a>
      </div>
    </div>
  );
};

export default TenantSelector;

