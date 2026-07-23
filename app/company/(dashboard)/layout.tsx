import { AuthGuard } from "@/components/auth/auth-guard";
import { RoleWorkspace } from "@/components/layout/role-workspace";

export default function CompanyDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard allowedRole="company_admin">
      <RoleWorkspace role="company_admin">{children}</RoleWorkspace>
    </AuthGuard>
  );
}
