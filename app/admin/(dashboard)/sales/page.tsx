"use client";

import {
  AdminCompanyFilter,
  useAdminCompanyScope,
} from "@/components/admin/admin-company-filter";
import { SaleListScreen } from "@/components/sales/sale-list-screen";

export default function AdminSalesPage() {
  const { companyId, setCompanyId } = useAdminCompanyScope();

  return (
    <div className="space-y-6">
      <AdminCompanyFilter value={companyId} onChange={setCompanyId} />
      <SaleListScreen
        badge="Tenant Data"
        title="Sales"
        description="Read-only sales history across companies."
        canCreate={false}
        companyId={companyId}
      />
    </div>
  );
}
