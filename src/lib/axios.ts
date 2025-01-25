import axios from 'axios';
const base_url = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
const api_base_url = base_url;
export const axiosInstance = axios.create({
  baseURL: `${api_base_url}/api`,
  headers: {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0'
  }
});

// Add an interceptor to handle logout redirects
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       signOut({ callbackUrl: '/' }); // Changed to redirect to homepage
//     }
//     return Promise.reject(error);
//   }
// );
