function roundToTwo(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

export default function calculateTotals(items, gstType) {
  const subtotal = roundToTwo(
    (items || []).reduce((sum, item) => {
      const quantity = Number(item.quantity || 0);
      const rate = Number(item.rate || 0);
      return sum + quantity * rate;
    }, 0)
  );

  let cgstRate = 0;
  let cgstAmount = 0;
  let sgstRate = 0;
  let sgstAmount = 0;
  let igstRate = 0;
  let igstAmount = 0;

  if (gstType === 'INTRA_STATE') {
    cgstRate = 9;
    sgstRate = 9;
    cgstAmount = roundToTwo(subtotal * 0.09);
    sgstAmount = roundToTwo(subtotal * 0.09);
  } else {
    igstRate = 18;
    igstAmount = roundToTwo(subtotal * 0.18);
  }

  const rawTotal = roundToTwo(subtotal + cgstAmount + sgstAmount + igstAmount);
  const grandTotal = Math.round(rawTotal);
  const roundOff = roundToTwo(grandTotal - rawTotal);

  return {
    subtotal,
    cgstRate,
    cgstAmount,
    sgstRate,
    sgstAmount,
    igstRate,
    igstAmount,
    rawTotal,
    roundedTotal: grandTotal,
    roundOff,
    grandTotal,
  };
}
