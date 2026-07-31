import { PurchaseListScreen } from "@/components/purchases/purchase-list-screen";

export default function UserPurchasesPage() {
  return (
    <PurchaseListScreen
      badge="Operations"
      title="Purchases"
      description="View purchase history and restock records."
      canCreate={false}
    />
  );
}
