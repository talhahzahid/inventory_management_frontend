import { ProductListScreen } from "@/components/products/product-list-screen";

export default function UserProductsPage() {
  return (
    <ProductListScreen
      badge="My Work"
      title="Products"
      description="View assigned products, stock levels, and availability."
      readOnly
    />
  );
}
