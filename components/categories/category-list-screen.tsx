"use client";

import { Download, MoreHorizontal, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { UiButton } from "@/components/Button";
import { AddCategorySheet } from "@/components/categories/add-category-sheet";
import { CategoryListLoader } from "@/components/categories/category-list-loader";
import { CategoryStatusBadge } from "@/components/categories/category-status-badge";
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
import { createCategory, fetchCategories } from "@/lib/categories";
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

  useEffect(() => {
    let cancelled = false;

    fetchCategories()
      .then((data) => {
        if (!cancelled) {
          setCategories(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleAddCategory = async (values: AddCategoryFormValues) => {
    const category = await createCategory(values);
    setCategories((current) => [category, ...current]);
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
        <div>
          <p className="font-semibold text-foreground">{category.name}</p>
          <p className="text-xs text-muted-foreground">{category.slug}</p>
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
      headerClassName: "w-12",
      className: "text-right",
      render: () => (
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
            <DropdownMenuItem>Edit category</DropdownMenuItem>
            <DropdownMenuItem>View products</DropdownMenuItem>
            <DropdownMenuItem>Deactivate</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
          emptyMessage="No categories match your filters."
        />
      </ListViewLayout>

      <AddCategorySheet
        open={isAddCategoryOpen}
        onOpenChange={setIsAddCategoryOpen}
        onSubmit={handleAddCategory}
      />
    </>
  );
}
