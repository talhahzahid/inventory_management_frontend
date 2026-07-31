"use client";

import {
  Download,
  Eye,
  Loader2,
  Mail,
  Phone,
  Plus,
  Truck,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { UiButton } from "@/components/Button";
import { AddSupplierSheet } from "@/components/suppliers/add-supplier-sheet";
import { SupplierListLoader } from "@/components/suppliers/supplier-list-loader";
import { SupplierStatusBadge } from "@/components/suppliers/supplier-status-badge";
import { ViewSupplierSheet } from "@/components/suppliers/view-supplier-sheet";
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
import { useDebounce } from "@/hooks/use-debounce";
import { buildSupplierListParams } from "@/lib/supplier-filters";
import { createSupplier, fetchSuppliersList } from "@/lib/suppliers";
import type { AddSupplierFormValues } from "@/schema/supplierSchema";
import type { Supplier, SupplierStatus } from "@/types/supplier";
import { supplierStatusLabels } from "@/types/supplier";

const PAGE_SIZE = 6;

type SupplierListScreenProps = {
  badge?: string;
  title?: string;
  description?: string;
  readOnly?: boolean;
  companyId?: string;
  /** Super admin must pick a company before creating suppliers */
  requireCompanyForCreate?: boolean;
};

export function SupplierListScreen({
  badge = "Operations",
  title = "Suppliers",
  description = "Manage your supplier contacts for purchase orders and inventory sourcing.",
  readOnly = false,
  companyId = "all",
  requireCompanyForCreate = false,
}: SupplierListScreenProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [total, setTotal] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [isViewSupplierOpen, setIsViewSupplierOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );
  const [loadError, setLoadError] = useState("");

  const debouncedSearch = useDebounce(search, 400);

  const loadSuppliers = useCallback(async () => {
    setIsFetching(true);

    try {
      const result = await fetchSuppliersList(
        buildSupplierListParams({
          page,
          limit: PAGE_SIZE,
          search: debouncedSearch,
          status,
          companyId,
        })
      );

      setSuppliers(result.suppliers);
      setTotal(result.total);
      setLoadError("");
    } catch (error: unknown) {
      setLoadError(
        error instanceof Error ? error.message : "Unable to load suppliers."
      );
    } finally {
      setIsFetching(false);
      setIsInitialLoading(false);
    }
  }, [companyId, debouncedSearch, page, status]);

  useEffect(() => {
    loadSuppliers();
  }, [loadSuppliers]);

  const handleAddSupplier = async (values: AddSupplierFormValues) => {
    if (requireCompanyForCreate && companyId === "all") {
      throw new Error("Select a company before creating a supplier.");
    }

    const scopedCompanyId =
      companyId !== "all" ? Number(companyId) : undefined;
    await createSupplier(values, scopedCompanyId);
    await loadSuppliers();
    toast.success("Supplier created successfully", {
      description: `${values.name} has been added to your supplier list.`,
    });
  };

  const openViewSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsViewSupplierOpen(true);
  };

  const stats = useMemo(
    () => [
      { label: "Total Suppliers", value: total },
      {
        label: "Active",
        value: suppliers.filter((s) => s.status === "active").length,
        tone: "success" as const,
      },
      {
        label: "Inactive",
        value: suppliers.filter((s) => s.status === "inactive").length,
        tone: "danger" as const,
      },
    ],
    [suppliers, total]
  );

  const hasActiveFilters = search.trim() !== "" || status !== "all";

  const handleClearFilters = () => {
    setSearch("");
    setStatus("all");
    setPage(1);
  };

  const columns: DataTableColumn<Supplier>[] = [
    {
      key: "supplier",
      header: "Supplier",
      render: (supplier) => (
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
            <Truck className="size-4" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{supplier.name}</p>
            <p className="text-xs text-muted-foreground">{supplier.address}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (supplier) => (
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <Phone className="size-3.5" />
          {supplier.phone}
        </span>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (supplier) => (
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <Mail className="size-3.5" />
          {supplier.email}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (supplier) => <SupplierStatusBadge status={supplier.status} />,
    },
    {
      key: "updated",
      header: "Updated",
      render: (supplier) => (
        <span className="text-muted-foreground">{supplier.updatedAt}</span>
      ),
    },
    {
      key: "actions",
      header: "Action",
      headerClassName: "w-20",
      className: "text-right",
      render: (supplier) => (
        <Button
          variant="ghost"
          size="icon-sm"
          className="rounded-lg text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
          aria-label={`View ${supplier.name}`}
          onClick={() => openViewSupplier(supplier)}
        >
          <Eye className="size-4" />
        </Button>
      ),
    },
  ];

  if (isInitialLoading) {
    return <SupplierListLoader />;
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
              readOnly ||
              (requireCompanyForCreate && companyId === "all") ? (
                <UiButton variant="outline" buttonText="Export" icon={Download} />
              ) : (
                <>
                  <UiButton variant="outline" buttonText="Export" icon={Download} />
                  <UiButton
                    variant="primary"
                    buttonText="Add Supplier"
                    icon={Plus}
                    onClick={() => setIsAddSupplierOpen(true)}
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
            searchPlaceholder="Search by supplier name..."
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
                  ...(Object.entries(supplierStatusLabels) as [
                    SupplierStatus,
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
            data={suppliers}
            rowKey={(supplier) => supplier.id}
            emptyMessage={loadError || "No suppliers match your filters."}
          />
        </div>
      </ListViewLayout>

      {!readOnly &&
      !(requireCompanyForCreate && companyId === "all") ? (
        <AddSupplierSheet
          open={isAddSupplierOpen}
          onOpenChange={setIsAddSupplierOpen}
          onSubmit={handleAddSupplier}
        />
      ) : null}

      <ViewSupplierSheet
        open={isViewSupplierOpen}
        onOpenChange={setIsViewSupplierOpen}
        supplier={selectedSupplier}
      />
    </>
  );
}
