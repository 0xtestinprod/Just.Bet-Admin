import { axiosInstance } from '@/lib/axios';
import type { User } from 'next-auth';

interface LoginDto {
  email: string;
  password: string;
}

interface RegisterDto {
  email: string;
  password: string;
  confirmPassword: string;
}

interface ResetPasswordDto {
  hash: string;
  password: string;
  confirmPassword: string;
}

export const authService = {
  async login(data: LoginDto): Promise<User> {
    const response = await axiosInstance.post('/auth/email/login', data);
    return response.data;
  },

  async register(data: RegisterDto) {
    await axiosInstance.post('/auth/email/register', data);
  },

  async confirmEmail(hash: string) {
    await axiosInstance.post('/auth/email/confirm', { hash });
  },

  async forgotPassword(email: string) {
    await axiosInstance.post('/auth/forgot/password', { email });
  },

  async resetPassword(data: ResetPasswordDto) {
    await axiosInstance.post('/auth/reset/password', data);
  },

  async resetAuthUserPassword(password: string, confirmPassword: string) {
    await axiosInstance.post('/auth/reset/user/password', {
      password,
      confirmPassword
    });
  },

  async logout() {
    await axiosInstance.post('/auth/logout');
  },

  async deleteAccount() {
    await axiosInstance.delete('/auth/me');
  }
};
