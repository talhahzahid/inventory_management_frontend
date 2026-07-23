import { LoginForm } from "@/components/auth/login-form";
import { LoginLayout } from "@/components/auth/login-layout";
import { roleNavConfig } from "@/config/navigation";

export default function UserLoginPage() {
  const config = roleNavConfig.user;

  return (
    <LoginLayout
      role="user"
      badge="Team Member"
      title={config.portalTitle}
      subtitle={config.portalSubtitle}
    >
      <LoginForm
        role="user"
        title="Staff Login"
        subtitle="Sign in to handle products, stock updates, and assigned orders."
        demoEmail="user@abc.com"
        demoPassword="User@123"
        alternateLogins={[
          { label: "Platform Admin", href: "/admin/login" },
          { label: "Company Admin", href: "/company/login" },
        ]}
      />
    </LoginLayout>
  );
}
