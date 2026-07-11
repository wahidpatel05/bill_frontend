import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LineItemsTable from '../components/LineItemsTable';
import calculateTotals from '../utils/calculateTotals';
import amountToWords from '../utils/amountToWords';
import formatCurrency from '../utils/formatCurrency';
import getStateCode from '../utils/getStateCode';
import API_URL from '../utils/api';

function createEmptyItem() {
  return {
    description: '',
    hsnCode: '3923',
    quantity: '',
    unit: 'PCS',
    rate: '',
  };
}

function NewInvoice() {
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    invoiceNumber: '',
    invoiceDate: today,
    buyerName: '',
    buyerAddress: '',
    buyerGstin: '',
    buyerStateCode: '',
    buyerMobile: '',
    items: [createEmptyItem()],
    gstType: 'INTRA_STATE',
  });
  const [loadingNextNumber, setLoadingNextNumber] = useState(true);
  const [gstinLookupStatus, setGstinLookupStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadNextNumber() {
      try {
        const response = await axios.get(`${API_URL}/invoices/next-number`);
        setForm((current) => ({ ...current, invoiceNumber: response.data.nextInvoiceNumber }));
      } catch (fetchError) {
        setError('Failed to load next invoice number.');
      } finally {
        setLoadingNextNumber(false);
      }
    }

    loadNextNumber();
  }, []);

  const normalizedItems = form.items.map((item) => ({
    ...item,
    quantity: Number(item.quantity || 0),
    rate: Number(item.rate || 0),
    amount: Number(item.quantity || 0) * Number(item.rate || 0),
  }));

  const totals = calculateTotals(normalizedItems, form.gstType);
  const amountWords = amountToWords(totals.grandTotal);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateItem(index, field, value) {
    setForm((current) => {
      const items = current.items.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item));
      return { ...current, items };
    });
  }

  function addItem() {
    setForm((current) => ({
      ...current,
      items: [...current.items, createEmptyItem()],
    }));
  }

  function removeItem(index) {
    setForm((current) => ({
      ...current,
      items: current.items.length === 1 ? current.items : current.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  async function handleGstinBlur() {
    const stateCode = getStateCode(form.buyerGstin);
    if (!stateCode) {
      return;
    }

    setForm((current) => ({
      ...current,
      buyerStateCode: stateCode,
      gstType: stateCode === '27' ? 'INTRA_STATE' : 'INTER_STATE',
    }));

    if (form.buyerGstin.length !== 15) {
      setGstinLookupStatus('Enter a 15-character GSTIN to search past invoices.');
      return;
    }

    setGstinLookupStatus('Checking past invoices...');

    try {
      const response = await axios.get(`${API_URL}/invoices/lookup/by-gstin/${form.buyerGstin}`);
      const buyerName = response.data?.buyerName || '';
      const buyerAddress = response.data?.buyerAddress || '';

      setForm((current) => ({
        ...current,
        buyerName: buyerName || current.buyerName,
        buyerAddress: buyerAddress || current.buyerAddress,
      }));

      setGstinLookupStatus(buyerName || buyerAddress ? 'Loaded company details from a previous invoice.' : '');
    } catch (lookupError) {
      if (lookupError?.response?.status === 404) {
        setGstinLookupStatus('');
        return;
      }

      setGstinLookupStatus('');
    }
  }

  function handleStateCodeChange(value) {
    setForm((current) => ({
      ...current,
      buyerStateCode: value,
      gstType: value === '27' ? 'INTRA_STATE' : 'INTER_STATE',
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const payload = {
      ...form,
      invoiceNumber: Number(form.invoiceNumber),
      items: normalizedItems,
      subtotal: totals.subtotal,
      cgstRate: totals.cgstRate,
      cgstAmount: totals.cgstAmount,
      sgstRate: totals.sgstRate,
      sgstAmount: totals.sgstAmount,
      igstRate: totals.igstRate,
      igstAmount: totals.igstAmount,
      roundOff: totals.roundOff,
      grandTotal: totals.grandTotal,
      amountInWords: amountWords,
    };

    try {
      const response = await axios.post(`${API_URL}/invoices`, payload);
      navigate(`/invoice/${response.data._id}`);
    } catch (submitError) {
      const message = submitError?.response?.data?.message || 'Failed to save invoice.';
      setError(message);
    }
  }

  return (
    <div className="app-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Patel Industries</p>
          <h1>Create New Invoice</h1>
          <p className="hero-copy">Fill in the bill details, save, and print the invoice in one go.</p>
        </div>
        <button type="button" className="secondary-button" onClick={() => navigate('/')}>
          Cancel
        </button>
      </header>

      <form className="form-layout" onSubmit={handleSubmit}>
        <div className="panel section-spacing">
          <h2>Invoice Header</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label>
              <span>Invoice Number</span>
              <input
                type="number"
                value={loadingNextNumber ? '' : form.invoiceNumber}
                onChange={(event) => updateField('invoiceNumber', event.target.value)}
              />
              <small className="helper-text">Auto-suggested. You can change it.</small>
            </label>
            <label>
              <span>Invoice Date</span>
              <input type="date" value={form.invoiceDate} onChange={(event) => updateField('invoiceDate', event.target.value)} />
            </label>
          </div>
          {error && <div className="field-error">{error}</div>}
        </div>

        <div className="panel section-spacing">
          <h2>Buyer Details</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label>
              <span>Buyer GSTIN</span>
              <input
                type="text"
                maxLength="15"
                value={form.buyerGstin}
                onChange={(event) => updateField('buyerGstin', event.target.value.toUpperCase())}
                onBlur={handleGstinBlur}
              />
              <small className="helper-text">Enter GSTIN, then tab out to auto-fill from previous invoices if it exists.</small>
            </label>
            <label>
              <span>State Code</span>
              <input
                type="text"
                maxLength="2"
                value={form.buyerStateCode}
                onChange={(event) => handleStateCodeChange(event.target.value.slice(0, 2))}
              />
            </label>
            <label>
              <span>Buyer Name / Business Name</span>
              <input type="text" value={form.buyerName} onChange={(event) => updateField('buyerName', event.target.value)} />
            </label>
            <label>
              <span>Mobile</span>
              <input type="text" value={form.buyerMobile} onChange={(event) => updateField('buyerMobile', event.target.value)} />
            </label>
          </div>
          <label className="full-width-field">
            <span>Buyer Address</span>
            <textarea rows="3" value={form.buyerAddress} onChange={(event) => updateField('buyerAddress', event.target.value)} />
          </label>
          {gstinLookupStatus && <div className="helper-text mt-2 text-sm text-slate-600">{gstinLookupStatus}</div>}
        </div>

        <LineItemsTable
          items={form.items}
          onChange={updateItem}
          onAdd={addItem}
          onRemove={removeItem}
          formatCurrency={formatCurrency}
        />

        <div className="panel section-spacing">
          <h2>GST Type</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 font-medium">
              <input
                type="radio"
                name="gstType"
                checked={form.gstType === 'INTRA_STATE'}
                onChange={() => updateField('gstType', 'INTRA_STATE')}
              />
              CGST + SGST (Intra-State)
            </label>
            <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 font-medium">
              <input
                type="radio"
                name="gstType"
                checked={form.gstType === 'INTER_STATE'}
                onChange={() => updateField('gstType', 'INTER_STATE')}
              />
              IGST (Inter-State)
            </label>
          </div>
        </div>

        <div className="panel totals-panel">
          <h2>Totals</h2>
          <div className="summary-box">
            <div className="summary-row">
              <span>Sub-total:</span>
              <strong>₹{formatCurrency(totals.subtotal)}</strong>
            </div>
            {form.gstType === 'INTRA_STATE' ? (
              <>
                <div className="summary-row">
                  <span>CGST @ 9%:</span>
                  <strong>₹{formatCurrency(totals.cgstAmount)}</strong>
                </div>
                <div className="summary-row">
                  <span>SGST @ 9%:</span>
                  <strong>₹{formatCurrency(totals.sgstAmount)}</strong>
                </div>
              </>
            ) : (
              <div className="summary-row">
                <span>IGST @ 18%:</span>
                <strong>₹{formatCurrency(totals.igstAmount)}</strong>
              </div>
            )}
            <div className="summary-row">
              <span>Round Off:</span>
              <strong>₹{formatCurrency(totals.roundOff)}</strong>
            </div>
            <div className="summary-row grand-row">
              <span>GRAND TOTAL:</span>
              <strong>₹{formatCurrency(totals.grandTotal)}</strong>
            </div>
          </div>
          <div className="amount-words-preview">Amount in Words: {amountWords}</div>
        </div>

        <div className="action-bar">
          <button type="button" className="secondary-button" onClick={() => navigate('/')}>
            Cancel
          </button>
          <button type="submit" className="primary-button">
            Save Invoice
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewInvoice;
