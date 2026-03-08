"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminTopbar } from "@/components/layout/admin-topbar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-muted/30">
      {sidebarOpen && <AdminSidebar />}
      <div className="min-w-0 flex-1">
        <AdminTopbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <div className="p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}
