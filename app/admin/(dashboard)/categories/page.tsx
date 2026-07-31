"use client";

import {
  AdminCompanyFilter,
  useAdminCompanyScope,
} from "@/components/admin/admin-company-filter";
import { CategoryListScreen } from "@/components/categories/category-list-screen";

export default function AdminCategoriesPage() {
  const { companyId, setCompanyId } = useAdminCompanyScope();

  return (
    <div className="space-y-6">
      <AdminCompanyFilter value={companyId} onChange={setCompanyId} />
      <CategoryListScreen
        badge="Tenant Data"
        title="Categories"
        description="Read-only product categories across companies."
        readOnly
        companyId={companyId}
      />
    </div>
  );
}
