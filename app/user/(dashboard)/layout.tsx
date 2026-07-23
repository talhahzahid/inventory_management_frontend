import { AuthGuard } from "@/components/auth/auth-guard";
import { RoleWorkspace } from "@/components/layout/role-workspace";

export default function UserDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard allowedRole="user">
      <RoleWorkspace role="user">{children}</RoleWorkspace>
    </AuthGuard>
  );
}
