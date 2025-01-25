'use client';

import { useSession } from 'next-auth/react';
import React from 'react';
import { ApiClient } from './index';

export function useAuthenticatedApiClient() {
  const { data: session } = useSession();

  const apiClientRef = React.useRef(new ApiClient());

  React.useEffect(() => {
    if (session?.user?.token) {
      apiClientRef.current.setAuthToken(session.user.token);
    }
  }, [session]);

  return apiClientRef.current;
}
