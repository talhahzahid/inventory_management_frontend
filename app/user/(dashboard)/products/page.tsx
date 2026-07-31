import { ProductListScreen } from "@/components/products/product-list-screen";

export default function UserProductsPage() {
  return (
    <ProductListScreen
      badge="Inventory"
      title="Products"
      description="Browse the product catalog, pricing, and availability."
      readOnly
    />
  );
}
