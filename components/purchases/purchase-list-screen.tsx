"use client";

import {
  Download,
  Eye,
  Loader2,
  Plus,
  Truck,
} from "lucide-react";
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
import { CreatePurchaseSheet } from "@/components/purchases/create-purchase-sheet";
import type { PurchaseProductOption } from "@/components/purchases/purchase-form-fields";
import { PurchaseListLoader } from "@/components/purchases/purchase-list-loader";
import { PurchaseStatusBadge } from "@/components/purchases/purchase-status-badge";
import { ViewPurchaseSheet } from "@/components/purchases/view-purchase-sheet";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { fetchProductsList } from "@/lib/products";
import { buildPurchaseListParams } from "@/lib/purchase-filters";
import { createPurchase, fetchPurchasesList } from "@/lib/purchases";
import { fetchSuppliersList } from "@/lib/suppliers";
import type { CreatePurchaseFormValues } from "@/schema/purchaseSchema";
import type { Purchase } from "@/types/purchase";
import { formatMoney } from "@/types/sale";

const PAGE_SIZE = 6;
const OPTIONS_LIMIT = 100;

type PurchaseListScreenProps = {
  badge?: string;
  title?: string;
  description?: string;
  canCreate?: boolean;
  companyId?: string;
};

export function PurchaseListScreen({
  badge = "Operations",
  title = "Purchases",
  description = "Record supplier purchases and restock inventory. Stock increases automatically.",
  canCreate = true,
  companyId = "all",
}: PurchaseListScreenProps) {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [total, setTotal] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [search, setSearch] = useState("");
  const [supplierId, setSupplierId] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(
    null
  );
  const [loadError, setLoadError] = useState("");
  const [productOptions, setProductOptions] = useState<PurchaseProductOption[]>(
    []
  );
  const [supplierOptions, setSupplierOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    let cancelled = false;

    async function loadOptions() {
      try {
        const [productsResult, suppliersResult] = await Promise.all([
          fetchProductsList({
            page: 1,
            limit: OPTIONS_LIMIT,
            status: "active",
          }),
          fetchSuppliersList({
            page: 1,
            limit: OPTIONS_LIMIT,
            status: "active",
          }),
        ]);

        if (cancelled) return;

        setProductOptions(
          productsResult.products.map((product) => ({
            label: `${product.name} (${product.sku})`,
            value: product.id,
            purchasePrice: product.purchasePrice,
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
          setProductOptions([]);
          setSupplierOptions([]);
        }
      }
    }

    loadOptions();

    return () => {
      cancelled = true;
    };
  }, []);

  const loadPurchases = useCallback(async () => {
    setIsFetching(true);

    try {
      const result = await fetchPurchasesList(
        buildPurchaseListParams({
          page,
          limit: PAGE_SIZE,
          search: debouncedSearch,
          supplierId,
          fromDate,
          toDate,
          companyId,
        })
      );

      setPurchases(result.purchases);
      setTotal(result.total);
      setLoadError("");
    } catch (error: unknown) {
      setLoadError(
        error instanceof Error ? error.message : "Unable to load purchases."
      );
    } finally {
      setIsFetching(false);
      setIsInitialLoading(false);
    }
  }, [companyId, debouncedSearch, fromDate, page, supplierId, toDate]);

  useEffect(() => {
    loadPurchases();
  }, [loadPurchases]);

  const handleCreatePurchase = async (values: CreatePurchaseFormValues) => {
    const purchase = await createPurchase(values);
    await loadPurchases();
    toast.success("Purchase created successfully", {
      description: `Purchase #${purchase.id} for ${formatMoney(purchase.totalAmount)}. Stock updated.`,
    });
  };

  const openViewPurchase = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setIsViewOpen(true);
  };

  const stats = useMemo(
    () => [
      { label: "Total Purchases", value: total },
      {
        label: "On This Page",
        value: purchases.length,
        tone: "success" as const,
      },
      {
        label: "Page Amount",
        value: formatMoney(
          purchases.reduce((sum, item) => sum + item.totalAmount, 0)
        ),
        tone: "warning" as const,
      },
      {
        label: "Line Items",
        value: purchases.reduce((sum, item) => sum + item.items.length, 0),
        tone: "success" as const,
      },
    ],
    [purchases, total]
  );

  const hasActiveFilters =
    search.trim() !== "" ||
    supplierId !== "all" ||
    fromDate !== "" ||
    toDate !== "";

  const handleClearFilters = () => {
    setSearch("");
    setSupplierId("all");
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  const columns: DataTableColumn<Purchase>[] = [
    {
      key: "purchase",
      header: "Purchase",
      render: (purchase) => (
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
            <Truck className="size-4" />
          </div>
          <div>
            <p className="font-semibold text-foreground">
              {purchase.supplierName ?? "Supplier"}
            </p>
            <p className="text-xs text-muted-foreground">#{purchase.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: "buyer",
      header: "Purchased By",
      render: (purchase) => purchase.buyerName ?? "—",
    },
    {
      key: "items",
      header: "Items",
      render: (purchase) => (
        <span className="font-medium">{purchase.items.length}</span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (purchase) => (
        <span className="font-semibold">
          {formatMoney(purchase.totalAmount)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (purchase) => (
        <PurchaseStatusBadge status={purchase.status} />
      ),
    },
    {
      key: "date",
      header: "Date",
      render: (purchase) => (
        <span className="text-muted-foreground">{purchase.createdAt}</span>
      ),
    },
    {
      key: "actions",
      header: "Action",
      headerClassName: "w-16",
      className: "text-right",
      render: (purchase) => (
        <Button
          variant="ghost"
          size="icon-sm"
          className="rounded-lg text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
          aria-label={`View purchase ${purchase.id}`}
          onClick={() => openViewPurchase(purchase)}
        >
          <Eye className="size-4" />
        </Button>
      ),
    },
  ];

  if (isInitialLoading) {
    return <PurchaseListLoader />;
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
              <>
                <UiButton variant="outline" buttonText="Export" icon={Download} />
                {canCreate ? (
                  <UiButton
                    variant="primary"
                    buttonText="Create Purchase"
                    icon={Plus}
                    onClick={() => setIsCreateOpen(true)}
                  />
                ) : null}
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
            searchPlaceholder="Search by notes..."
            hasActiveFilters={hasActiveFilters}
            onClear={handleClearFilters}
            filters={[
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
            ]}
          >
            <Field className="min-w-[160px] flex-1 gap-2">
              <FieldLabel
                htmlFor="purchase_from_date"
                className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                From Date
              </FieldLabel>
              <Input
                id="purchase_from_date"
                type="date"
                value={fromDate}
                onChange={(event) => {
                  setFromDate(event.target.value);
                  setPage(1);
                }}
                className="h-10 rounded-xl bg-white"
              />
            </Field>
            <Field className="min-w-[160px] flex-1 gap-2">
              <FieldLabel
                htmlFor="purchase_to_date"
                className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                To Date
              </FieldLabel>
              <Input
                id="purchase_to_date"
                type="date"
                value={toDate}
                onChange={(event) => {
                  setToDate(event.target.value);
                  setPage(1);
                }}
                className="h-10 rounded-xl bg-white"
              />
            </Field>
          </ListViewFilters>
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
            data={purchases}
            rowKey={(purchase) => purchase.id}
            emptyMessage={loadError || "No purchases match your filters."}
          />
        </div>
      </ListViewLayout>

      {canCreate ? (
        <CreatePurchaseSheet
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          productOptions={productOptions}
          supplierOptions={supplierOptions}
          onSubmit={handleCreatePurchase}
        />
      ) : null}

      <ViewPurchaseSheet
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        purchase={selectedPurchase}
      />
    </>
  );
}
