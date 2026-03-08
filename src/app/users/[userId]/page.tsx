import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Shield,
  Calendar,
  MapPin,
  Phone,
  ShoppingCart,
  BadgeDollarSign,
  Heart,
} from 'lucide-react';
import { getUserById } from '@/features/users/queries';
import { Badge } from '@/components/ui/badge';
import { ProfileEditToggle } from '@/components/users/profile-edit-toggle';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ userId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { userId } = await params;
  try {
    const user = await getUserById(Number(userId));
    return { title: user.name };
  } catch {
    return { title: 'User Not Found' };
  }
}

export default async function UserDetailPage({ params }: PageProps) {
  const { userId } = await params;

  let user;
  try {
    user = await getUserById(Number(userId));
  } catch {
    notFound();
  }

  const avatarUrl = user.avatar?.startsWith('http')
    ? user.avatar
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`;

  const createdAt = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  const statusText = user.role === 'admin' ? 'Active / Verified' : 'Active';

  return (
    <div className="mx-auto w-full max-w-[1400px] px-3 py-6 md:px-6 md:py-8">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Link href="/" className="inline-flex items-center gap-1 hover:text-indigo-600">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
            <span>/</span>
            <span>User ID: #{user.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700">
              Suspend
            </button>
            <ProfileEditToggle user={user} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto mb-5 flex h-28 w-28 items-center justify-center rounded-full bg-slate-100 p-1 ring-4 ring-slate-50">
                <div className="relative h-full w-full overflow-hidden rounded-full">
                  <Image src={avatarUrl} alt={user.name} fill className="object-cover" sizes="112px" />
                </div>
              </div>
              <h1 className="text-5xl font-black tracking-tight text-slate-900">{user.name}</h1>
              <p className="mt-1 text-lg text-slate-500">{user.email}</p>
              <div className="mt-4 flex justify-center">
                <Badge variant={user.role === 'admin' ? 'info' : 'default'}>
                  {user.role === 'admin' ? <Shield className="mr-1 h-3 w-3" /> : null}
                  {user.role === 'admin' ? 'ADMIN USER' : 'CUSTOMER'}
                </Badge>
              </div>

              <div className="mt-6 space-y-4 border-t border-slate-100 pt-6 text-left">
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Joined Date</p>
                    <p className="text-sm font-medium text-slate-900">{createdAt}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Phone</p>
                    <p className="text-sm font-medium text-slate-900">+1 (555) 012-3456</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Address</p>
                    <p className="text-sm font-medium text-slate-900">742 Evergreen Terrace, Springfield</p>
                  </div>
                </div>
              </div>
            </section>
          </aside>

          <main className="min-w-0 space-y-6">
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Personal Information</h2>
                <button className="text-lg font-semibold text-indigo-700">Verify Identity</button>
              </div>

              <div className="grid gap-6 px-6 py-6 md:grid-cols-2">
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">First Name</p>
                  <p className="mt-1 text-3xl font-bold text-slate-900">{user.name.split(' ')[0] ?? user.name}</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">Last Name</p>
                  <p className="mt-1 text-3xl font-bold text-slate-900">{user.name.split(' ').slice(1).join(' ') || '-'}</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">Email Address</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">{user.email}</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">Account Status</p>
                  <p className="mt-1 inline-flex items-center gap-2 text-2xl font-semibold text-slate-900">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    {statusText}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">Bio</p>
                  <p className="mt-1 text-lg text-slate-600">
                    Passionate e-commerce member and active marketplace user.
                  </p>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Recent Orders</h2>
              </div>
              <div className="px-6 py-14 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                  <ShoppingCart className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900">No recent orders</h3>
                <p className="mx-auto mt-2 max-w-md text-lg text-slate-500">
                  This user has not made any purchases in the last 30 days.
                </p>
                <button className="mt-5 rounded-full bg-slate-100 px-6 py-2 text-sm font-semibold text-slate-700">
                  View Full History
                </button>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              <article className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">Total Spent</p>
                  <p className="mt-1 text-5xl font-black tracking-tight text-slate-900">$1,240.50</p>
                </div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                  <BadgeDollarSign className="h-6 w-6" />
                </span>
              </article>

              <article className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">Wishlist Items</p>
                  <p className="mt-1 text-5xl font-black tracking-tight text-slate-900">12</p>
                </div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                  <Heart className="h-6 w-6" />
                </span>
              </article>
            </section>
          </main>
        </div>

      </div>
    </div>
  );
}
