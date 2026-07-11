import React, { useState, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import InvoiceList from './pages/InvoiceList';
import NewInvoice from './pages/NewInvoice';
import ViewInvoice from './pages/ViewInvoice';
import Parties from './pages/Parties';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const auth = localStorage.getItem('patel_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pin === '220671') {
      localStorage.setItem('patel_auth', 'true');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect PIN. Please try again.');
      setPin('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl border border-slate-100">
          <div className="mb-6 text-center">
            <h1 className="mb-2 text-2xl font-bold text-slate-800">Patel Industries</h1>
            <p className="text-sm text-slate-500">Enter PIN to access billing</p>
          </div>
          
          <div className="mb-6">
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••••"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-center text-2xl tracking-widest outline-none transition focus:border-amber-600 focus:bg-white focus:ring-4 focus:ring-amber-100"
              autoFocus
            />
            {error && <p className="mt-3 text-center text-sm font-medium text-red-500">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-amber-600 to-amber-800 py-3 font-bold text-white shadow-lg shadow-amber-600/30 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Unlock Access
          </button>
        </form>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<InvoiceList />} />
      <Route path="/new" element={<NewInvoice />} />
      <Route path="/parties" element={<Parties />} />
      <Route path="/invoice/:id" element={<ViewInvoice />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
