import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import InvoiceList from './pages/InvoiceList';
import NewInvoice from './pages/NewInvoice';
import ViewInvoice from './pages/ViewInvoice';

function App() {
  return (
    <Routes>
      <Route path="/" element={<InvoiceList />} />
      <Route path="/new" element={<NewInvoice />} />
      <Route path="/invoice/:id" element={<ViewInvoice />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
