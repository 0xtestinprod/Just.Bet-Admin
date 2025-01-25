import { getServerSession } from 'next-auth';
import { ApiClient } from '@/api';
import { authConfig } from '@/lib/next-auth.config';

export async function createServerApiClient() {
  const session = await getServerSession(authConfig);
  const apiClient = new ApiClient();

  if (session?.user?.token) {
    apiClient.setAuthToken(session.user.token);
  }

  return apiClient;
}
