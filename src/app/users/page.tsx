export const dynamic = 'force-dynamic';
import Image from "next/image";
import Link from "next/link";
import { Mail, Shield } from "lucide-react";
import { getUsers } from "@/features/users/queries";
import { Badge } from "@/components/ui/badge";
import { AuthGuard } from "@/components/auth/auth-guard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Users" };

export default async function UsersPage() {
  const users = await getUsers(20);

  return (
    <AuthGuard requireAdmin redirectTo="/">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="mt-1 text-muted-foreground">{users.length} registered members</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => {
            const avatarUrl = user.avatar?.startsWith("http")
              ? user.avatar
              : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`;

            return (
              <Link
                key={user.id}
                href={`/users/${user.id}`}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-300 hover:border-indigo-200 hover:shadow-md"
              >
                <div className="relative h-14 w-14 flex-shrink-0">
                  <Image
                    src={avatarUrl}
                    alt={user.name}
                    fill
                    className="rounded-full border-2 border-border object-cover transition-colors group-hover:border-indigo-300"
                    sizes="56px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold text-foreground">{user.name}</p>
                    {user.role === "admin" && (
                      <Badge variant="info">
                        <Shield className="h-3 w-3 mr-0.5" />
                        Admin
                      </Badge>
                    )}
                  </div>
                  <p className="mt-0.5 flex items-center gap-1 truncate text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                    {user.email}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">ID: #{user.id}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </AuthGuard>
  );
}
