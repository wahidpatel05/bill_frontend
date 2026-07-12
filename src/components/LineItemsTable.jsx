import React from 'react';

function LineItemsTable({ items, onChange, onAdd, onRemove, formatCurrency }) {
  const netQty = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  return (
    <div className="panel section-spacing">
      <div className="section-header">
        <h2>Line Items</h2>
        <button type="button" className="secondary-button" onClick={onAdd}>
          + Add Item
        </button>
      </div>

      <div className="table-wrap">
        {/* Desktop Table View */}
        <table className="items-table hidden md:table w-full">
          <thead>
            <tr>
              <th>Description</th>
              <th>HSN Code</th>
              <th>Quantity</th>
              <th>Bags <span style={{ fontWeight: 'normal', fontSize: '0.75em', opacity: 0.65 }}>(optional)</span></th>
              <th>Unit</th>
              <th>Rate</th>
              <th>Amount</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const amount = Number(item.quantity || 0) * Number(item.rate || 0);

              return (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(event) => onChange(index, 'description', event.target.value)}
                      placeholder="Plastic bags 8x12 Industry Packaging"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.hsnCode}
                      onChange={(event) => onChange(index, 'hsnCode', event.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={item.quantity}
                      onChange={(event) => onChange(index, 'quantity', event.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="—"
                      value={item.bags}
                      onChange={(event) => onChange(index, 'bags', event.target.value)}
                    />
                  </td>
                  <td>
                    <select value={item.unit} onChange={(event) => onChange(index, 'unit', event.target.value)}>
                      <option value="PCS">PCS</option>
                      <option value="KG">KG</option>
                      <option value="BOX">BOX</option>
                      <option value="ROLL">ROLL</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      step="0.0001"
                      value={item.rate}
                      onChange={(event) => onChange(index, 'rate', event.target.value)}
                    />
                  </td>
                  <td className="amount-cell">₹{formatCurrency(amount)}</td>
                  <td className="delete-cell">
                    {items.length > 1 && (
                      <button type="button" className="icon-button danger" onClick={() => onRemove(index)}>
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Mobile Cards View */}
        <div className="flex flex-col gap-6 md:hidden">
          {items.map((item, index) => {
            const amount = Number(item.quantity || 0) * Number(item.rate || 0);
            return (
              <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-semibold text-slate-700">Item {index + 1}</span>
                  {items.length > 1 && (
                    <button type="button" className="text-sm font-semibold text-red-600" onClick={() => onRemove(index)}>
                      Remove Item
                    </button>
                  )}
                </div>
                
                <div className="flex flex-col gap-3">
                  <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
                    Description
                    <input
                      type="text"
                      className="rounded-lg border border-slate-300 p-2"
                      value={item.description}
                      onChange={(event) => onChange(index, 'description', event.target.value)}
                      placeholder="Product details..."
                    />
                  </label>
                  
                  <div className="flex gap-3">
                    <label className="flex flex-1 flex-col gap-1 text-sm font-semibold text-slate-700">
                      HSN Code
                      <input
                        type="number"
                        className="rounded-lg border border-slate-300 p-2"
                        value={item.hsnCode}
                        onChange={(event) => onChange(index, 'hsnCode', event.target.value)}
                      />
                    </label>
                    <label className="flex flex-1 flex-col gap-1 text-sm font-semibold text-slate-700">
                      Quantity
                      <input
                        type="number"
                        min="0"
                        step="any"
                        className="rounded-lg border border-slate-300 p-2"
                        value={item.quantity}
                        onChange={(event) => onChange(index, 'quantity', event.target.value)}
                      />
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <label className="flex flex-1 flex-col gap-1 text-sm font-semibold text-slate-700">
                      Bags <span style={{ fontWeight: 'normal', fontSize: '0.75em', opacity: 0.65 }}>(optional)</span>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="—"
                        className="rounded-lg border border-slate-300 p-2"
                        value={item.bags}
                        onChange={(event) => onChange(index, 'bags', event.target.value)}
                      />
                    </label>
                    <label className="flex flex-1 flex-col gap-1 text-sm font-semibold text-slate-700">
                      Unit
                      <select 
                        className="rounded-lg border border-slate-300 p-2 bg-white"
                        value={item.unit} 
                        onChange={(event) => onChange(index, 'unit', event.target.value)}
                      >
                        <option value="PCS">PCS</option>
                        <option value="KG">KG</option>
                        <option value="BOX">BOX</option>
                        <option value="ROLL">ROLL</option>
                      </select>
                    </label>
                  </div>

                  <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
                    Rate (₹)
                    <input
                      type="number"
                      min="0"
                      step="0.0001"
                      className="rounded-lg border border-slate-300 p-2"
                      value={item.rate}
                      onChange={(event) => onChange(index, 'rate', event.target.value)}
                    />
                  </label>

                  <div className="mt-2 flex justify-between rounded-lg bg-amber-50 p-3">
                    <span className="font-semibold text-amber-800">Amount:</span>
                    <span className="font-bold text-amber-900">₹{formatCurrency(amount)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="totals-row mt-4">
        <div className="muted-text">Net Qty: {netQty}</div>
      </div>
    </div>
  );
}

export default LineItemsTable;
