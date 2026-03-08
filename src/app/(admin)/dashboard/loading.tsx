export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-56 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-80 animate-pulse rounded bg-muted" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="h-40 animate-pulse rounded-3xl border border-border bg-card" />
        ))}
      </div>
      <div className="h-[420px] animate-pulse rounded-3xl border border-border bg-card" />
    </div>
  );
}

