import { SupplierListScreen } from "@/components/suppliers/supplier-list-screen";

export default function UserSuppliersPage() {
  return (
    <SupplierListScreen
      badge="Operations"
      title="Suppliers"
      description="View supplier contacts used for sourcing and purchases."
      readOnly
    />
  );
}
