"use client";

import {
  Download,
  Eye,
  Loader2,
  MoreHorizontal,
  Package,
  Pencil,
  SlidersHorizontal,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { UiButton } from "@/components/Button";
import { AdjustInventorySheet } from "@/components/inventory/adjust-inventory-sheet";
import { EditInventorySheet } from "@/components/inventory/edit-inventory-sheet";
import { InventoryListLoader } from "@/components/inventory/inventory-list-loader";
import { ViewInventorySheet } from "@/components/inventory/view-inventory-sheet";
import {
  DataTable,
  ListViewFilters,
  ListViewHeader,
  ListViewLayout,
  ListViewPagination,
  ListViewStats,
} from "@/components/list-view";
import type { DataTableColumn } from "@/components/list-view";
import { StockLevelBadge } from "@/components/products/stock-level-badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDebounce } from "@/hooks/use-debounce";
import { buildInventoryListParams } from "@/lib/inventory-filters";
import {
  adjustInventory,
  fetchInventoryList,
  updateInventory,
} from "@/lib/inventory";
import type {
  AdjustInventoryFormValues,
  EditInventoryFormValues,
} from "@/schema/inventorySchema";
import {
  formatInventoryQuantity,
  getInventoryStockLevel,
  type InventoryItem,
} from "@/types/inventory";

const PAGE_SIZE = 6;

type InventoryListScreenProps = {
  badge?: string;
  title?: string;
  description?: string;
  readOnly?: boolean;
  adjustOnly?: boolean;
  companyId?: string;
};

export function InventoryListScreen({
  badge = "Inventory",
  title = "Inventory",
  description = "Monitor warehouse stock levels, locations, and low-stock alerts.",
  readOnly = false,
  adjustOnly = false,
  companyId = "all",
}: InventoryListScreenProps) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [search, setSearch] = useState("");
  const [lowStock, setLowStock] = useState("all");
  const [page, setPage] = useState(1);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [loadError, setLoadError] = useState("");

  const debouncedSearch = useDebounce(search, 400);

  const loadInventory = useCallback(async () => {
    setIsFetching(true);

    try {
      const result = await fetchInventoryList(
        buildInventoryListParams({
          page,
          limit: PAGE_SIZE,
          search: debouncedSearch,
          lowStock,
          companyId,
        })
      );

      setItems(result.items);
      setTotal(result.total);
      setLoadError("");
    } catch (error: unknown) {
      setLoadError(
        error instanceof Error ? error.message : "Unable to load inventory."
      );
    } finally {
      setIsFetching(false);
      setIsInitialLoading(false);
    }
  }, [companyId, debouncedSearch, lowStock, page]);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const handleUpdateInventory = async (
    id: string,
    values: EditInventoryFormValues
  ) => {
    const item = await updateInventory(id, values);
    setSelectedItem(item);
    await loadInventory();
    toast.success("Stock updated successfully", {
      description: `${item.productName ?? "Item"} stock levels have been saved.`,
    });
  };

  const handleAdjustInventory = async (
    id: string,
    values: AdjustInventoryFormValues
  ) => {
    const item = await adjustInventory(id, values);
    setSelectedItem(item);
    await loadInventory();
    toast.success("Stock adjusted successfully", {
      description: `${item.productName ?? "Item"} is now at ${item.quantity} units.`,
    });
  };

  const openViewItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsViewOpen(true);
  };

  const openEditItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsEditOpen(true);
  };

  const openAdjustItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsAdjustOpen(true);
  };

  const stats = useMemo(
    () => [
      { label: "Total Items", value: total },
      {
        label: "Low Stock",
        value: items.filter(
          (item) => getInventoryStockLevel(item) === "low_stock"
        ).length,
        tone: "warning" as const,
      },
      {
        label: "Out of Stock",
        value: items.filter(
          (item) => getInventoryStockLevel(item) === "out_of_stock"
        ).length,
        tone: "danger" as const,
      },
      {
        label: "Units on Page",
        value: items.reduce((sum, item) => sum + item.quantity, 0),
        tone: "success" as const,
      },
    ],
    [items, total]
  );

  const hasActiveFilters = search.trim() !== "" || lowStock !== "all";

  const handleClearFilters = () => {
    setSearch("");
    setLowStock("all");
    setPage(1);
  };

  const canManage = !readOnly;
  const canEdit = canManage && !adjustOnly;
  const canAdjust = canManage;

  const columns: DataTableColumn<InventoryItem>[] = [
    {
      key: "product",
      header: "Product",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
            <Package className="size-4" />
          </div>
          <div>
            <p className="font-semibold text-foreground">
              {item.productName ?? "—"}
            </p>
            <p className="text-xs text-muted-foreground">
              {item.productSku ?? "—"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "quantity",
      header: "Quantity",
      render: (item) => (
        <span
          className={
            item.quantity <= item.minimumStock
              ? "font-semibold text-amber-600"
              : "font-semibold text-foreground"
          }
        >
          {formatInventoryQuantity(item.quantity)}
        </span>
      ),
    },
    {
      key: "thresholds",
      header: "Min / Max",
      render: (item) => (
        <span className="text-muted-foreground">
          {formatInventoryQuantity(item.minimumStock)} /{" "}
          {formatInventoryQuantity(item.maximumStock)}
        </span>
      ),
    },
    {
      key: "stock_level",
      header: "Stock Level",
      render: (item) => (
        <StockLevelBadge level={getInventoryStockLevel(item)} />
      ),
    },
    {
      key: "location",
      header: "Location",
      render: (item) => (
        <span className="text-muted-foreground">
          {item.warehouseLocation ?? "—"}
        </span>
      ),
    },
    {
      key: "updated",
      header: "Updated",
      render: (item) => (
        <span className="text-muted-foreground">{item.updatedAt}</span>
      ),
    },
    ...(canManage
      ? [
          {
            key: "actions",
            header: "Action",
            headerClassName: "w-32",
            className: "text-right",
            render: (item: InventoryItem) => (
              <div className="flex items-center justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-lg text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
                  aria-label={`View ${item.productName ?? "item"}`}
                  onClick={() => openViewItem(item)}
                >
                  <Eye className="size-4" />
                </Button>
                {canAdjust ? (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="rounded-lg text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
                    aria-label={`Adjust ${item.productName ?? "item"}`}
                    onClick={() => openAdjustItem(item)}
                  >
                    <SlidersHorizontal className="size-4" />
                  </Button>
                ) : null}
                {canEdit ? (
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
                      <DropdownMenuItem onClick={() => openViewItem(item)}>
                        <Eye className="size-4" />
                        View stock
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openAdjustItem(item)}>
                        <SlidersHorizontal className="size-4" />
                        Adjust stock
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditItem(item)}>
                        <Pencil className="size-4" />
                        Edit stock
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : null}
              </div>
            ),
          } satisfies DataTableColumn<InventoryItem>,
        ]
      : [
          {
            key: "actions",
            header: "Action",
            headerClassName: "w-16",
            className: "text-right",
            render: (item: InventoryItem) => (
              <Button
                variant="ghost"
                size="icon-sm"
                className="rounded-lg text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
                aria-label={`View ${item.productName ?? "item"}`}
                onClick={() => openViewItem(item)}
              >
                <Eye className="size-4" />
              </Button>
            ),
          } satisfies DataTableColumn<InventoryItem>,
        ]),
  ];

  if (isInitialLoading) {
    return <InventoryListLoader />;
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
              <UiButton variant="outline" buttonText="Export" icon={Download} />
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
            searchPlaceholder="Search by product name or SKU..."
            hasActiveFilters={hasActiveFilters}
            onClear={handleClearFilters}
            filters={[
              {
                id: "low_stock",
                label: "Stock Alert",
                value: lowStock,
                onChange: (value) => {
                  setLowStock(value);
                  setPage(1);
                },
                options: [
                  { label: "All Items", value: "all" },
                  { label: "Low Stock Only", value: "true" },
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
            data={items}
            rowKey={(item) => item.id}
            emptyMessage={loadError || "No inventory items match your filters."}
          />
        </div>
      </ListViewLayout>

      <ViewInventorySheet
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        item={selectedItem}
        readOnly={readOnly}
        adjustOnly={adjustOnly}
        onAdjust={
          canAdjust
            ? () => {
                setIsViewOpen(false);
                setIsAdjustOpen(true);
              }
            : undefined
        }
        onEdit={
          canEdit
            ? () => {
                setIsViewOpen(false);
                setIsEditOpen(true);
              }
            : undefined
        }
      />

      {canEdit ? (
        <EditInventorySheet
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          item={selectedItem}
          onSubmit={handleUpdateInventory}
        />
      ) : null}

      {canAdjust ? (
        <AdjustInventorySheet
          open={isAdjustOpen}
          onOpenChange={setIsAdjustOpen}
          item={selectedItem}
          onSubmit={handleAdjustInventory}
        />
      ) : null}
    </>
  );
}
