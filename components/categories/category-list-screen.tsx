"use client";

import {
  Download,
  Eye,
  FolderTree,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  Power,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { UiButton } from "@/components/Button";
import { AddCategorySheet } from "@/components/categories/add-category-sheet";
import { CategoryListLoader } from "@/components/categories/category-list-loader";
import { CategoryStatusBadge } from "@/components/categories/category-status-badge";
import { EditCategorySheet } from "@/components/categories/edit-category-sheet";
import { ViewCategorySheet } from "@/components/categories/view-category-sheet";
import {
  DataTable,
  ListViewFilters,
  ListViewHeader,
  ListViewLayout,
  ListViewPagination,
  ListViewStats,
} from "@/components/list-view";
import type { DataTableColumn } from "@/components/list-view";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDebounce } from "@/hooks/use-debounce";
import { buildCategoryListParams } from "@/lib/category-filters";
import {
  createCategory,
  deactivateCategory,
  fetchCategoriesList,
  updateCategory,
} from "@/lib/categories";
import type { AddCategoryFormValues } from "@/schema/categorySchema";
import type { Category, CategoryStatus } from "@/types/category";
import { categoryStatusLabels } from "@/types/category";

const PAGE_SIZE = 6;

type CategoryListScreenProps = {
  badge?: string;
  title?: string;
  description?: string;
  readOnly?: boolean;
  companyId?: string;
};

export function CategoryListScreen({
  badge = "Inventory",
  title = "Categories",
  description = "Organize your product catalog with categories and keep inventory structured.",
  readOnly = false,
  companyId = "all",
}: CategoryListScreenProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isViewCategoryOpen, setIsViewCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [loadError, setLoadError] = useState("");

  const debouncedSearch = useDebounce(search, 400);

  const loadCategories = useCallback(async () => {
    setIsFetching(true);

    try {
      const result = await fetchCategoriesList(
        buildCategoryListParams({
          page,
          limit: PAGE_SIZE,
          search: debouncedSearch,
          status,
          companyId,
        })
      );

      setCategories(result.categories);
      setTotal(result.total);
      setLoadError("");
    } catch (error: unknown) {
      setLoadError(
        error instanceof Error ? error.message : "Unable to load categories."
      );
    } finally {
      setIsFetching(false);
      setIsInitialLoading(false);
    }
  }, [companyId, debouncedSearch, page, status]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleAddCategory = async (values: AddCategoryFormValues) => {
    await createCategory(values);
    await loadCategories();
    toast.success("Category created successfully", {
      description: `${values.name} has been added to your catalog.`,
    });
  };

  const handleUpdateCategory = async (
    id: string,
    values: AddCategoryFormValues
  ) => {
    const category = await updateCategory(id, values);
    setSelectedCategory(category);
    await loadCategories();
    toast.success("Category updated successfully", {
      description: `${category.name} has been saved.`,
    });
  };

  const handleDeactivateCategory = async (category: Category) => {
    try {
      await deactivateCategory(category.id);
      await loadCategories();
      toast.success("Category deactivated", {
        description: `${category.name} is now inactive.`,
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to deactivate category."
      );
    }
  };

  const openViewCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsViewCategoryOpen(true);
  };

  const openEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsEditCategoryOpen(true);
  };

  const stats = useMemo(
    () => [
      { label: "Total Categories", value: total },
      {
        label: "Active",
        value: categories.filter((c) => c.status === "active").length,
        tone: "success" as const,
      },
      {
        label: "Inactive",
        value: categories.filter((c) => c.status === "inactive").length,
        tone: "danger" as const,
      },
      {
        label: "Total Products",
        value: categories.reduce((sum, c) => sum + c.productCount, 0),
        tone: "warning" as const,
      },
    ],
    [categories, total]
  );

  const hasActiveFilters = search.trim() !== "" || status !== "all";

  const handleClearFilters = () => {
    setSearch("");
    setStatus("all");
    setPage(1);
  };

  const columns: DataTableColumn<Category>[] = [
    {
      key: "category",
      header: "Category",
      render: (category) => (
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
            <FolderTree className="size-4" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{category.name}</p>
            <p className="text-xs text-muted-foreground">{category.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (category) => (
        <span className="text-muted-foreground">
          {category.description ?? "—"}
        </span>
      ),
    },
    // {
    //   key: "products",
    //   header: "Products",
    //   render: (category) => (
    //     <span className="font-semibold">{category.productCount}</span>
    //   ),
    // },
    {
      key: "status",
      header: "Status",
      render: (category) => <CategoryStatusBadge status={category.status} />,
    },
    {
      key: "updated",
      header: "Updated",
      render: (category) => (
        <span className="text-muted-foreground">{category.updatedAt}</span>
      ),
    },
    {
      key: "actions",
      header: "Action",
      headerClassName: readOnly ? "w-16" : "w-32",
      className: "text-right",
      render: (category) =>
        readOnly ? (
          <Button
            variant="ghost"
            size="icon-sm"
            className="rounded-lg text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
            aria-label={`View ${category.name}`}
            onClick={() => openViewCategory(category)}
          >
            <Eye className="size-4" />
          </Button>
        ) : (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-lg text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
              aria-label={`View ${category.name}`}
              onClick={() => openViewCategory(category)}
            >
              <Eye className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-lg text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
              aria-label={`Edit ${category.name}`}
              onClick={() => openEditCategory(category)}
            >
              <Pencil className="size-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="rounded-lg"
                    aria-label="Open actions"
                  />
                }
              >
                <MoreHorizontal className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                <DropdownMenuItem onClick={() => openViewCategory(category)}>
                  <Eye className="size-4" />
                  View category
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openEditCategory(category)}>
                  <Pencil className="size-4" />
                  Edit category
                </DropdownMenuItem>
                {category.status === "active" ? (
                  <DropdownMenuItem
                    onClick={() => handleDeactivateCategory(category)}
                  >
                    <Power className="size-4" />
                    Deactivate
                  </DropdownMenuItem>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
    },
  ];

  if (isInitialLoading) {
    return <CategoryListLoader />;
  }

  return (
    <>
      <ListViewLayout
        header={
          <ListViewHeader
            badge={badge}
            title={title}
            description={description}
            actions={
              readOnly ? (
                <UiButton variant="outline" buttonText="Export" icon={Download} />
              ) : (
                <>
                  <UiButton variant="outline" buttonText="Export" icon={Download} />
                  <UiButton
                    variant="primary"
                    buttonText="Add Category"
                    icon={Plus}
                    onClick={() => setIsAddCategoryOpen(true)}
                  />
                </>
              )
            }
          />
        }
        stats={<ListViewStats stats={stats} />}
        filters={
          <ListViewFilters
            searchValue={search}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            searchPlaceholder="Search by category name..."
            hasActiveFilters={hasActiveFilters}
            onClear={handleClearFilters}
            filters={[
              {
                id: "status",
                label: "Status",
                value: status,
                onChange: (value) => {
                  setStatus(value);
                  setPage(1);
                },
                options: [
                  { label: "All Status", value: "all" },
                  ...(Object.entries(categoryStatusLabels) as [
                    CategoryStatus,
                    string,
                  ][]).map(([value, label]) => ({ label, value })),
                ],
              },
            ]}
          />
        }
        footer={
          <ListViewPagination
            page={page}
            pageSize={PAGE_SIZE}
            total={total}
            onPageChange={setPage}
          />
        }
      >
        <div className="relative">
          {isFetching ? (
            <div className="absolute inset-x-0 top-0 z-10 flex justify-center py-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-xs font-medium text-indigo-700 shadow-sm">
                <Loader2 className="size-3.5 animate-spin" />
                Updating results...
              </div>
            </div>
          ) : null}
          <DataTable
            columns={columns}
            data={categories}
            rowKey={(category) => category.id}
            emptyMessage={loadError || "No categories match your filters."}
          />
        </div>
      </ListViewLayout>

      {!readOnly ? (
        <AddCategorySheet
          open={isAddCategoryOpen}
          onOpenChange={setIsAddCategoryOpen}
          onSubmit={handleAddCategory}
        />
      ) : null}

      <ViewCategorySheet
        open={isViewCategoryOpen}
        onOpenChange={setIsViewCategoryOpen}
        category={selectedCategory}
        readOnly={readOnly}
        onEdit={
          readOnly
            ? undefined
            : () => {
                setIsViewCategoryOpen(false);
                setIsEditCategoryOpen(true);
              }
        }
      />

      {!readOnly ? (
        <EditCategorySheet
          open={isEditCategoryOpen}
          onOpenChange={setIsEditCategoryOpen}
          category={selectedCategory}
          onSubmit={handleUpdateCategory}
        />
      ) : null}
    </>
  );
}
