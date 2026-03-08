"use client";

import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { AnimatedList } from "@/components/ui/animated-list";
import { useNotificationStore } from "@/store";
import { cn } from "@/lib/utils";

export function NotificationPopups() {
  const { notifications, removeNotification } = useNotificationStore();

  if (notifications.length === 0) return null;

  return (
    <div className="pointer-events-none fixed right-4 top-20 z-[100] w-[min(92vw,360px)]">
      <AnimatedList className="space-y-2" delay={1800}>
        {notifications.map((item) => {
          const Icon =
            item.type === "success"
              ? CheckCircle2
              : item.type === "error"
                ? XCircle
                : Info;
          return (
            <div
              key={item.id}
              className={cn(
                "pointer-events-auto rounded-xl border bg-card p-3 shadow-lg",
                item.type === "success" && "border-emerald-200",
                item.type === "error" && "border-red-200",
                item.type === "info" && "border-blue-200"
              )}
            >
              <div className="flex items-start gap-2">
                <Icon
                  className={cn(
                    "mt-0.5 h-4 w-4 shrink-0",
                    item.type === "success" && "text-emerald-600",
                    item.type === "error" && "text-red-600",
                    item.type === "info" && "text-blue-600"
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  {item.message ? (
                    <p className="mt-0.5 text-xs text-muted-foreground">{item.message}</p>
                  ) : null}
                </div>
                <button
                  onClick={() => removeNotification(item.id)}
                  className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </AnimatedList>
    </div>
  );
}
