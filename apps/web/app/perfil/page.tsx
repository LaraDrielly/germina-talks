export default function PerfilPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-accent">Conta</p>
        <h2 className="text-3xl font-semibold text-primary">Perfil</h2>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white">
            AA
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-800">Ana Aluna</h3>
            <p className="text-sm text-slate-500">aluno@institutojef.org.br</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Papel</p>
          <p className="mt-2 text-lg font-semibold text-slate-800">Aluno</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Sala ativa</p>
          <p className="mt-2 text-lg font-semibold text-slate-800">3º ano Negócios 2026</p>
        </div>
      </div>
    </div>
  );
}
