export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-3 py-6 md:px-6 md:py-8">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-6 rounded-3xl border border-slate-200 bg-white p-5">
          <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        </aside>

        <section className="space-y-6">
          <div className="space-y-3">
            <div className="h-12 w-64 animate-pulse rounded bg-slate-200" />
            <div className="h-6 w-72 animate-pulse rounded bg-slate-100" />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-3xl border border-slate-200 bg-white p-3">
                <div className="aspect-square animate-pulse rounded-3xl bg-slate-100" />
                <div className="mt-4 h-6 w-4/5 animate-pulse rounded bg-slate-200" />
                <div className="mt-3 h-8 w-1/3 animate-pulse rounded bg-slate-200" />
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10">
            <div className="mx-auto h-40 max-w-xl animate-pulse rounded-2xl bg-slate-100" />
          </div>
        </section>
      </div>
    </div>
  );
}
