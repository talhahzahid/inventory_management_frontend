import { SaleListScreen } from "@/components/sales/sale-list-screen";

export default function UserSalesPage() {
  return (
    <SaleListScreen
      badge="Operations"
      title="Sales"
      description="Create sales and view sale history. Stock deducts automatically."
      canCreate
    />
  );
}
