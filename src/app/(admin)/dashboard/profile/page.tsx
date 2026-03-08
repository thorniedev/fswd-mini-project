"use client";

import Image from "next/image";
import { useAuthStore } from "@/store";
import { UserProfileEditor } from "@/components/users/user-profile-editor";

export default function AdminProfilePage() {
  const { user } = useAuthStore();

  if (!user) {
    return null;
  }

  const avatar =
    user.avatar?.startsWith("http")
      ? user.avatar
      : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-full border border-border bg-muted">
            <Image src={avatar} alt={user.name} fill className="object-cover" sizes="64px" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Admin Profile</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Edit Profile</h2>
        <p className="mb-4 mt-1 text-sm text-muted-foreground">
          Update your admin account details.
        </p>
        <UserProfileEditor user={user} embedded />
      </section>
    </div>
  );
}
