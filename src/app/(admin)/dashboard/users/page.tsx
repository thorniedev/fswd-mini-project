export const dynamic = 'force-dynamic';
import { getUsers } from "@/features/users/queries";
import { AdminUsersClient } from "@/components/users/admin-users-client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Manage Users" };

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const initialSearch = params.q?.trim() ?? "";

  const users = await getUsers(200);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Users</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">{users.length} total registered users</p>
      </div>
      <AdminUsersClient users={users} initialSearch={initialSearch} />
    </div>
  );
}
