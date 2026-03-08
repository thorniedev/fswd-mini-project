"use client";

import { useState } from "react";
import { useAuthStore } from "@/store";
import type { User } from "@/features/users/types";
import { UserProfileEditor } from "@/components/users/user-profile-editor";
import { Modal } from "@/components/ui/modal";

interface ProfileEditToggleProps {
  user: User;
}

export function ProfileEditToggle({ user }: ProfileEditToggleProps) {
  const [open, setOpen] = useState(false);
  const { user: currentUser } = useAuthStore();

  const canEdit = currentUser?.id === user.id;

  if (!canEdit) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700"
      >
        Edit Profile
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Edit My Profile">
        <p className="mb-4 text-sm text-muted-foreground">You can update your own account details.</p>
        <UserProfileEditor user={user} embedded onSuccess={() => setOpen(false)} />
      </Modal>
    </>
  );
}
