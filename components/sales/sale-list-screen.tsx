"use client";

import {
  Download,
  Eye,
  Loader2,
  Plus,
  ShoppingBag,
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
import { CreateSaleSheet } from "@/components/sales/create-sale-sheet";
import type { SaleProductOption } from "@/components/sales/sale-form-fields";
import { SaleListLoader } from "@/components/sales/sale-list-loader";
import { SaleStatusBadge } from "@/components/sales/sale-status-badge";
import { ViewSaleSheet } from "@/components/sales/view-sale-sheet";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { fetchProductsList } from "@/lib/products";
import { buildSaleListParams } from "@/lib/sale-filters";
import {
  createSale,
  fetchSalesList,
  fetchSalesSummary,
} from "@/lib/sales";
import type { CreateSaleFormValues } from "@/schema/saleSchema";
import { formatMoney, type Sale } from "@/types/sale";

const PAGE_SIZE = 6;
const PRODUCT_OPTIONS_LIMIT = 100;

type SaleListScreenProps = {
  badge?: string;
  title?: string;
  description?: string;
  canCreate?: boolean;
  companyId?: string;
};

export function SaleListScreen({
  badge = "Operations",
  title = "Sales",
  description = "Record customer sales and track daily revenue. Stock deducts automatically.",
  canCreate = true,
  companyId = "all",
}: SaleListScreenProps) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [total, setTotal] = useState(0);
  const [summaryTodayCount, setSummaryTodayCount] = useState(0);
  const [summaryTodayAmount, setSummaryTodayAmount] = useState(0);
  const [summaryTotalAmount, setSummaryTotalAmount] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [loadError, setLoadError] = useState("");
  const [productOptions, setProductOptions] = useState<SaleProductOption[]>([]);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    let cancelled = false;

    async function loadOptions() {
      try {
        const productsResult = await fetchProductsList({
          page: 1,
          limit: PRODUCT_OPTIONS_LIMIT,
          status: "active",
        });

        if (cancelled) return;

        setProductOptions(
          productsResult.products.map((product) => ({
            label: `${product.name} (${product.sku})`,
            value: product.id,
            sellingPrice: product.sellingPrice,
          }))
        );
      } catch {
        if (!cancelled) setProductOptions([]);
      }
    }

    loadOptions();

    return () => {
      cancelled = true;
    };
  }, []);

  const loadSales = useCallback(async () => {
    setIsFetching(true);

    try {
      const [listResult, summary] = await Promise.all([
        fetchSalesList(
          buildSaleListParams({
            page,
            limit: PAGE_SIZE,
            search: debouncedSearch,
            fromDate,
            toDate,
            companyId,
          })
        ),
        fetchSalesSummary(
          companyId !== "all" ? Number(companyId) : undefined
        ).catch(() => null),
      ]);

      setSales(listResult.sales);
      setTotal(listResult.total);
      if (summary) {
        setSummaryTodayCount(summary.today.count);
        setSummaryTodayAmount(summary.today.amount);
        setSummaryTotalAmount(summary.total.amount);
      }
      setLoadError("");
    } catch (error: unknown) {
      setLoadError(
        error instanceof Error ? error.message : "Unable to load sales."
      );
    } finally {
      setIsFetching(false);
      setIsInitialLoading(false);
    }
  }, [companyId, debouncedSearch, fromDate, page, toDate]);

  useEffect(() => {
    loadSales();
  }, [loadSales]);

  const handleCreateSale = async (values: CreateSaleFormValues) => {
    const sale = await createSale(values);
    await loadSales();
    toast.success("Sale created successfully", {
      description: `Sale #${sale.id} for ${formatMoney(sale.totalAmount)}. Stock updated.`,
    });
  };

  const openViewSale = (sale: Sale) => {
    setSelectedSale(sale);
    setIsViewOpen(true);
  };

  const stats = useMemo(
    () => [
      { label: "Total Sales", value: total },
      {
        label: "Sales Today",
        value: summaryTodayCount,
        tone: "success" as const,
      },
      {
        label: "Today Amount",
        value: formatMoney(summaryTodayAmount),
        tone: "warning" as const,
      },
      {
        label: "Lifetime Revenue",
        value: formatMoney(summaryTotalAmount),
        tone: "success" as const,
      },
    ],
    [summaryTodayAmount, summaryTodayCount, summaryTotalAmount, total]
  );

  const hasActiveFilters =
    search.trim() !== "" || fromDate !== "" || toDate !== "";

  const handleClearFilters = () => {
    setSearch("");
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  const columns: DataTableColumn<Sale>[] = [
    {
      key: "sale",
      header: "Sale",
      render: (sale) => (
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
            <ShoppingBag className="size-4" />
          </div>
          <div>
            <p className="font-semibold text-foreground">
              {sale.customerName || "Walk-in"}
            </p>
            <p className="text-xs text-muted-foreground">#{sale.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: "seller",
      header: "Sold By",
      render: (sale) => sale.sellerName ?? "—",
    },
    {
      key: "items",
      header: "Items",
      render: (sale) => (
        <span className="font-medium">{sale.items.length}</span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (sale) => (
        <span className="font-semibold">{formatMoney(sale.totalAmount)}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (sale) => <SaleStatusBadge status={sale.status} />,
    },
    {
      key: "date",
      header: "Date",
      render: (sale) => (
        <span className="text-muted-foreground">{sale.createdAt}</span>
      ),
    },
    {
      key: "actions",
      header: "Action",
      headerClassName: "w-16",
      className: "text-right",
      render: (sale) => (
        <Button
          variant="ghost"
          size="icon-sm"
          className="rounded-lg text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
          aria-label={`View sale ${sale.id}`}
          onClick={() => openViewSale(sale)}
        >
          <Eye className="size-4" />
        </Button>
      ),
    },
  ];

  if (isInitialLoading) {
    return <SaleListLoader />;
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
                    buttonText="Create Sale"
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
            searchPlaceholder="Search by customer or notes..."
            hasActiveFilters={hasActiveFilters}
            onClear={handleClearFilters}
          >
            <Field className="min-w-[160px] flex-1 gap-2">
              <FieldLabel
                htmlFor="from_date"
                className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                From Date
              </FieldLabel>
              <Input
                id="from_date"
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
                htmlFor="to_date"
                className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                To Date
              </FieldLabel>
              <Input
                id="to_date"
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
            data={sales}
            rowKey={(sale) => sale.id}
            emptyMessage={loadError || "No sales match your filters."}
          />
        </div>
      </ListViewLayout>

      {canCreate ? (
        <CreateSaleSheet
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          productOptions={productOptions}
          onSubmit={handleCreateSale}
        />
      ) : null}

      <ViewSaleSheet
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        sale={selectedSale}
      />
    </>
  );
}
