export type ProductStatus = "in_stock" | "low_stock" | "out_of_stock" | "draft";

export type Product = {
  id: string;
  sku: string;
  name: string;
  category: string;
  supplier: string;
  price: number;
  stock: number;
  status: ProductStatus;
  updatedAt: string;
};

export const productStatusLabels: Record<ProductStatus, string> = {
  in_stock: "In Stock",
  low_stock: "Low Stock",
  out_of_stock: "Out of Stock",
  draft: "Draft",
};

export const productCategories = [
  "All Categories",
  "Electronics",
  "Office Supplies",
  "Accessories",
  "Packaging",
  "Hardware",
] as const;
