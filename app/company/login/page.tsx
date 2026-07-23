import { LoginForm } from "@/components/auth/login-form";
import { LoginLayout } from "@/components/auth/login-layout";
import { roleNavConfig } from "@/config/navigation";

export default function CompanyLoginPage() {
  const config = roleNavConfig.company_admin;

  return (
    <LoginLayout
      role="company_admin"
      badge="Company Admin"
      title={config.portalTitle}
      subtitle={config.portalSubtitle}
    >
      <LoginForm
        role="company_admin"
        title="Company Admin Login"
        subtitle="Sign in to manage your company inventory, team, and daily operations."
        demoEmail="company@abc.com"
        demoPassword="Company@123"
        alternateLogins={[
          { label: "Platform Admin", href: "/admin/login" },
          { label: "Staff User", href: "/user/login" },
        ]}
      />
    </LoginLayout>
  );
}
