/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import CredentialsProvider from 'next-auth/providers/credentials';

import { axiosInstance } from '@/lib/axios';

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',

      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'test@example.com'
        },
        password: { label: 'Password', type: 'password' }
      },

      async authorize(credentials, _req) {
        try {
          const res = await axiosInstance.post(
            `/auth/email/login`,
            {
              email: credentials?.email,
              password: credentials?.password
            },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
          console.log('res', res);
          return res.data;
        } catch (err) {
          const error = err as AxiosError;
          if (error.response) {
            throw new Error(error.response.statusText);
          } else {
            throw new Error(error.message);
          }
        }
      }
    })
  ],

  callbacks: {
    async jwt({ user, token, trigger, session }: any) {
      if (trigger === 'update' && session) {
        return {
          ...token,
          ...{ userData: { ...token.userData, ...session.user } }
        };
      }
      if (user) {
        // new login / register
        const allUserData = user as any;
        const tokenData = {
          expiresAt: allUserData.tokenExpires,
          token: allUserData.token,
          refreshToken: allUserData.refreshToken,
          userData: allUserData.user
        };
        return tokenData;
      }
      // existing session
      if (Date.now() > Number(token.expiresAt)) {
        //session has expired
        const response = await axiosInstance.post(
          `/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token.refreshToken}`
            }
          }
        );
        console.log('refresh response', response);
        const newTokenData = {
          expiresAt: response.data.tokenExpires,
          token: response.data.token,
          refreshToken: response.data.refreshToken
        };
        return { ...token, ...newTokenData };
      }
      // session still valid
      return token;
    },
    async session({ session, token }: any) {
      session.user = { ...(token.userData as any), token: token.token } as any;
      const expiresAt = Number(token.expiresAt);
      const expiresAtDate = new Date(expiresAt);
      if (new Date() >= expiresAtDate) {
        return null;
      }
      session.expires = expiresAtDate.toString();
      return session;
    }
  },
  pages: {
    signIn: '/'
  }
};
