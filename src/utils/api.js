const DEFAULT_API_URL = 'http://localhost:5000/api';

export function getApiUrl() {
  return (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(/\/$/, '');
}

export default getApiUrl();