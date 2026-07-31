import { CategoryListScreen } from "@/components/categories/category-list-screen";

export default function UserCategoriesPage() {
  return (
    <CategoryListScreen
      badge="Inventory"
      title="Categories"
      description="Browse product categories in your company catalog."
      readOnly
    />
  );
}
