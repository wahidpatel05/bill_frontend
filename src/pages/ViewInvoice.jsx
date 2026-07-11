import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import InvoicePrint from '../components/InvoicePrint';
import API_URL from '../utils/api';

function ViewInvoice() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadInvoice() {
      try {
        const [invoiceResponse, settingsResponse] = await Promise.all([
          axios.get(`${API_URL}/invoices/${id}`),
          axios.get(`${API_URL}/settings`),
        ]);

        setInvoice(invoiceResponse.data);
        setSettings(settingsResponse.data);
      } catch (fetchError) {
        setError('Failed to load invoice.');
      } finally {
        setLoading(false);
      }
    }

    loadInvoice();
  }, [id]);

  return (
    <div className="app-shell invoice-view-shell">
      <div className="no-print top-toolbar mb-4 flex items-center justify-between gap-3">
        <button type="button" className="secondary-button" onClick={() => navigate('/')}>
          ← Back
        </button>
        <button type="button" className="primary-button" onClick={() => window.print()}>
          🖨 Print
        </button>
      </div>

      {loading ? (
        <div className="panel empty-state">Loading invoice...</div>
      ) : error ? (
        <div className="panel error-banner">{error}</div>
      ) : (
        <InvoicePrint invoice={invoice} settings={settings} />
      )}
    </div>
  );
}

export default ViewInvoice;