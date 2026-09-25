export default function FotosPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-accent">Galeria</p>
          <h2 className="text-3xl font-semibold text-primary">Fotos</h2>
        </div>
        <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
          Enviar fotos
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            <div className="flex h-40 items-center justify-center bg-gradient-to-br from-primary/20 via-accent/20 to-slate-200 text-lg font-semibold text-primary">
              Álbum {item}
            </div>
            <div className="p-4">
              <p className="font-medium text-slate-800">Evento institucional {item}</p>
              <p className="mt-1 text-sm text-slate-500">12 fotos · 2 semanas atrás</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
