"use client";

import { Download, MoreHorizontal, Plus, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { UiButton } from "@/components/Button";
import {
  DataTable,
  ListViewFilters,
  ListViewHeader,
  ListViewLayout,
  ListViewPagination,
  ListViewStats,
  StatusBadge,
} from "@/components/list-view";
import type { DataTableColumn } from "@/components/list-view";
import { AddProductSheet } from "@/components/products/add-product-sheet";
import { ProductListLoader } from "@/components/products/product-list-loader";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createProduct, fetchProducts } from "@/lib/products";
import type { AddProductFormValues } from "@/schema/productSchema";
import type { Product, ProductStatus } from "@/types/product";
import { productCategories, productStatusLabels } from "@/types/product";

const PAGE_SIZE = 6;

type ProductListScreenProps = {
  badge?: string;
  title?: string;
  description?: string;
  readOnly?: boolean;
  createHref?: string;
};

export function ProductListScreen({
  badge = "Inventory",
  title = "Products",
  description = "Manage product catalog, pricing, stock levels, and availability.",
  readOnly = false,
  createHref = "/company/products/new",
}: ProductListScreenProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("updated_desc");
  const [page, setPage] = useState(1);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchProducts()
      .then((data) => {
        if (!cancelled) {
          setProducts(data);
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

  const handleAddProduct = async (values: AddProductFormValues) => {
    const product = await createProduct(values);
    setProducts((current) => [product, ...current]);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query) ||
          product.supplier.toLowerCase().includes(query)
      );
    }

    if (category !== "all") {
      result = result.filter((product) => product.category === category);
    }

    if (status !== "all") {
      result = result.filter((product) => product.status === status);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "price_desc":
          return b.price - a.price;
        case "stock_asc":
          return a.stock - b.stock;
        case "updated_desc":
        default:
          return b.updatedAt.localeCompare(a.updatedAt);
      }
    });

    return result;
  }, [products, search, category, status, sortBy]);

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, page]);

  const stats = useMemo(
    () => [
      { label: "Total Products", value: products.length },
      {
        label: "In Stock",
        value: products.filter((p) => p.status === "in_stock").length,
        tone: "success" as const,
      },
      {
        label: "Low Stock",
        value: products.filter((p) => p.status === "low_stock").length,
        tone: "warning" as const,
      },
      {
        label: "Out of Stock",
        value: products.filter((p) => p.status === "out_of_stock").length,
        tone: "danger" as const,
      },
    ],
    [products]
  );

  const hasActiveFilters =
    search.trim() !== "" || category !== "all" || status !== "all";

  const handleClearFilters = () => {
    setSearch("");
    setCategory("all");
    setStatus("all");
    setSortBy("updated_desc");
    setPage(1);
  };

  const columns: DataTableColumn<Product>[] = [
    {
      key: "product",
      header: "Product",
      render: (product) => (
        <div>
          <p className="font-semibold text-foreground">{product.name}</p>
          <p className="text-xs text-muted-foreground">{product.sku}</p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (product) => (
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
          {product.category}
        </span>
      ),
    },
    {
      key: "supplier",
      header: "Supplier",
      render: (product) => product.supplier,
    },
    {
      key: "price",
      header: "Price",
      render: (product) => (
        <span className="font-semibold">${product.price.toFixed(2)}</span>
      ),
    },
    {
      key: "stock",
      header: "Stock",
      render: (product) => (
        <span
          className={
            product.stock <= 10
              ? "font-semibold text-amber-600"
              : "font-medium text-foreground"
          }
        >
          {product.stock}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (product) => <StatusBadge status={product.status} />,
    },
    {
      key: "updated",
      header: "Updated",
      render: (product) => (
        <span className="text-muted-foreground">{product.updatedAt}</span>
      ),
    },
    ...(readOnly
      ? []
      : [
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
                  <DropdownMenuItem>Edit product</DropdownMenuItem>
                  <DropdownMenuItem>Update stock</DropdownMenuItem>
                  <DropdownMenuItem>View history</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ),
          } satisfies DataTableColumn<Product>,
        ]),
  ];

  if (isLoading) {
    return <ProductListLoader />;
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
                  <UiButton variant="outline" buttonText="Import" icon={Upload} />
                  <UiButton variant="outline" buttonText="Export" icon={Download} />
                  <Link href={createHref}>
                    <UiButton variant="primary" buttonText="Add Product" icon={Plus} />
                  </Link>
                  <UiButton
                    variant="outline"
                    buttonText="Quick Add"
                    icon={Plus}
                    onClick={() => setIsAddProductOpen(true)}
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
            searchPlaceholder="Search by name, SKU, or supplier..."
            hasActiveFilters={hasActiveFilters}
            onClear={handleClearFilters}
            filters={[
              {
                id: "category",
                label: "Category",
                value: category,
                onChange: (value) => {
                  setCategory(value);
                  setPage(1);
                },
                options: [
                  { label: "All Categories", value: "all" },
                  ...productCategories
                    .filter((item) => item !== "All Categories")
                    .map((item) => ({ label: item, value: item })),
                ],
              },
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
                  ...(Object.entries(productStatusLabels) as [ProductStatus, string][]).map(
                    ([value, label]) => ({ label, value })
                  ),
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
                  { label: "Price High-Low", value: "price_desc" },
                  { label: "Stock Low-High", value: "stock_asc" },
                ],
              },
            ]}
          />
        }
        footer={
          <ListViewPagination
            page={page}
            pageSize={PAGE_SIZE}
            total={filteredProducts.length}
            onPageChange={setPage}
          />
        }
      >
        <DataTable
          columns={columns}
          data={paginatedProducts}
          rowKey={(product) => product.id}
          emptyMessage="No products match your filters."
        />
      </ListViewLayout>

      {!readOnly ? (
        <AddProductSheet
          open={isAddProductOpen}
          onOpenChange={setIsAddProductOpen}
          onSubmit={handleAddProduct}
        />
      ) : null}
    </>
  );
}
