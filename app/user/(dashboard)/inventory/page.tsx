import { InventoryListScreen } from "@/components/inventory/inventory-list-screen";

export default function UserInventoryPage() {
  return (
    <InventoryListScreen
      badge="Inventory"
      title="Inventory"
      description="View warehouse stock levels and low-stock alerts."
      readOnly
    />
  );
}
