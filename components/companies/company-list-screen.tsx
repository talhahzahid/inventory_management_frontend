"use client";

import {
  Building2,
  Download,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  Power,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { UiButton } from "@/components/Button";
import { AddCompanySheet } from "@/components/companies/add-company-sheet";
import { CompanyStatusBadge } from "@/components/companies/company-badges";
import { CompanyListLoader } from "@/components/companies/company-list-loader";
import { EditCompanySheet } from "@/components/companies/edit-company-sheet";
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
import {
  createCompany,
  deactivateCompany,
  fetchCompaniesList,
  updateCompany,
} from "@/lib/companies";
import type { AddCompanyFormValues } from "@/schema/companySchema";
import type { Company, CompanyStatus } from "@/types/company";
import { companyStatusLabels } from "@/types/company";

const PAGE_SIZE = 6;

export function CompanyListScreen() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [total, setTotal] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [loadError, setLoadError] = useState("");

  const debouncedSearch = useDebounce(search, 400);

  const loadCompanies = useCallback(async () => {
    setIsFetching(true);
    try {
      const result = await fetchCompaniesList({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
        status,
      });
      setCompanies(result.companies);
      setTotal(result.total);
      setLoadError("");
    } catch (error: unknown) {
      setLoadError(
        error instanceof Error ? error.message : "Unable to load companies."
      );
    } finally {
      setIsFetching(false);
      setIsInitialLoading(false);
    }
  }, [debouncedSearch, page, status]);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  // const handleAdd = async (values: AddCompanyFormValues) => {
  //   await createCompany(values);
  //   await loadCompanies();
  //   toast.success("Company created successfully", {
  //     description: `${values.name} has been registered. Admin credentials were emailed.`,
  //   });
  // };

  // handleAdd
const handleAdd = async (values: AddCompanyFormValues) => {
  await createCompany(values);
  await loadCompanies();
  toast.success("Company created successfully", {
    description: `${values.name} has been registered. Admin credentials were emailed.`,
  });
};

  const handleUpdate = async (id: string, values: AddCompanyFormValues) => {
    const company = await updateCompany(id, values);
    setSelectedCompany(company);
    await loadCompanies();
    toast.success("Company updated successfully", {
      description: `${company.name} has been saved.`,
    });
  };

  const handleDeactivate = async (company: Company) => {
    try {
      await deactivateCompany(company.id);
      await loadCompanies();
      toast.success("Company deactivated", {
        description: `${company.name} is now inactive.`,
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to deactivate company."
      );
    }
  };

  const stats = useMemo(
    () => [
      { label: "Total Companies", value: total },
      {
        label: "Active",
        value: companies.filter((c) => c.status === "active").length,
        tone: "success" as const,
      },
      {
        label: "Inactive",
        value: companies.filter((c) => c.status === "inactive").length,
        tone: "danger" as const,
      },
      {
        label: "On This Page",
        value: companies.length,
        tone: "warning" as const,
      },
    ],
    [companies, total]
  );

  const hasActiveFilters = search.trim() !== "" || status !== "all";

  const columns: DataTableColumn<Company>[] = [
    {
      key: "company",
      header: "Company",
      render: (company) => (
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
            <Building2 className="size-4" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{company.name}</p>
            <p className="text-xs text-muted-foreground">{company.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (company) => (
        <span className="text-muted-foreground">{company.email}</span>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (company) => (
        <span className="text-muted-foreground">{company.phone || "—"}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (company) => <CompanyStatusBadge status={company.status} />,
    },
    {
      key: "updated",
      header: "Updated",
      render: (company) => (
        <span className="text-muted-foreground">{company.updatedAt}</span>
      ),
    },
    {
      key: "actions",
      header: "Action",
      headerClassName: "w-32",
      className: "text-right",
      render: (company) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            className="rounded-lg text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
            aria-label={`Edit ${company.name}`}
            onClick={() => {
              setSelectedCompany(company);
              setIsEditOpen(true);
            }}
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
              <DropdownMenuItem
                onClick={() => {
                  setSelectedCompany(company);
                  setIsEditOpen(true);
                }}
              >
                <Pencil className="size-4" />
                Edit company
              </DropdownMenuItem>
              {company.status === "active" ? (
                <DropdownMenuItem onClick={() => handleDeactivate(company)}>
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

  if (isInitialLoading) return <CompanyListLoader />;

  return (
    <>
      <ListViewLayout
        header={
          <ListViewHeader
            badge="Platform"
            title="Companies"
            description="Manage tenant companies on the StockFlow platform."
            actions={
              <>
                <UiButton variant="outline" buttonText="Export" icon={Download} />
                <UiButton
                  variant="primary"
                  buttonText="Add Company"
                  icon={Plus}
                  onClick={() => setIsAddOpen(true)}
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
            searchPlaceholder="Search by company name or email..."
            hasActiveFilters={hasActiveFilters}
            onClear={() => {
              setSearch("");
              setStatus("all");
              setPage(1);
            }}
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
                  ...(Object.entries(companyStatusLabels) as [
                    CompanyStatus,
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
            data={companies}
            rowKey={(company) => company.id}
            emptyMessage={loadError || "No companies match your filters."}
          />
        </div>
      </ListViewLayout>

      <AddCompanySheet
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSubmit={handleAdd}
      />
      <EditCompanySheet
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        company={selectedCompany}
        onSubmit={handleUpdate}
      />
    </>
  );
}
