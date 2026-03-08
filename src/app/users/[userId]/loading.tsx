export default function UserDetailLoading() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-3 py-6 md:px-6 md:py-8">
      <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        <div className="h-[420px] animate-pulse rounded-3xl border border-border bg-card" />
        <div className="space-y-6">
          <div className="h-[260px] animate-pulse rounded-3xl border border-border bg-card" />
          <div className="h-[220px] animate-pulse rounded-3xl border border-border bg-card" />
        </div>
      </div>
    </div>
  );
}

