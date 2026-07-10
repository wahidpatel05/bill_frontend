const ones = [
  '',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen',
];

const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function twoDigitsToWords(number) {
  if (number === 0) {
    return '';
  }

  if (number < 20) {
    return ones[number];
  }

  const tenPart = tens[Math.floor(number / 10)];
  const unitPart = number % 10;
  return unitPart ? `${tenPart} ${ones[unitPart]}` : tenPart;
}

function threeDigitsToWords(number) {
  const hundredPart = Math.floor(number / 100);
  const remainder = number % 100;
  const parts = [];

  if (hundredPart) {
    parts.push(`${ones[hundredPart]} Hundred`);
  }

  if (remainder) {
    parts.push(twoDigitsToWords(remainder));
  }

  return parts.join(' ').trim();
}

export default function amountToWords(amount) {
  const value = Math.round(Number(amount || 0));

  if (value === 0) {
    return 'Zero Rupees Only';
  }

  const parts = [];
  const crores = Math.floor(value / 10000000);
  const lakhs = Math.floor((value % 10000000) / 100000);
  const thousands = Math.floor((value % 100000) / 1000);
  const hundredsAndBelow = value % 1000;

  if (crores) {
    parts.push(`${threeDigitsToWords(crores)} Crore`);
  }

  if (lakhs) {
    parts.push(`${threeDigitsToWords(lakhs)} Lakh`);
  }

  if (thousands) {
    parts.push(`${threeDigitsToWords(thousands)} Thousand`);
  }

  if (hundredsAndBelow) {
    parts.push(threeDigitsToWords(hundredsAndBelow));
  }

  return `${parts.join(' ').replace(/\s+/g, ' ').trim()} Rupees Only`;
}
