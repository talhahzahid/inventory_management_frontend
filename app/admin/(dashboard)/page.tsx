"use client";

import {
  AdminCompanyFilter,
  useAdminCompanyScope,
} from "@/components/admin/admin-company-filter";
import { DashboardScreen } from "@/components/dashboard/dashboard-screen";

export default function AdminDashboardPage() {
  const { companyId, setCompanyId } = useAdminCompanyScope();

  return (
    <div className="space-y-6">
      <AdminCompanyFilter value={companyId} onChange={setCompanyId} />
      <DashboardScreen variant="admin" companyId={companyId} />
    </div>
  );
}
