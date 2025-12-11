import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error('Missing credentials');
          return null;
        }

        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
          const response = await axios.post(
            `${apiUrl}/login`,
            {
              email: credentials.email,
              password: credentials.password,
            }
          );

          if (response.data.user && response.data.token) {
            return {
              id: response.data.user.id.toString(),
              email: response.data.user.email,
              name: response.data.user.name,
              token: response.data.token,
              is_moderator: response.data.user.is_moderator || false,
            };
          }

          console.error('No user or token in response');
          return null;
        } catch (error: any) {
          console.error('Login error:', error);
          console.error('Error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            url: error.config?.url,
          });
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.token = user.token;
        token.is_moderator = user.is_moderator;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.token = token.token as string;
        session.user.is_moderator = token.is_moderator as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };

