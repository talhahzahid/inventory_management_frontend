"use client";

import {
  Download,
  Eye,
  FolderTree,
  MoreHorizontal,
  Pencil,
  Plus,
  Power,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
import {
  createCategory,
  deactivateCategory,
  fetchCategories,
  updateCategory,
} from "@/lib/categories";
import type { AddCategoryFormValues } from "@/schema/categorySchema";
import type { Category, CategoryStatus } from "@/types/category";
import { categoryStatusLabels } from "@/types/category";

const PAGE_SIZE = 6;

export function CategoryListScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("updated_desc");
  const [page, setPage] = useState(1);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isViewCategoryOpen, setIsViewCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [loadError, setLoadError] = useState("");

  const loadCategories = () => {
    setIsLoading(true);

    fetchCategories()
      .then((data) => {
        setCategories(data);
        setLoadError("");
      })
      .catch((error: unknown) => {
        setLoadError(
          error instanceof Error ? error.message : "Unable to load categories."
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = async (values: AddCategoryFormValues) => {
    const category = await createCategory(values);
    setCategories((current) => [category, ...current]);
    toast.success("Category created successfully", {
      description: `${category.name} has been added to your catalog.`,
    });
  };

  const handleUpdateCategory = async (
    id: string,
    values: AddCategoryFormValues
  ) => {
    const category = await updateCategory(id, values);
    setCategories((current) =>
      current.map((item) => (item.id === id ? category : item))
    );
    setSelectedCategory(category);
    toast.success("Category updated successfully", {
      description: `${category.name} has been saved.`,
    });
  };

  const handleDeactivateCategory = async (category: Category) => {
    try {
      const updated = await deactivateCategory(category.id);
      setCategories((current) =>
        current.map((item) => (item.id === category.id ? updated : item))
      );
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

  const filteredCategories = useMemo(() => {
    let result = [...categories];

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (category) =>
          category.name.toLowerCase().includes(query) ||
          category.slug.toLowerCase().includes(query) ||
          category.description?.toLowerCase().includes(query)
      );
    }

    if (status !== "all") {
      result = result.filter((category) => category.status === status);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "products_desc":
          return b.productCount - a.productCount;
        case "updated_desc":
        default:
          return b.updatedAt.localeCompare(a.updatedAt);
      }
    });

    return result;
  }, [categories, search, status, sortBy]);

  const paginatedCategories = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredCategories.slice(start, start + PAGE_SIZE);
  }, [filteredCategories, page]);

  const stats = useMemo(
    () => [
      { label: "Total Categories", value: categories.length },
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
    [categories]
  );

  const hasActiveFilters = search.trim() !== "" || status !== "all";

  const handleClearFilters = () => {
    setSearch("");
    setStatus("all");
    setSortBy("updated_desc");
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
    {
      key: "products",
      header: "Products",
      render: (category) => (
        <span className="font-semibold">{category.productCount}</span>
      ),
    },
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
      header: "",
      headerClassName: "w-32",
      className: "text-right",
      render: (category) => (
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

  if (isLoading) {
    return <CategoryListLoader />;
  }

  return (
    <>
      <ListViewLayout
        header={
          <ListViewHeader
            badge="Inventory"
            title="Categories"
            description="Organize your product catalog with categories and keep inventory structured."
            actions={
              <>
                <UiButton variant="outline" buttonText="Export" icon={Download} />
                <UiButton
                  variant="primary"
                  buttonText="Add Category"
                  icon={Plus}
                  onClick={() => setIsAddCategoryOpen(true)}
                />
              </>
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
            searchPlaceholder="Search by name, slug, or description..."
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
              {
                id: "sort",
                label: "Sort By",
                value: sortBy,
                onChange: setSortBy,
                options: [
                  { label: "Recently Updated", value: "updated_desc" },
                  { label: "Name A-Z", value: "name_asc" },
                  { label: "Most Products", value: "products_desc" },
                ],
              },
            ]}
          />
        }
        footer={
          <ListViewPagination
            page={page}
            pageSize={PAGE_SIZE}
            total={filteredCategories.length}
            onPageChange={setPage}
          />
        }
      >
        <DataTable
          columns={columns}
          data={paginatedCategories}
          rowKey={(category) => category.id}
          emptyMessage={loadError || "No categories match your filters."}
        />
      </ListViewLayout>

      <AddCategorySheet
        open={isAddCategoryOpen}
        onOpenChange={setIsAddCategoryOpen}
        onSubmit={handleAddCategory}
      />

      <ViewCategorySheet
        open={isViewCategoryOpen}
        onOpenChange={setIsViewCategoryOpen}
        category={selectedCategory}
        onEdit={() => {
          setIsViewCategoryOpen(false);
          setIsEditCategoryOpen(true);
        }}
      />

      <EditCategorySheet
        open={isEditCategoryOpen}
        onOpenChange={setIsEditCategoryOpen}
        category={selectedCategory}
        onSubmit={handleUpdateCategory}
      />
    </>
  );
}
