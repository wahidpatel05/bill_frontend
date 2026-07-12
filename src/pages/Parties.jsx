import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../utils/api';

function Parties() {
  const navigate = useNavigate();
  const [parties, setParties] = useState([]);
  const [form, setForm] = useState({
    name: '',
    gstin: '',
    address: '',
    mobile: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadParties = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/parties`);
      setParties(response.data.parties || []);
    } catch (err) {
      setError('Failed to load parties.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParties();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'gstin' ? value.toUpperCase() : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name || !form.gstin || !form.address) {
      setError('Name, GSTIN, and Address are required.');
      return;
    }

    if (form.gstin.length !== 15) {
      setError('GSTIN must be exactly 15 characters.');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/parties`, form);
      if (response.status === 201) {
        setSuccess('Party added successfully!');
      } else {
        setSuccess('Party updated successfully!');
      }
      setForm({ name: '', gstin: '', address: '', mobile: '' });
      loadParties();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save party.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this party?')) return;
    try {
      await axios.delete(`${API_URL}/parties/${id}`);
      setSuccess('Party deleted successfully!');
      loadParties();
    } catch (err) {
      setError('Failed to delete party.');
    }
  };

  return (
    <div className="app-shell">
      <header className="page-header flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <p className="eyebrow">Patel Industries</p>
          <h1 className="text-3xl font-bold text-slate-800">Manage Parties</h1>
          <p className="hero-copy text-sm text-slate-500">Add or manage your client directory for quick billing auto-fill.</p>
        </div>
        <button type="button" className="secondary-button self-start sm:self-auto" onClick={() => navigate('/')}>
          ← Back to Dashboard
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Party Form */}
        <div className="panel lg:col-span-1 h-fit">
          <h2 className="text-lg font-semibold mb-4 text-slate-800">Add New Party</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
              Party Name
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Patel Traders"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-amber-600 focus:ring-4 focus:ring-amber-100"
                required
              />
            </label>

            <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
              GSTIN
              <input
                type="text"
                name="gstin"
                maxLength={15}
                value={form.gstin}
                onChange={handleChange}
                placeholder="15-digit GSTIN number"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-amber-600 focus:ring-4 focus:ring-amber-100"
                required
              />
            </label>

            {/* <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
              Mobile Number
              <input
                type="text"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-amber-600 focus:ring-4 focus:ring-amber-100"
              />
            </label> */}

            <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
              Address
              <textarea
                name="address"
                rows={3}
                value={form.address}
                onChange={handleChange}
                placeholder="Full billing address"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-amber-600 focus:ring-4 focus:ring-amber-100"
                required
              />
            </label>

            {error && <div className="text-red-600 bg-red-50 border border-red-200 text-xs font-semibold p-3 rounded-lg">{error}</div>}
            {success && <div className="text-emerald-700 bg-emerald-50 border border-emerald-200 text-xs font-semibold p-3 rounded-lg">{success}</div>}

            <button type="submit" className="primary-button w-full mt-2">
              Save Party
            </button>
          </form>
        </div>

        {/* Parties List */}
        <div className="panel lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4 text-slate-800">Saved Parties Directory</h2>

          {loading ? (
            <div className="empty-state text-slate-500 py-10">Loading parties...</div>
          ) : parties.length === 0 ? (
            <div className="empty-state text-slate-500 py-10">No parties added yet. Use the form to add a party.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {parties.map((party) => (
                <div key={party._id} className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-amber-500 transition duration-150">
                  <div>
                    <div className="flex items-start justify-between border-b border-slate-100 pb-2 mb-3">
                      <div>
                        <h3 className="font-bold text-slate-800 text-base leading-tight">{party.name}</h3>
                        {party.mobile && <span className="text-xs text-slate-500 font-medium">📞 {party.mobile}</span>}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDelete(party._id)}
                        className="text-xs font-semibold text-red-600 hover:text-red-800 transition"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div>
                        <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">GSTIN</span>
                        <span className="text-sm font-semibold text-slate-800">{party.gstin}</span>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Address</span>
                        <p className="text-sm text-slate-600 leading-snug">{party.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Parties;
