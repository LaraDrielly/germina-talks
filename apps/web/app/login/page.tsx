import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">Instituto J&F</p>
          <h1 className="mt-3 text-3xl font-semibold text-primary">Germina Talks</h1>
          <p className="mt-2 text-sm text-slate-600">Entre com seu e-mail institucional para acessar a comunidade.</p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}
