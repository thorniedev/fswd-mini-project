'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export function AuthGuard({
  children,
  requireAdmin = false,
  redirectTo = '/',
}: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [hydrated, setHydrated] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const timer = window.setTimeout(() => setHydrated(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const isAdmin = user?.role === 'admin';
    const blocked = !isAuthenticated || (requireAdmin && !isAdmin);

    if (blocked) {
      router.replace(`${redirectTo}?next=${encodeURIComponent(pathname)}`);
    }
  }, [hydrated, isAuthenticated, pathname, redirectTo, requireAdmin, router, user?.role]);

  if (!hydrated) {
    return <div className="p-6 text-sm text-gray-500">Checking access...</div>;
  }

  const isAdmin = user?.role === 'admin';
  const blocked = !isAuthenticated || (requireAdmin && !isAdmin);

  if (blocked) {
    return null;
  }

  return <>{children}</>;
}
