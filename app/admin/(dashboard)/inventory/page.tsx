"use client";

import {
  AdminCompanyFilter,
  useAdminCompanyScope,
} from "@/components/admin/admin-company-filter";
import { InventoryListScreen } from "@/components/inventory/inventory-list-screen";

export default function AdminInventoryPage() {
  const { companyId, setCompanyId } = useAdminCompanyScope();

  return (
    <div className="space-y-6">
      <AdminCompanyFilter value={companyId} onChange={setCompanyId} />
      <InventoryListScreen
        badge="Tenant Data"
        title="Inventory"
        description="Read-only stock levels across companies."
        readOnly
        companyId={companyId}
      />
    </div>
  );
}
