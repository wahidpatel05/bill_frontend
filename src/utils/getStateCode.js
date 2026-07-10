export default function getStateCode(gstin) {
  return String(gstin || '').trim().slice(0, 2);
}
