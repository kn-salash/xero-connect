import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Contacts.css';

const Contacts = ({ tenantId }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, customers, suppliers

  useEffect(() => {
    if (tenantId) {
      fetchContacts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId]);

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/xero/contacts?tenantId=${tenantId}`, {
        withCredentials: true,
        timeout: 10000
      });

      if (response.data.contacts) {
        setContacts(response.data.contacts);
      }
    } catch (err) {
      let errorMsg = 'Failed to fetch contacts. Please try again.';
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
      console.error('Error fetching contacts:', err);
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

  const getContactType = (contact) => {
    if (contact.isCustomer && contact.isSupplier) return 'Customer & Supplier';
    if (contact.isCustomer) return 'Customer';
    if (contact.isSupplier) return 'Supplier';
    return 'Other';
  };

  const filteredContacts = contacts.filter(contact => {
    if (filter === 'all') return true;
    if (filter === 'customers') return contact.isCustomer;
    if (filter === 'suppliers') return contact.isSupplier;
    return true;
  });

  if (loading) {
    return (
      <div className="contacts-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="contacts-container">
      <div className="contacts-header">
        <div>
          <h1>Contacts</h1>
          <p>Manage your customers and suppliers</p>
        </div>
        <button onClick={fetchContacts} className="refresh-button">
          Refresh
        </button>
      </div>

      {error && (
        <div className="error">
          {typeof error === 'string' ? error : String(error)}
        </div>
      )}

      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({contacts.length})
        </button>
        <button
          className={`filter-tab ${filter === 'customers' ? 'active' : ''}`}
          onClick={() => setFilter('customers')}
        >
          Customers ({contacts.filter(c => c.isCustomer).length})
        </button>
        <button
          className={`filter-tab ${filter === 'suppliers' ? 'active' : ''}`}
          onClick={() => setFilter('suppliers')}
        >
          Suppliers ({contacts.filter(c => c.isSupplier).length})
        </button>
      </div>

      {filteredContacts.length === 0 && !loading && !error && (
        <div className="empty-state">
          <p>No contacts found.</p>
        </div>
      )}

      {filteredContacts.length > 0 && (
        <div className="table-container">
          <table className="contacts-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Balance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((contact) => (
                <tr key={contact.contactID}>
                  <td>
                    <strong>{contact.name}</strong>
                    {contact.contactNumber && (
                      <div className="contact-number">#{contact.contactNumber}</div>
                    )}
                  </td>
                  <td>
                    <span className={`type-badge ${getContactType(contact).toLowerCase().replace(' & ', '-')}`}>
                      {getContactType(contact)}
                    </span>
                  </td>
                  <td>
                    {contact.emailAddress || '-'}
                  </td>
                  <td>
                    {contact.phones && contact.phones.length > 0
                      ? contact.phones[0].phoneNumber
                      : '-'}
                  </td>
                  <td className={contact.balance < 0 ? 'negative-balance' : ''}>
                    {formatCurrency(contact.balance)}
                  </td>
                  <td>
                    <span className={`status-badge ${contact.contactStatus === 'ACTIVE' ? 'active' : 'archived'}`}>
                      {contact.contactStatus || 'ACTIVE'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Contacts;

