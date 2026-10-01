import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verifyPassword } from '@germina-talks/shared/password';
import { prisma } from '@/lib/db/prisma';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
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
        const password = credentials?.password;

        if (!email || !password || password.length > 1024) {
          return null;
        }

        const isInstitutionalEmail =
          email.endsWith('@institutojef.org.br') || email.endsWith('@jef.org.br');

        if (!isInstitutionalEmail) return null;

        const account = await prisma.user.findUnique({ where: { email } });
        if (!account || !(await verifyPassword(password, account.passwordHash))) return null;

        return {
          id: account.id,
          name: account.name,
          email: account.email,
          role: account.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.sub = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string | undefined;
        session.user.id = token.sub;
      }

      return session;
    },
  },
};
