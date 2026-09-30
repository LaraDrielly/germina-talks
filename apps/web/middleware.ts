import withAuth from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: ['/((?!api/auth|api/v1(?:/|$)|_next/static|_next/image|favicon.ico|login).*)'],
};
