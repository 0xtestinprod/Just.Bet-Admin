import {
  type LoginDto,
  type RegisterDto,
  type ResetPasswordDto,
  type AuthResetPasswordDto,
  type LoginResponseType,
  type AuthConfirmEmailDto,
  useLogin as useApiLogin,
  useRegister as useApiRegister,
  useConfirmEmail as useApiConfirmEmail,
  useForgotPassword as useApiForgotPassword,
  useResetPassword as useApiResetPassword,
  useResetAuthUserPassword as useApiResetAuthUserPassword,
  useLogout as useApiLogout,
  useDeleteAccount as useApiDeleteAccount
} from '@/api';

export type {
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  AuthResetPasswordDto,
  LoginResponseType,
  AuthConfirmEmailDto
};

export const useLogin = useApiLogin;
export const useRegister = useApiRegister;
export const useConfirmEmail = useApiConfirmEmail;
export const useForgotPassword = useApiForgotPassword;
export const useResetPassword = useApiResetPassword;
export const useResetAuthUserPassword = useApiResetAuthUserPassword;
export const useLogout = useApiLogout;
export const useDeleteAccount = useApiDeleteAccount;
