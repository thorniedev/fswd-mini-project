"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  ChevronRight,
  Settings,
  Shapes,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AppLogo } from "@/components/common/app-logo";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/products", icon: Package, label: "Products" },
  { href: "/dashboard/users", icon: Users, label: "Users" },
  { href: "/dashboard/products", icon: Shapes, label: "Categories" },
  { href: "/dashboard", icon: Settings, label: "Settings" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card md:flex">
      <div className="p-5 border-b border-border">
        <AppLogo width={170} height={52} />
      </div>
      <nav className="flex-1 p-4 space-y-1.5">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-2xl text-base font-medium transition-colors",
                isActive
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
              {isActive && <ChevronRight className="h-3.5 w-3.5 ml-auto" />}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-4">
        <Link
          href="/"
          className="block rounded-2xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          Back to Home
        </Link>
      </div>
    </aside>
  );
}
