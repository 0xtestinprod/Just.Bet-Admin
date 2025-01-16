import axios from 'axios';

const API_URL = 'http://your-api-url.com'; // Replace with your actual API URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const login = (email: string, password: string) =>
  api.post('/auth/email/login', { email, password });

export const register = (userData: any) =>
  api.post('/auth/email/register', userData);

export const confirmEmail = (hash: string) =>
  api.post('/auth/email/confirm', { hash });

export const forgotPassword = (email: string) =>
  api.post('/auth/forgot/password', { email });

export const resetPassword = (
  hash: string,
  password: string,
  confirmPassword: string
) => api.post('/auth/reset/password', { hash, password, confirmPassword });

export const logout = () => api.post('/auth/logout');

export default api;
