import { LoginForm } from "@/components/auth/login-form";
import { LoginLayout } from "@/components/auth/login-layout";
import { roleNavConfig } from "@/config/navigation";

export default function AdminLoginPage() {
  const config = roleNavConfig.super_admin;

  return (
    <LoginLayout
      role="super_admin"
      badge="Super Admin"
      title={config.portalTitle}
      subtitle={config.portalSubtitle}
    >
      <LoginForm
        role="super_admin"
        title="Platform Admin Login"
        subtitle="Sign in to manage companies, subscriptions, and platform analytics."
        demoEmail="admin@stockflow.com"
        demoPassword="Admin@123"
        alternateLogins={[
          { label: "Company Admin", href: "/company/login" },
          { label: "Staff User", href: "/user/login" },
        ]}
      />
    </LoginLayout>
  );
}
