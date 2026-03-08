"use client";

import { Button } from "@/components/ui/button";

export default function AdminProductsError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-8 text-center">
      <h2 className="text-xl font-bold text-foreground">Failed to load admin products</h2>
      <p className="text-sm text-muted-foreground">Please retry.</p>
      <Button onClick={reset}>Retry</Button>
    </div>
  );
}

