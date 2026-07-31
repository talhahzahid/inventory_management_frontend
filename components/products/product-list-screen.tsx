"use client";

import {
  Download,
  Eye,
  Loader2,
  MoreHorizontal,
  Package,
  Pencil,
  Plus,
  Power,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { UiButton } from "@/components/Button";
import {
  DataTable,
  ListViewFilters,
  ListViewHeader,
  ListViewLayout,
  ListViewPagination,
  ListViewStats,
} from "@/components/list-view";
import type { DataTableColumn } from "@/components/list-view";
import { AddProductSheet } from "@/components/products/add-product-sheet";
import { EditProductSheet } from "@/components/products/edit-product-sheet";
import { ProductListLoader } from "@/components/products/product-list-loader";
import { ProductStatusBadge } from "@/components/products/product-status-badge";
import { StockLevelBadge } from "@/components/products/stock-level-badge";
import { ViewProductSheet } from "@/components/products/view-product-sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDebounce } from "@/hooks/use-debounce";
import { fetchCategoriesList } from "@/lib/categories";
import { buildProductListParams } from "@/lib/product-filters";
import {
  createProduct,
  deactivateProduct,
  fetchProductsList,
  updateProduct,
} from "@/lib/products";
import { fetchSuppliersList } from "@/lib/suppliers";
import type { AddProductFormValues, EditProductFormValues } from "@/schema/productSchema";
import {
  formatProductPrice,
  getProductStockLevel,
  type Product,
  type ProductStatus,
  productStatusLabels,
} from "@/types/product";

const PAGE_SIZE = 6;
const FILTER_OPTIONS_LIMIT = 100;

type ProductListScreenProps = {
  badge?: string;
  title?: string;
  description?: string;
  readOnly?: boolean;
  createHref?: string;
  companyId?: string;
};

export function ProductListScreen({
  badge = "Inventory",
  title = "Products",
  description = "Manage product catalog, pricing, stock levels, and availability.",
  readOnly = false,
  createHref = "/company/products/new",
  companyId = "all",
}: ProductListScreenProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [supplierId, setSupplierId] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isViewProductOpen, setIsViewProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loadError, setLoadError] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [supplierOptions, setSupplierOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    let cancelled = false;

    async function loadFilterOptions() {
      try {
        const [categoriesResult, suppliersResult] = await Promise.all([
          fetchCategoriesList({ page: 1, limit: FILTER_OPTIONS_LIMIT, status: "active" }),
          fetchSuppliersList({ page: 1, limit: FILTER_OPTIONS_LIMIT, status: "active" }),
        ]);

        if (cancelled) return;

        setCategoryOptions(
          categoriesResult.categories.map((category) => ({
            label: category.name,
            value: category.id,
          }))
        );
        setSupplierOptions(
          suppliersResult.suppliers.map((supplier) => ({
            label: supplier.name,
            value: supplier.id,
          }))
        );
      } catch {
        if (!cancelled) {
          setCategoryOptions([]);
          setSupplierOptions([]);
        }
      }
    }

    loadFilterOptions();

    return () => {
      cancelled = true;
    };
  }, []);

  const loadProducts = useCallback(async () => {
    setIsFetching(true);

    try {
      const result = await fetchProductsList(
        buildProductListParams({
          page,
          limit: PAGE_SIZE,
          search: debouncedSearch,
          status,
          categoryId,
          supplierId,
          companyId,
        })
      );

      setProducts(result.products);
      setTotal(result.total);
      setLoadError("");
    } catch (error: unknown) {
      setLoadError(
        error instanceof Error ? error.message : "Unable to load products."
      );
    } finally {
      setIsFetching(false);
      setIsInitialLoading(false);
    }
  }, [categoryId, companyId, debouncedSearch, page, status, supplierId]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleAddProduct = async (values: AddProductFormValues) => {
    await createProduct(values);
    await loadProducts();
    toast.success("Product created successfully", {
      description: `${values.name} has been added to your catalog.`,
    });
  };

  const handleUpdateProduct = async (
    id: string,
    values: EditProductFormValues
  ) => {
    const product = await updateProduct(id, values);
    setSelectedProduct(product);
    await loadProducts();
    toast.success("Product updated successfully", {
      description: `${product.name} has been saved.`,
    });
  };

  const handleDeactivateProduct = async (product: Product) => {
    try {
      await deactivateProduct(product.id);
      await loadProducts();
      toast.success("Product deactivated", {
        description: `${product.name} is now inactive.`,
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to deactivate product."
      );
    }
  };

  const openViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsViewProductOpen(true);
  };

  const openEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditProductOpen(true);
  };

  const stats = useMemo(
    () => [
      { label: "Total Products", value: total },
      {
        label: "Active",
        value: products.filter((product) => product.status === "active").length,
        tone: "success" as const,
      },
      {
        label: "Low Stock",
        value: products.filter(
          (product) => getProductStockLevel(product) === "low_stock"
        ).length,
        tone: "warning" as const,
      },
      {
        label: "Out of Stock",
        value: products.filter(
          (product) => getProductStockLevel(product) === "out_of_stock"
        ).length,
        tone: "danger" as const,
      },
    ],
    [products, total]
  );

  const hasActiveFilters =
    search.trim() !== "" ||
    categoryId !== "all" ||
    supplierId !== "all" ||
    status !== "all";

  const handleClearFilters = () => {
    setSearch("");
    setCategoryId("all");
    setSupplierId("all");
    setStatus("all");
    setPage(1);
  };

  const columns: DataTableColumn<Product>[] = [
    {
      key: "product",
      header: "Product",
      render: (product) => (
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
            <Package className="size-4" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{product.name}</p>
            <p className="text-xs text-muted-foreground">{product.sku}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (product) => (
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
          {product.categoryName ?? "—"}
        </span>
      ),
    },
    {
      key: "supplier",
      header: "Supplier",
      render: (product) => product.supplierName ?? "—",
    },
    {
      key: "selling_price",
      header: "Selling Price",
      render: (product) => (
        <span className="font-semibold">
          {formatProductPrice(product.sellingPrice)}
        </span>
      ),
    },
    {
      key: "stock",
      header: "Stock",
      render: (product) => {
        const quantity = product.inventory?.quantity ?? 0;
        const minimumStock = product.inventory?.minimumStock ?? 0;

        return (
          <span
            className={
              quantity <= minimumStock
                ? "font-semibold text-amber-600"
                : "font-medium text-foreground"
            }
          >
            {quantity}
          </span>
        );
      },
    },
    {
      key: "stock_level",
      header: "Stock Level",
      render: (product) => (
        <StockLevelBadge level={getProductStockLevel(product)} />
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (product) => <ProductStatusBadge status={product.status} />,
    },
    {
      key: "updated",
      header: "Updated",
      render: (product) => (
        <span className="text-muted-foreground">{product.updatedAt}</span>
      ),
    },
    ...(readOnly
      ? [
          {
            key: "actions",
            header: "Action",
            headerClassName: "w-16",
            className: "text-right",
            render: (product: Product) => (
              <Button
                variant="ghost"
                size="icon-sm"
                className="rounded-lg text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
                aria-label={`View ${product.name}`}
                onClick={() => openViewProduct(product)}
              >
                <Eye className="size-4" />
              </Button>
            ),
          } satisfies DataTableColumn<Product>,
        ]
      : [
          {
            key: "actions",
            header: "Action",
            headerClassName: "w-32",
            className: "text-right",
            render: (product: Product) => (
              <div className="flex items-center justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-lg text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
                  aria-label={`View ${product.name}`}
                  onClick={() => openViewProduct(product)}
                >
                  <Eye className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-lg text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
                  aria-label={`Edit ${product.name}`}
                  onClick={() => openEditProduct(product)}
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
                    <DropdownMenuItem onClick={() => openViewProduct(product)}>
                      <Eye className="size-4" />
                      View product
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openEditProduct(product)}>
                      <Pencil className="size-4" />
                      Edit product
                    </DropdownMenuItem>
                    {product.status === "active" ? (
                      <DropdownMenuItem
                        onClick={() => handleDeactivateProduct(product)}
                      >
                        <Power className="size-4" />
                        Deactivate
                      </DropdownMenuItem>
                    ) : null}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ),
          } satisfies DataTableColumn<Product>,
        ]),
  ];

  if (isInitialLoading) {
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
            searchPlaceholder="Search by name or SKU..."
            hasActiveFilters={hasActiveFilters}
            onClear={handleClearFilters}
            filters={[
              {
                id: "category",
                label: "Category",
                value: categoryId,
                onChange: (value) => {
                  setCategoryId(value);
                  setPage(1);
                },
                options: [
                  { label: "All Categories", value: "all" },
                  ...categoryOptions,
                ],
              },
              {
                id: "supplier",
                label: "Supplier",
                value: supplierId,
                onChange: (value) => {
                  setSupplierId(value);
                  setPage(1);
                },
                options: [
                  { label: "All Suppliers", value: "all" },
                  ...supplierOptions,
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
                  ...(Object.entries(productStatusLabels) as [
                    ProductStatus,
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
            data={products}
            rowKey={(product) => product.id}
            emptyMessage={loadError || "No products match your filters."}
          />
        </div>
      </ListViewLayout>

      {!readOnly ? (
        <AddProductSheet
          open={isAddProductOpen}
          onOpenChange={setIsAddProductOpen}
          categoryOptions={categoryOptions}
          supplierOptions={supplierOptions}
          onSubmit={handleAddProduct}
        />
      ) : null}

      <ViewProductSheet
        open={isViewProductOpen}
        onOpenChange={setIsViewProductOpen}
        product={selectedProduct}
        readOnly={readOnly}
        onEdit={
          readOnly
            ? undefined
            : () => {
                setIsViewProductOpen(false);
                setIsEditProductOpen(true);
              }
        }
      />

      {!readOnly ? (
        <EditProductSheet
          open={isEditProductOpen}
          onOpenChange={setIsEditProductOpen}
          product={selectedProduct}
          categoryOptions={categoryOptions}
          supplierOptions={supplierOptions}
          onSubmit={handleUpdateProduct}
        />
      ) : null}
    </>
  );
}
