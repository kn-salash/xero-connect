import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Accounts.css';

const Accounts = ({ tenantId }) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (tenantId) {
      fetchAccounts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId]);

  const fetchAccounts = async () => {
    if (!tenantId) {
      setError('No tenant selected');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`/api/xero/accounts?tenantId=${tenantId}`, {
        withCredentials: true,
        timeout: 10000
      });
      
      if (response.data.accounts) {
        setAccounts(response.data.accounts);
      }
    } catch (err) {
      let errorMsg = 'Failed to fetch accounts. Please try again.';
      if (err.response?.data) {
        const errorData = err.response.data;
        if (typeof errorData === 'string') {
          errorMsg = errorData;
        } else if (errorData.error) {
          errorMsg = typeof errorData.error === 'string' ? errorData.error : JSON.stringify(errorData.error);
        } else if (typeof errorData === 'object') {
          errorMsg = JSON.stringify(errorData);
        }
      }
      setError(errorMsg);
      console.error('Error fetching accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('en-NZ', {
      style: 'currency',
      currency: 'NZD'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusClass = status === 'ACTIVE' ? 'badge-active' : 
                        status === 'ARCHIVED' ? 'badge-archived' : 
                        'badge-system';
    return <span className={`account-badge ${statusClass}`}>{status}</span>;
  };

  const getTypeBadge = (type) => {
    return <span className="type-badge">{type}</span>;
  };

  if (!tenantId) {
    return (
      <div className="card">
        <p>Please select a tenant to view accounts.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="accounts-container">
      <div className="card">
        <div className="accounts-header">
          <h2>Chart of Accounts</h2>
          <button 
            className="btn btn-primary"
            onClick={fetchAccounts}
            disabled={loading}
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="error">
            {typeof error === 'string' ? error : String(error)}
          </div>
        )}

        {accounts.length === 0 && !loading && !error && (
          <div className="empty-state">
            <p>No accounts found.</p>
          </div>
        )}

        {accounts.length > 0 && (
          <>
            <div className="accounts-summary">
              <p>Total Accounts: <strong>{accounts.length}</strong></p>
            </div>

            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Balance</th>
                    <th>Currency</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account) => (
                    <tr key={account.accountID}>
                      <td>{account.code || '-'}</td>
                      <td>
                        <strong>{account.name}</strong>
                        {account.description && (
                          <div className="account-description">{account.description}</div>
                        )}
                      </td>
                      <td>{getTypeBadge(account.type)}</td>
                      <td>{getStatusBadge(account.status)}</td>
                      <td className={account.balance < 0 ? 'negative-balance' : ''}>
                        {formatCurrency(account.balance)}
                      </td>
                      <td>{account.currencyCode || 'NZD'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Accounts;

