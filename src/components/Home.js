import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';

const Home = ({ tenantId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (tenantId) {
      fetchStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId]);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch accounts for stats
      const accountsResponse = await axios.get(`/api/xero/accounts?tenantId=${tenantId}`, {
        withCredentials: true,
        timeout: 10000
      });

      const accounts = accountsResponse.data.accounts || [];
      const bankAccounts = accountsResponse.data.bankAccounts || [];

      // Calculate total balance
      const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
      const bankBalance = bankAccounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

      setStats({
        totalAccounts: accounts.length,
        bankAccounts: bankAccounts.length,
        totalBalance,
        bankBalance,
        activeAccounts: accounts.filter(acc => acc.status === 'ACTIVE').length
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load statistics');
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

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchStats} className="retry-button">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome to your Xero accounting dashboard</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon accounts">📊</div>
          <div className="stat-content">
            <h3>{stats?.totalAccounts || 0}</h3>
            <p>Total Accounts</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bank">🏦</div>
          <div className="stat-content">
            <h3>{stats?.bankAccounts || 0}</h3>
            <p>Bank Accounts</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon balance">💰</div>
          <div className="stat-content">
            <h3>{formatCurrency(stats?.totalBalance || 0)}</h3>
            <p>Total Balance</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon active">✓</div>
          <div className="stat-content">
            <h3>{stats?.activeAccounts || 0}</h3>
            <p>Active Accounts</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <div className="action-card">
            <h3>View Accounts</h3>
            <p>Browse all your chart of accounts</p>
          </div>
          <div className="action-card">
            <h3>View Contacts</h3>
            <p>Manage your customers and suppliers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

