'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, Plus, Pencil, Trash2, Shield } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store';
import {
  createUser,
  updateUser,
  deleteUser,
  uploadUserAvatar,
} from '@/features/users/queries';
import {
  adminCreateUserSchema,
  adminUpdateUserSchema,
  type AdminCreateUserFormData,
  type AdminUpdateUserFormData,
} from '@/features/users/schema';
import type { User } from '@/features/users/types';

interface AdminUsersClientProps {
  users: User[];
  initialSearch?: string;
}

export function AdminUsersClient({
  users: initialUsers,
  initialSearch = '',
}: AdminUsersClientProps) {
  const PAGE_SIZE = 10;
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState(initialSearch);
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'customer'>('all');
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const { accessToken, user: currentUser } = useAuthStore();

  const createForm = useForm<AdminCreateUserFormData>({
    resolver: zodResolver(adminCreateUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      avatarFile: undefined,
      role: 'customer',
    },
  });

  const editForm = useForm<AdminUpdateUserFormData>({
    resolver: zodResolver(adminUpdateUserSchema),
  });

  const filteredUsers = users.filter((u) => {
    const keyword = search.toLowerCase();
    const matchesSearch = (
      u.name.toLowerCase().includes(keyword) ||
      u.email.toLowerCase().includes(keyword)
    );
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginatedUsers = filteredUsers.slice(start, start + PAGE_SIZE);

  const roleOptions = [
    { value: 'customer', label: 'Customer' },
    { value: 'admin', label: 'Admin' },
  ];

  const openEdit = (target: User) => {
    setEditingUser(target);
    editForm.reset({
      name: target.name,
      email: target.email,
      avatarFile: undefined,
      role: target.role,
      password: '',
    });
    setEditOpen(true);
  };

  const handleCreate = createForm.handleSubmit(async (values) => {
    if (!accessToken) {
      setError('You must be logged in as admin.');
      return;
    }

    setError('');
    try {
      const selectedFile = values.avatarFile?.[0] as File | undefined;
      if (!selectedFile) {
        setError('Please upload a profile picture.');
        return;
      }

      const avatarUrl = await uploadUserAvatar(selectedFile, accessToken);
      const created = await createUser({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        avatar: avatarUrl,
      });
      setUsers((prev) => [created, ...prev]);
      setCreateOpen(false);
      createForm.reset({
        name: '',
        email: '',
        password: '',
        avatarFile: undefined,
        role: 'customer',
      });
    } catch {
      setError('Failed to create user. Check input values and try again.');
    }
  });

  const handleEdit = editForm.handleSubmit(async (values) => {
    if (!accessToken || !editingUser) {
      setError('You must be logged in as admin.');
      return;
    }

    if (editingUser.role === 'admin' && editingUser.id !== currentUser?.id) {
      setError('Admin users can only edit their own admin account.');
      return;
    }

    setError('');
    try {
      const selectedFile = values.avatarFile?.[0] as File | undefined;
      let avatarUrl = editingUser.avatar;
      if (selectedFile) {
        avatarUrl = await uploadUserAvatar(selectedFile, accessToken);
      }

      const payload = {
        name: values.name,
        email: values.email,
        avatar: avatarUrl,
        role: values.role,
        ...(values.password ? { password: values.password } : {}),
      };

      const updated = await updateUser(editingUser.id, payload, accessToken);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      setEditOpen(false);
      setEditingUser(null);
    } catch {
      setError('Failed to update user.');
    }
  });

  const handleDelete = async () => {
    if (!accessToken || deleteId === null) {
      return;
    }

    const target = users.find((u) => u.id === deleteId);
    if (!target) return;

    if (target.role === 'admin') {
      setError('Admin accounts cannot be deleted from dashboard.');
      setDeleteId(null);
      return;
    }

    setError('');
    try {
      await deleteUser(deleteId, accessToken);
      setUsers((prev) => prev.filter((u) => u.id !== deleteId));
      setDeleteId(null);
    } catch {
      setError('Failed to delete user.');
    }
  };

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div className="relative flex-1 min-w-48 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search users..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-input bg-background py-2 pl-9 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value as 'all' | 'admin' | 'customer');
              setPage(1);
            }}
            className="rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
          </select>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>

        {error && (
          <div className="mx-5 mt-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted text-left text-xs text-muted-foreground">
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedUsers.map((target) => (
                <tr key={target.id} className="transition-colors hover:bg-muted/60">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-muted">
                        <Image
                          src={
                            target.avatar?.startsWith('http')
                              ? target.avatar
                              : `https://api.dicebear.com/7.x/avataaars/svg?seed=${target.email}`
                          }
                          alt={target.name}
                          fill
                          className="object-cover"
                          sizes="32px"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{target.name}</p>
                        <p className="text-xs text-muted-foreground">#{target.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{target.email}</td>
                  <td className="px-5 py-3">
                    {target.role === 'admin' ? (
                      <Badge variant="info">
                        <Shield className="h-3 w-3 mr-0.5" />
                        Admin
                      </Badge>
                    ) : (
                      <Badge>Customer</Badge>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(target)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(target.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        disabled={target.role === 'admin'}
                        title={target.role === 'admin' ? 'Cannot delete admin users' : 'Delete user'}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length > 0 && (
          <div className="flex items-center justify-between border-t border-border px-5 py-4">
            <p className="text-xs text-muted-foreground">
              Showing {start + 1}-{Math.min(start + PAGE_SIZE, filteredUsers.length)} of {filteredUsers.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground disabled:opacity-40"
              >
                Prev
              </button>
              <span className="text-xs font-semibold text-foreground">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create User">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Name" {...createForm.register('name')} error={createForm.formState.errors.name?.message} />
          <Input label="Email" type="email" {...createForm.register('email')} error={createForm.formState.errors.email?.message} />
          <Input label="Password" type="password" {...createForm.register('password')} error={createForm.formState.errors.password?.message} />
          <Input label="Profile Picture" type="file" accept="image/*" {...createForm.register('avatarFile')} />
          <Select
            label="Role"
            options={roleOptions}
            {...createForm.register('role')}
            error={createForm.formState.errors.role?.message}
          />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setCreateOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" loading={createForm.formState.isSubmitting} className="flex-1">Create</Button>
          </div>
        </form>
      </Modal>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit User">
        <form onSubmit={handleEdit} className="space-y-4">
          <Input label="Name" {...editForm.register('name')} error={editForm.formState.errors.name?.message} />
          <Input label="Email" type="email" {...editForm.register('email')} error={editForm.formState.errors.email?.message} />
          <Input label="New Password (optional)" type="password" {...editForm.register('password')} error={editForm.formState.errors.password?.message} />
          <Input label="Profile Picture (optional)" type="file" accept="image/*" {...editForm.register('avatarFile')} />
          <Select
            label="Role"
            options={roleOptions}
            {...editForm.register('role')}
            error={editForm.formState.errors.role?.message}
          />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setEditOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" loading={editForm.formState.isSubmitting} className="flex-1">Save</Button>
          </div>
        </form>
      </Modal>

      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)} title="Delete User">
        <div className="space-y-4">
          <p className="text-gray-600">Delete this user account?</p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setDeleteId(null)} className="flex-1">Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} className="flex-1">Delete</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
