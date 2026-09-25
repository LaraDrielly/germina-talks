export default function MuralPage() {
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-accent">Informações</p>
        <h2 className="text-3xl font-semibold text-primary">Mural</h2>
      </div>

      <div className="space-y-4">
        <article className="rounded-2xl border-l-4 border-accent bg-slate-50 p-5">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Atenção: prazo de inscrição</h3>
            <span className="text-xs font-medium text-slate-500">Expira em 2 dias</span>
          </div>
          <p className="text-slate-700">
            As inscrições para a atividade de extensão estão abertas até sexta-feira. A coordenação recomenda que os alunos confirmem participação o quanto antes.
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="font-semibold text-slate-800">Atividade da semana</h3>
          <p className="mt-2 text-slate-700">
            Reunião de orientação para projetos interdisciplinares no auditório principal às 15h.
          </p>
        </article>
      </div>
    </div>
  );
}
