import { AuthGuard } from "@/components/auth/auth-guard";
import { RoleWorkspace } from "@/components/layout/role-workspace";

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard allowedRole="super_admin">
      <RoleWorkspace role="super_admin">{children}</RoleWorkspace>
    </AuthGuard>
  );
}
