import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import formatCurrency from '../utils/formatCurrency';
import API_URL from '../utils/api';

function formatDate(value) {
  if (!value) {
    return '';
  }
  const plain = String(value).split('T')[0];
  const parts = plain.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return plain;
}

function InvoiceList() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  async function loadInvoices(searchValue = '') {
    try {
      setLoading(true);
      const params = searchValue.trim() ? { search: searchValue.trim() } : {};
      const response = await axios.get(`${API_URL}/invoices`, { params });
      setInvoices(response.data.invoices || []);
      setError('');
    } catch (fetchError) {
      setError('Failed to load invoices.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInvoices();
  }, []);

  function handleSearchSubmit(event) {
    event.preventDefault();
    loadInvoices(searchTerm);
  }

  function handleClearSearch() {
    setSearchTerm('');
    loadInvoices('');
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this invoice?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/invoices/${id}`);
      loadInvoices();
    } catch (deleteError) {
      setError('Failed to delete invoice.');
    }
  }

  return (
    <div className="app-shell">
      <header className="hero-bar">
        <div>
          <p className="eyebrow">Patel Industries</p>
          <h1>GST Billing App</h1>
          <p className="hero-copy">
            Create invoices, revisit old bills, and print the Patel Industries format in one place.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button type="button" className="secondary-button" onClick={() => navigate('/parties')}>
            👥 Manage Parties
          </button>
          <button type="button" className="primary-button" onClick={() => navigate('/new')}>
            + New Invoice
          </button>
        </div>
      </header>

      <main className="panel">
        <form className="mb-5 flex flex-col gap-3 md:flex-row md:items-end" onSubmit={handleSearchSubmit}>
          <label className="flex-1">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Search by buyer name or bill number</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Type a buyer name or invoice number"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-600 focus:ring-4 focus:ring-amber-100"
            />
          </label>
          <div className="flex gap-2">
            <button type="submit" className="primary-button">
              Search
            </button>
            <button type="button" className="secondary-button" onClick={handleClearSearch}>
              Clear
            </button>
          </div>
        </form>

        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <div className="empty-state">Loading invoices...</div>
        ) : invoices.length === 0 ? (
          <div className="empty-state">
            {searchTerm.trim() ? 'No invoices matched your search.' : 'No invoices yet. Start with a new bill.'}
            <div className="empty-action">
              <Link to="/new" className="primary-button inline-button">
                + New Invoice
              </Link>
            </div>
          </div>
        ) : (
          <div className="table-wrap">
            {/* Desktop Table View */}
            <table className="list-table hidden md:table w-full">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Date</th>
                  <th>Buyer Name</th>
                  <th>Grand Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice._id}>
                    <td>{String(invoice.invoiceNumber).padStart(3, '0')}</td>
                    <td>{formatDate(invoice.invoiceDate)}</td>
                    <td>{invoice.buyerName}</td>
                    <td>₹{formatCurrency(invoice.grandTotal)}</td>
                    <td>
                      <div className="action-group">
                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => navigate(`/invoice/${invoice._id}`)}
                        >
                          View
                        </button>
                        <button type="button" className="danger-button" onClick={() => handleDelete(invoice._id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards View */}
            <div className="flex flex-col gap-4 md:hidden">
              {invoices.map((invoice) => (
                <div key={invoice._id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-bold text-slate-800">
                      Invoice #{String(invoice.invoiceNumber).padStart(3, '0')}
                    </span>
                    <span className="text-sm text-slate-500">{formatDate(invoice.invoiceDate)}</span>
                  </div>
                  <div className="mb-4">
                    <div className="text-sm text-slate-500">Buyer Name</div>
                    <div className="font-semibold text-slate-900">{invoice.buyerName}</div>
                  </div>
                  <div className="mb-4">
                    <div className="text-sm text-slate-500">Grand Total</div>
                    <div className="text-lg font-bold text-amber-700">₹{formatCurrency(invoice.grandTotal)}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="secondary-button flex-1"
                      onClick={() => navigate(`/invoice/${invoice._id}`)}
                    >
                      View
                    </button>
                    <button type="button" className="danger-button flex-1" onClick={() => handleDelete(invoice._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default InvoiceList;
