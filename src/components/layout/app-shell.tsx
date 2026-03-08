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
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === 'admin';

  useEffect(() => {
    if (isAdmin && !isAdminRoute) {
      router.replace('/dashboard');
    }
  }, [isAdmin, isAdminRoute, router]);

  if (isAdmin && !isAdminRoute) {
    return <main className="min-h-screen" />;
  }

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
