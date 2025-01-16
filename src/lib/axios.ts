import axios from 'axios';
const base_url = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
const api_base_url = base_url;
export const axiosInstance = axios.create({
  baseURL: `${api_base_url}/api`,
  headers: {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0'
  }
});
