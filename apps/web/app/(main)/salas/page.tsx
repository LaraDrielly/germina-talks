export default function SalasPage() {
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-accent">Organização</p>
        <h2 className="text-3xl font-semibold text-primary">Minhas salas</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { name: '3º ano Negócios 2026', color: 'bg-primary' },
          { name: '3º ano Tecnologia 2026', color: 'bg-slate-900' },
          { name: '3º ano Fábrica 2026', color: 'bg-cyan-700' },
        ].map((room) => (
          <div key={room.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className={`mb-4 h-2 w-16 rounded-full ${room.color}`} />
            <h3 className="font-semibold text-slate-800">{room.name}</h3>
            <p className="mt-2 text-sm text-slate-500">12 membros · 3 publicações hoje</p>
          </div>
        ))}
      </div>
    </div>
  );
}
