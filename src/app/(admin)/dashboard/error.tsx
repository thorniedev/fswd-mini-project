"use client";

import { Button } from "@/components/ui/button";

export default function AdminDashboardError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-8 text-center">
      <h2 className="text-2xl font-bold text-foreground">Dashboard data failed to load</h2>
      <p className="text-sm text-muted-foreground">
        Please retry loading this admin page.
      </p>
      <Button onClick={reset}>Retry</Button>
    </div>
  );
}

