"use client";

import { Button } from "@/components/ui/button";

export default function UserDetailError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[40vh] w-full max-w-3xl flex-col items-center justify-center gap-3 px-4 text-center">
      <h2 className="text-2xl font-bold text-foreground">Failed to load user profile</h2>
      <p className="text-sm text-muted-foreground">Please retry.</p>
      <Button onClick={reset}>Retry</Button>
    </div>
  );
}

