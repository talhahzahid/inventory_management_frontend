import { ProductListScreen } from "@/components/products/product-list-screen";

export default function CompanyProductsPage() {
  return (
    <ProductListScreen
      badge="Inventory"
      title="Products"
      description="Manage product catalog, pricing, stock levels, and availability."
    />
  );
}
