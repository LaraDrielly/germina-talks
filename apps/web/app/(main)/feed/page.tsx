export default function FeedPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-accent">Comunidad e</p>
          <h2 className="text-3xl font-semibold text-primary">Feed</h2>
        </div>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white">Nova publicação</button>
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <article key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800">Ana Aluna</h3>
                <p className="text-sm text-slate-500">Aluno · há 20 min</p>
              </div>
              <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                Toda a escola
              </span>
            </div>
            <p className="text-slate-700">
              {item === 1 && 'Hoje teremos uma sessão de apresentação do projeto do Instituto J&F. Quem puder participar, venha compartilhar ideias.'}
              {item === 2 && 'Confira o calendário do próximo evento da comunidade escolar e participe com a turma.'}
              {item === 3 && 'Compartilhando uma memória da semana. A jornada de aprendizagem ficou ainda mais rica com a colaboração de todos.'}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
