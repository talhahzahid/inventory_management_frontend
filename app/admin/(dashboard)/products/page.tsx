"use client";

import {
  AdminCompanyFilter,
  useAdminCompanyScope,
} from "@/components/admin/admin-company-filter";
import { ProductListScreen } from "@/components/products/product-list-screen";

export default function AdminProductsPage() {
  const { companyId, setCompanyId } = useAdminCompanyScope();

  return (
    <div className="space-y-6">
      <AdminCompanyFilter value={companyId} onChange={setCompanyId} />
      <ProductListScreen
        badge="Tenant Data"
        title="Products"
        description="Read-only product catalog across companies."
        readOnly
        companyId={companyId}
      />
    </div>
  );
}
