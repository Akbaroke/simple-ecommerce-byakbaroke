import { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import { JWT } from 'next-auth/jwt';

// Fungsi untuk memperbarui token
const updateToken = async (token: JWT) => {
  const res = await axios.get(
    process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/me',
    {
      headers: {
        Authorization: `Bearer ${token.backendTokens.token}`,
      },
    }
  );
  return res.data;
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;
        const { email, password } = credentials;
        const res = await axios.post(
          process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/login',
          {
            email,
            password,
          }
        );

        if (res.status === 401) {
          return null;
        }
        const user = res.data;
        return user;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return { ...token, ...user };
      }

      console.log(
        `${new Date().getMinutes()}:${new Date().getSeconds()} - refresh page`
      );

      if (token.backendTokens.expiresIn < new Date().getTime()) {
        return {};
      }

      try {
        const updatedToken = await updateToken(token);
        return updatedToken;
      } catch (error) {
        console.error('Error updating token:', error);
        return {};
      }
    },

    async session({ token, session }) {
      session.user = token.user;
      session.backendTokens = token.backendTokens;

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
