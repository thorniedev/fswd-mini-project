'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateUser, uploadUserAvatar } from '@/features/users/queries';
import {
  selfUpdateUserSchema,
  type SelfUpdateUserFormData,
} from '@/features/users/schema';
import { useAuthStore } from '@/store';
import type { User } from '@/features/users/types';
import { ApiError } from '@/lib/api/client';

interface UserProfileEditorProps {
  user: User;
  embedded?: boolean;
  onSuccess?: () => void;
}

export function UserProfileEditor({ user, embedded = false, onSuccess }: UserProfileEditorProps) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { user: currentUser, accessToken, setUser } = useAuthStore();

  const canEdit = currentUser?.id === user.id;

  const form = useForm<SelfUpdateUserFormData>({
    resolver: zodResolver(selfUpdateUserSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      avatarFile: undefined,
      password: '',
    },
  });

  if (!canEdit) {
    return null;
  }

  const onSubmit = form.handleSubmit(async (values) => {
    if (!accessToken) {
      setError('You must be logged in to update your profile.');
      return;
    }

    setMessage('');
    setError('');

    try {
      const selectedFile = values.avatarFile?.[0] as File | undefined;
      const payload: {
        name?: string;
        email?: string;
        avatar?: string;
        password?: string;
      } = {};

      const nextName = values.name.trim();
      const nextEmail = values.email.trim();

      if (nextName && nextName !== user.name) {
        payload.name = nextName;
      }
      if (nextEmail && nextEmail !== user.email) {
        payload.email = nextEmail;
      }
      if (selectedFile) {
        payload.avatar = await uploadUserAvatar(selectedFile, accessToken);
      }
      if (values.password?.trim()) {
        payload.password = values.password.trim();
      }

      if (Object.keys(payload).length === 0) {
        setMessage('No changes to save.');
        return;
      }

      const updated = await updateUser(user.id, payload, accessToken);
      setUser(updated);
      setMessage('Profile updated successfully.');
      form.reset({
        name: updated.name,
        email: updated.email,
        avatarFile: undefined,
        password: '',
      });
      onSuccess?.();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || 'Failed to update profile.');
        return;
      }
      setError('Failed to update profile.');
    }
  });

  const formContent = (
    <form onSubmit={onSubmit} className={embedded ? "space-y-4" : "mt-4 space-y-4"}>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-emerald-600">{message}</p>}

        <Input label="Name" {...form.register('name')} error={form.formState.errors.name?.message} />
        <Input label="Email" type="email" {...form.register('email')} error={form.formState.errors.email?.message} />
        <Input label="Profile Picture (optional)" type="file" accept="image/*" {...form.register('avatarFile')} />
        <Input
          label="New Password (optional)"
          type="password"
          {...form.register('password')}
          error={form.formState.errors.password?.message}
        />

        <Button type="submit" loading={form.formState.isSubmitting}>Save Changes</Button>
    </form>
  );

  if (embedded) {
    return formContent;
  }

  return (
    <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Edit My Profile</h2>
      <p className="mt-1 text-sm text-gray-500">You can update your own account details.</p>
      {formContent}
    </div>
  );
}
