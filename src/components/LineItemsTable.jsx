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
        <table className="items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>HSN Code</th>
              <th>Quantity</th>
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
                      step="1"
                      value={item.quantity}
                      onChange={(event) => onChange(index, 'quantity', event.target.value)}
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
      </div>

      <div className="totals-row">
        <div className="muted-text">Net Qty: {netQty}</div>
      </div>
    </div>
  );
}

export default LineItemsTable;
