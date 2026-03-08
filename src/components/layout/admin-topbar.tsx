'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { AlignJustify, Bell, CheckCheck, X } from 'lucide-react';
import { useAuthStore } from '@/store';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';

interface AdminTopbarProps {
  onToggleSidebar: () => void;
}

export function AdminTopbar({ onToggleSidebar }: AdminTopbarProps) {
  const { user, logout } = useAuthStore();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New user registered', time: '2m ago', read: false },
    { id: 2, title: 'Product updated successfully', time: '15m ago', read: false },
    { id: 3, title: 'Low stock alert on 3 products', time: '1h ago', read: true },
  ]);
  const firstName = user?.name?.split(' ')[0] ?? 'Admin';
  const avatar =
    user?.avatar && user.avatar.startsWith('http')
      ? user.avatar
      : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email ?? 'admin'}`;
  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications]
  );

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        <button
          onClick={onToggleSidebar}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground hover:bg-muted"
          aria-label="Toggle sidebar"
        >
          <AlignJustify className="h-5 w-5" />
        </button>

        <div className="ml-auto flex items-center gap-3">
          <AnimatedThemeToggler
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-background text-muted-foreground hover:bg-muted"
            duration={700}
            aria-label="Toggle theme"
          />
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen((prev) => !prev)}
              className="relative h-10 w-10 rounded-xl border border-border bg-background text-muted-foreground hover:bg-muted"
            >
              <Bell className="mx-auto h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
              )}
            </button>
            {isNotifOpen && (
              <div className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-border bg-popover p-3 shadow-xl">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-semibold text-popover-foreground">Notifications</p>
                  {notifications.length > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-50"
                    >
                      <CheckCheck className="h-3.5 w-3.5" />
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-72 space-y-2 overflow-auto">
                  {notifications.length === 0 && (
                    <p className="rounded-lg bg-muted px-3 py-4 text-center text-xs text-muted-foreground">
                      No notifications
                    </p>
                  )}
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-2 rounded-lg border border-border px-3 py-2"
                    >
                      <div>
                        <p className={`text-sm ${item.read ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground/70">{item.time}</p>
                      </div>
                      <button
                        onClick={() => removeNotification(item.id)}
                        className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="group relative border-l border-border pl-3">
            <button className="flex items-center gap-3">
              <div className="text-right leading-tight">
                <p className="text-sm font-semibold text-foreground">{firstName}</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
              <div className="relative h-9 w-9 overflow-hidden rounded-full border border-border bg-muted">
                <Image src={avatar} alt={firstName} fill className="object-cover" sizes="36px" />
              </div>
            </button>

            <div className="invisible absolute right-0 top-12 z-50 w-44 rounded-xl border border-border bg-popover p-1 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
              <Link
                href={user ? `/users/${user.id}` : '/users'}
                className="block rounded-lg px-3 py-2 text-sm text-popover-foreground hover:bg-muted"
              >
                Profile
              </Link>
              <button
                onClick={logout}
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
