"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { useCartStore, useAuthStore } from "@/store";
import { cn } from "@/lib/utils";
import { LoginModal } from "@/components/shared/login-modal";
import { AppLogo } from "@/components/common/app-logo";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/#categories", label: "Categories" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const { count } = useCartStore();
  const cartCount = count();
  const { isAuthenticated, user, logout } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === "admin";
  const canUseCart = !isAuthenticated || user?.role !== "admin";

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/session", { method: "DELETE" });
    } catch {
      // noop
    }
    logout();
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-18 items-center justify-between">
            {/* Logo */}
            <AppLogo href={isAdmin ? "/dashboard" : "/"} width={130} height={40} />

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1 rounded-full border border-border bg-muted/60 p-1">
              {(isAdmin ? [{ href: "/dashboard", label: "Dashboard" }] : navLinks).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-semibold transition-colors",
                    (pathname === link.href || (link.href.startsWith("/#") && pathname === "/"))
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-muted-foreground hover:text-indigo-700 hover:bg-background"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <AnimatedThemeToggler
                className="hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-background text-muted-foreground transition-colors hover:bg-muted"
                duration={700}
                aria-label="Toggle theme"
              />

              {/* Cart */}
              {canUseCart && (
                <Link
                  href="/cart"
                  className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-muted"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Auth */}
              {isAuthenticated && user ? (
                <div className="relative group hidden md:block">
                  <button className="flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-2 text-sm font-semibold text-foreground hover:bg-background transition-colors">
                    <User className="h-4 w-4" />
                    <span>{user.name.split(" ")[0]}</span>
                  </button>
                  <div className="absolute right-0 mt-1 w-48 rounded-xl bg-popover shadow-lg border border-border py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link href={`/users/${user.id}`} className="block px-4 py-2 text-sm text-popover-foreground hover:bg-muted">
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setLoginOpen(true)}
                  className="hidden md:flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
                >
                  <User className="h-4 w-4" />
                  Sign In
                </button>
              )}

              {/* Mobile menu toggle */}
              <button
                className="md:hidden flex items-center justify-center h-10 w-10 rounded-full text-muted-foreground hover:bg-muted"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-background px-4 py-3 space-y-1">
            <div className="px-4 py-1">
              <AnimatedThemeToggler
                className="flex h-10 w-full items-center justify-center rounded-xl bg-muted text-foreground"
                duration={700}
                aria-label="Toggle theme"
              />
            </div>
            {(isAdmin ? [{ href: "/dashboard", label: "Dashboard" }] : navLinks).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "block px-4 py-2.5 rounded-xl text-sm font-medium",
                  pathname === link.href || (link.href.startsWith("/#") && pathname === "/")
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <button
                onClick={async () => {
                  await handleLogout();
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => { setLoginOpen(true); setMenuOpen(false); }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-indigo-600 hover:bg-indigo-50"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </header>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
