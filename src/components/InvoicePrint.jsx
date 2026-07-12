import React from 'react';

function formatDateForPrint(dateValue) {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatPrintAmount(value) {
  return Number(value || 0).toFixed(2);
}

function CopyBlock({ invoice, settings, currentCopy }) {
  const copyRows = [
    { label: 'Original - Buyer Copy', key: 'Original' },
    { label: 'Duplicate - Transporter Copy', key: 'Duplicate' },
    { label: 'Triplicate - Supplier Copy', key: 'Triplicate' },
  ];

  const totalQuantity = invoice?.items?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || 0;
  const isInterState = Boolean(invoice?.igstAmount && Number(invoice.igstAmount) > 0);
  const hasBags = invoice?.items?.some((item) => item.bags !== null && item.bags !== undefined && item.bags !== '' && Number(item.bags) > 0);
  const addressFallback =
    'Mauli Bharat Udyog Nagar Industrial Estate, 1st Floor, Gala No. 51, Babasaheb Kotkar Road, Behind Sainath Industrial Estate, Goregaon (East), Mumbai - 400 063';
  const branchFallback = 'No. 6, Aasharam Waghral Pada, Mangurni Gaon, Rajawal Boidapada, Sativali, Vasai (E), Dist. Palghar';

  return (
    <section className="mx-auto bg-white text-black w-[210mm] h-[297mm] max-h-[297mm] overflow-hidden box-border p-[6mm] flex flex-col justify-between page-break-after-always print:m-0 print:h-[297mm] print:max-h-[297mm]">
      <div className="border border-black flex flex-col flex-1 h-full justify-between">
        
        {/* TOP HEADER */}
        <div>
          <div className="flex items-start border-b-2 border-black px-3 py-2">
            <div className="flex-1 text-center">
              <div className="mb-1 text-[11px] font-bold tracking-[0.5px]">SUBJECT TO MUMBAI JURISDICTION</div>
              <div className="text-[32px] font-bold leading-none text-[#d32f2f] tracking-wide font-serif">PATEL INDUSTRIES</div>
              <div className="mt-1.5 text-[12px] font-bold">M.: {settings?.mobile1 || '9987567861'} / {settings?.mobile2 || '9819282701'}</div>
            </div>
            <div className="w-46.25 text-left text-[11px] leading-tight pt-1">
              <div className="space-y-1">
                {copyRows.map((row) => (
                  <div key={row.key} className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="text-[14px] leading-none font-sans">{currentCopy === row.key ? '☑' : '☐'}</span>
                    <span className={currentCopy === row.key ? 'font-bold' : ''}>{row.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MANUFACTURERS DETAILS */}
          <div className="border-b-2 border-black px-2 py-1 text-center text-[10.5px] font-bold leading-tight">
            <div className="uppercase tracking-[0.2px] mb-0.5">MANUFACTURERS OF: PLASTIC BAGS, TUBING, GRAVURE PRINTED, FLEXO PRINTED</div>
            <div className="text-[10px] font-medium text-gray-800">
              Regd. Office: {settings?.address || addressFallback} | E-mail: {settings?.email || 'patelindustries@gmail.com'}
            </div>
            <div className="text-[10px] font-medium text-gray-800">Branch: {settings?.branchAddress || branchFallback}</div>
          </div>

          {/* CUSTOMER & INVOICE META */}
          <div className="flex min-h-27.5 border-b-2 border-black">
            <div className="flex flex-1 flex-col justify-between border-r-2 border-black p-2">
              <div>
                <div className="mb-0.5 text-[11px] italic">Sold To, Messrs:</div>
                <div className="mb-1 text-[15px] font-bold tracking-wide">{invoice?.buyerName || 'Wholesale Dock LLP'}</div>
                <div className="mb-2 whitespace-pre-line text-[11px] leading-[1.3] font-medium">
                  {invoice?.buyerAddress || 'Plot No. 3, Green Park 2, Behind Mathura Hotel,\nKaman Bhivandi Road, Vasai (E)'}
                </div>
              </div>
              <div className="text-[11px]">
                <div><strong>Party's GSTIN No.:</strong> <span className="font-semibold">{invoice?.buyerGstin || '27AACFW4913C1ZE'}</span></div>
                <div><strong>State Code:</strong> <span className="font-semibold">{invoice?.buyerStateCode || '27'}</span></div>
              </div>
            </div>

            <div className="flex w-60 flex-col items-end justify-start gap-3 p-2">
              <div className="border-2 border-black px-4 py-1 text-center text-[14px] font-bold tracking-[0.5px] bg-white">
                TAX INVOICE
              </div>
              <div className="w-full flex flex-col gap-1 text-[12px] font-medium pl-4">
                <div><strong>Invoice No.:</strong> {String(invoice?.invoiceNumber || '072').padStart(3, '0')}</div>
                <div><strong>Date:</strong> {invoice?.invoiceDate ? formatDateForPrint(invoice.invoiceDate) : '12/06/2026'}</div>
              </div>
            </div>
          </div>

          {/* ITEM TABLES */}
          <table className="w-full border-collapse text-left text-[11.5px]">
            <thead>
              <tr className="border-b-2 border-black">
                <th className={`${hasBags ? 'w-[44%]' : 'w-[52%]'} border-r-2 border-black px-2 py-1.5 text-center font-bold`}>DESCRIPTION</th>
                <th className={`${hasBags ? 'w-[10%]' : 'w-[12%]'} border-r-2 border-black px-2 py-1.5 text-center font-bold`}>HSN/SAC Code</th>
                <th className={`${hasBags ? 'w-[10%]' : 'w-[12%]'} border-r-2 border-black px-2 py-1.5 text-center font-bold`}>Quantity</th>
                {hasBags && (
                  <th className="w-[9%] border-r-2 border-black px-2 py-1.5 text-center font-bold">Bags</th>
                )}
                <th className={`${hasBags ? 'w-[12%]' : 'w-[11%]'} border-r-2 border-black px-2 py-1.5 text-center font-bold leading-tight`}>
                  RATE<br /><span className="text-[10px] font-normal">Rs. P.</span>
                </th>
                <th className={`${hasBags ? 'w-[15%]' : 'w-[13%]'} px-2 py-1.5 text-center font-bold leading-tight`}>
                  AMOUNT<br /><span className="text-[10px] font-normal">Rs. P.</span>
                </th>
              </tr>
            </thead>
            <tbody>
                {(invoice?.items || [
                { description: 'Vibrator pad 8x12 + 2 FebTep + 50mm pal', hsnCode: '3923', quantity: 25000, bags: null, unit: 'PCS', rate: 0.95, amount: 23750.0 },
                { description: 'Storage box 7½ x 11 + 2 FebTep', hsnCode: '3923', quantity: 22600, bags: null, unit: 'PCS', rate: 0.74, amount: 16724.0 },
              ]).map((item, index) => (
                <tr key={index} className="h-8">
                  <td className="border-r-2 border-black px-2 py-1 align-middle font-medium">{item.description}</td>
                  <td className="border-r-2 border-black px-2 py-1 align-middle text-center">{item.hsnCode}</td>
                  <td className="border-r-2 border-black px-2 py-1 align-middle text-right font-bold pr-4">
                    {item.quantity} {item.unit || 'PCS'}
                  </td>
                  {hasBags && (
                    <td className="border-r-2 border-black px-2 py-1 align-middle text-right font-bold pr-3">
                      {item.bags != null && item.bags !== '' && Number(item.bags) > 0 ? Number(item.bags) : '—'}
                    </td>
                  )}
                  <td className="border-r-2 border-black px-2 py-1 align-middle text-right pr-3">{formatPrintAmount(item.rate)}</td>
                  <td className="px-2 py-1 align-middle text-right font-bold pr-3">{formatPrintAmount(item.amount)}</td>
                </tr>
              ))}

              {[...Array(Math.max(0, 7 - (invoice?.items?.length || 2)))].map((_, index) => (
                <tr key={`empty-${index}`} className="h-8">
                  <td className="border-r-2 border-black" />
                  <td className="border-r-2 border-black" />
                  <td className="border-r-2 border-black" />
                  {hasBags && <td className="border-r-2 border-black" />}
                  <td className="border-r-2 border-black" />
                  <td />
                </tr>
              ))}

              {/* NET WEIGHTS / PIECES SUM */}
              <tr className="h-7.5 border-y-2 border-black bg-white font-bold">
                <td className="border-r-2 border-black px-2 text-right align-middle">Net pcs/kgs</td>
                <td className="border-r-2 border-black" />
                <td className="border-r-2 border-black px-2 text-center align-middle">{totalQuantity || '47600'}</td>
                <td className="border-r-2 border-black" />
                <td />
              </tr>
            </tbody>
          </table>
        </div>

        {/* BOTTOM SECTION (FINANCIALS & FOOTER) */}
        <div className="mt-auto">
          {/* CALCULATIONS ROW (Added upper border-t-2 to form a continuous line spanning all columns above "Total") */}
          <div className="flex border-t-2 border-black">
            <div className="flex-1 border-r-2 border-black bg-white" />
            <div className="flex w-60 flex-col">
              <div className="flex border-b border-black px-2 py-1 text-[11.5px]">
                <div className="flex-1 pr-3 text-right font-bold">Total</div>
                <div className="w-21.25 text-right font-bold pr-1">{formatPrintAmount(invoice?.subtotal || 40474.0)}</div>
              </div>

              {!isInterState ? (
                <>
                  <div className="flex border-b border-black px-2 py-1 text-[11.5px]">
                    <div className="flex-1 pr-3 text-right font-bold">CGST {invoice?.cgstRate || 9}%</div>
                    <div className="w-21.25 text-right pr-1">{formatPrintAmount(invoice?.cgstAmount || 3642.66)}</div>
                  </div>
                  <div className="flex border-b border-black px-2 py-1 text-[11.5px]">
                    <div className="flex-1 pr-3 text-right font-bold">SGST {invoice?.sgstRate || 9}%</div>
                    <div className="w-21.25 text-right pr-1">{formatPrintAmount(invoice?.sgstAmount || 3642.66)}</div>
                  </div>
                </>
              ) : (
                <div className="flex border-b border-black px-2 py-1 text-[11.5px]">
                  <div className="flex-1 pr-3 text-right font-bold">IGST {invoice?.igstRate || 18}%</div>
                  <div className="w-21.25 text-right pr-1">{formatPrintAmount(invoice?.igstAmount)}</div>
                </div>
              )}

              <div className="flex border-b border-black px-2 py-1 text-[11.5px]">
                <div className="flex-1 pr-3 text-right font-bold">Round off</div>
                <div className="w-21.25 text-right pr-1">{Number(invoice?.roundOff || -0.32).toFixed(2)}</div>
              </div>

              <div className="flex bg-[#fafafa] px-2 py-1.5 text-[12px] font-bold border-t border-black">
                <div className="flex-1 pr-3 text-right tracking-wide">GRAND TOTAL</div>
                <div className="w-21.25 text-right text-[13px] pr-1 font-extrabold">{formatPrintAmount(invoice?.grandTotal || 47759.0)}</div>
              </div>
            </div>
          </div>

          {/* WORDS ROW */}
          <div className="border-b-2 border-black px-2 py-1.5 text-[11.5px] font-bold">
            Total Invoice Amount in Words:{' '}
            <span className="font-normal italic ml-1">{invoice?.amountInWords || 'Forty Seven Thousand Seven Hundred Fifty Nine Rupees Only'}</span>
          </div>

          {/* BANKING & SIGNATURE PART */}
          <div className="flex min-h-28.75">
            <div className="flex flex-1 flex-col justify-between border-r-2 border-black p-2 text-[10.5px] leading-[1.45]">
              <div>
                <div><strong>GSTIN No.:</strong> {settings?.gstin || '27AAAFP1402F1ZV'}</div>
                <div><strong>UDYOG AADHAAR NO.:</strong> {settings?.udyogAadhar || 'MH17A0062572'}</div>
                <div className="mt-1 font-medium">
                  <strong>Bank:</strong> {settings?.bankName || 'CANARA BANK'}, <strong>Branch:</strong> {settings?.bankBranch || 'Goregaon SME'}
                  <br />
                  <strong>IFSC Code:</strong> {settings?.ifsc || 'CNRB0015017'}, <strong>Account No.:</strong> {settings?.accountNumber || '50171400000575'}
                </div>
              </div>
              <div className="mt-1 font-bold italic text-[9.5px]">Interest @ 12% per annum will be charged if payment not received within 30 days.</div>
            </div>

            <div className="flex w-60 flex-col justify-between p-2 text-[10.5px]">
              <div>
                <div className="font-bold text-left mb-0.5">E. &amp; O. E.</div>
                <div className="text-[9.5px] italic leading-tight text-gray-600">Certified that the particulars given above are true and correct.</div>
              </div>

              <div className="text-right mt-auto">
                <div className="pr-1 text-[10.5px] font-bold tracking-wide">For PATEL INDUSTRIES</div>
                <div className="h-10" />
                <div className="border-t border-dashed border-gray-400 pt-1 text-center text-[11px] font-medium w-[90%] mx-auto">
                  Authorised Signatory
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

function InvoicePrint({ invoice, settings }) {
  const copies = ['Original', 'Duplicate', 'Triplicate'];

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body, html {
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            size: A4 portrait;
            margin: 0 !important;
          }
          .page-break-after-always {
            page-break-after: always !important;
            break-after: page !important;
          }
        }
      `}} />
      
      <div className="bg-gray-200 py-6 print:bg-white print:py-0 flex flex-col gap-4 print:gap-0">
        {copies.map((copyName) => (
          <CopyBlock 
            key={copyName} 
            invoice={invoice} 
            settings={settings} 
            currentCopy={copyName} 
          />
        ))}
      </div>
    </>
  );
}

export default InvoicePrint;