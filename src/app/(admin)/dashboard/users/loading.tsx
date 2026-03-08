export default function AdminUsersLoading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-32 animate-pulse rounded-lg bg-muted" />
      <div className="h-16 animate-pulse rounded-2xl border border-border bg-card" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="h-40 animate-pulse rounded-2xl border border-border bg-card" />
        ))}
      </div>
    </div>
  );
}

