'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { useAuthStore } from '@/store';

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/dashboard');
  const { isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    let mounted = true;
    const syncSession = async () => {
      if (!isAuthenticated) return;
      try {
        const response = await fetch('/api/auth/session', { cache: 'no-store' });
        const session = (await response.json()) as {
          authenticated?: boolean;
          role?: 'admin' | 'customer';
        };
        if (!mounted) return;

        if (!session.authenticated) {
          logout();
          return;
        }

        if (session.role === 'admin' && !isAdminRoute) {
          router.replace('/dashboard');
        }
      } catch {
        // noop
      }
    };

    syncSession();
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, isAdminRoute, logout, router]);

  if (isAdminRoute) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
