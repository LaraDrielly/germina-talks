import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const demoPassword = process.env.NEXTAUTH_DEMO_PASSWORD ?? 'germina123';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Instituto J&F',
      credentials: {
        email: { label: 'E-mail institucional', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password ?? '';

        if (!email || !password) {
          return null;
        }

        const isInstitutionalEmail =
          email.endsWith('@institutojef.org.br') || email.endsWith('@jef.org.br');

        if (!isInstitutionalEmail || password !== demoPassword) {
          return null;
        }

        const role = email.includes('prof')
          ? 'teacher'
          : email.includes('coord') || email.includes('admin')
            ? 'admin'
            : 'student';

        return {
          id: email,
          name: email.split('@')[0].replace(/[._]/g, ' '),
          email,
          role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string | undefined;
      }

      return session;
    },
  },
};
