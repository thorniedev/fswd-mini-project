import { AdminShell } from "@/components/layout/admin-shell";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requireAdmin redirectTo="/">
      <AdminShell>{children}</AdminShell>
    </AuthGuard>
  );
}
