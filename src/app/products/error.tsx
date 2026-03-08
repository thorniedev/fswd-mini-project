"use client";

import { Button } from "@/components/ui/button";

export default function ProductsError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[40vh] w-full max-w-3xl flex-col items-center justify-center gap-3 px-4 text-center">
      <h2 className="text-2xl font-bold text-foreground">Failed to load products</h2>
      <p className="text-sm text-muted-foreground">
        Something went wrong while fetching products. Please try again.
      </p>
      <Button onClick={reset}>Retry</Button>
    </div>
  );
}

