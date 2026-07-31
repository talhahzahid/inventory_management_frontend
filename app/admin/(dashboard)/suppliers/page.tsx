"use client";

import {
  AdminCompanyFilter,
  useAdminCompanyScope,
} from "@/components/admin/admin-company-filter";
import { SupplierListScreen } from "@/components/suppliers/supplier-list-screen";

export default function AdminSuppliersPage() {
  const { companyId, setCompanyId } = useAdminCompanyScope();

  return (
    <div className="space-y-6">
      <AdminCompanyFilter
        value={companyId}
        onChange={setCompanyId}
        requiredHint="Select a company to create suppliers for that tenant. Listing works for all companies."
      />
      <SupplierListScreen
        badge="Tenant Data"
        title="Suppliers"
        description="Full supplier CRUD across companies. Select a company to create suppliers."
        companyId={companyId}
        requireCompanyForCreate
      />
    </div>
  );
}
