"use client";

import {
  AdminCompanyFilter,
  useAdminCompanyScope,
} from "@/components/admin/admin-company-filter";
import { PurchaseListScreen } from "@/components/purchases/purchase-list-screen";

export default function AdminPurchasesPage() {
  const { companyId, setCompanyId } = useAdminCompanyScope();

  return (
    <div className="space-y-6">
      <AdminCompanyFilter value={companyId} onChange={setCompanyId} />
      <PurchaseListScreen
        badge="Tenant Data"
        title="Purchases"
        description="Read-only purchase history across companies."
        canCreate={false}
        companyId={companyId}
      />
    </div>
  );
}
