"use client";

import { Download, MoreHorizontal, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { UiButton } from "@/components/Button";
import { AddCompanySheet } from "@/components/companies/add-company-sheet";
import {
  CompanyPlanBadge,
  CompanyStatusBadge,
} from "@/components/companies/company-badges";
import { CompanyListLoader } from "@/components/companies/company-list-loader";
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
import { createCompany, fetchCompanies } from "@/lib/companies";
import type { AddCompanyFormValues } from "@/schema/companySchema";
import type { Company, CompanyPlan, CompanyStatus } from "@/types/company";
import {
  companyPlanLabels,
  companyStatusLabels,
} from "@/types/company";

const PAGE_SIZE = 6;

export function CompanyListScreen() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [plan, setPlan] = useState("all");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("joined_desc");
  const [page, setPage] = useState(1);
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchCompanies()
      .then((data) => {
        if (!cancelled) {
          setCompanies(data);
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

  const handleAddCompany = async (values: AddCompanyFormValues) => {
    const company = await createCompany(values);
    setCompanies((current) => [company, ...current]);
  };

  const filteredCompanies = useMemo(() => {
    let result = [...companies];

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (company) =>
          company.name.toLowerCase().includes(query) ||
          company.email.toLowerCase().includes(query) ||
          company.adminName.toLowerCase().includes(query) ||
          company.adminEmail.toLowerCase().includes(query)
      );
    }

    if (plan !== "all") {
      result = result.filter((company) => company.plan === plan);
    }

    if (status !== "all") {
      result = result.filter((company) => company.status === status);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "users_desc":
          return b.users - a.users;
        case "joined_desc":
        default:
          return b.joinedAt.localeCompare(a.joinedAt);
      }
    });

    return result;
  }, [companies, search, plan, status, sortBy]);

  const paginatedCompanies = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredCompanies.slice(start, start + PAGE_SIZE);
  }, [filteredCompanies, page]);

  const stats = useMemo(
    () => [
      { label: "Total Companies", value: companies.length },
      {
        label: "Active",
        value: companies.filter((c) => c.status === "active").length,
        tone: "success" as const,
      },
      {
        label: "On Trial",
        value: companies.filter((c) => c.status === "trial").length,
        tone: "warning" as const,
      },
      {
        label: "Total Users",
        value: companies.reduce((sum, c) => sum + c.users, 0),
        tone: "default" as const,
      },
    ],
    [companies]
  );

  const hasActiveFilters =
    search.trim() !== "" || plan !== "all" || status !== "all";

  const handleClearFilters = () => {
    setSearch("");
    setPlan("all");
    setStatus("all");
    setSortBy("joined_desc");
    setPage(1);
  };

  const columns: DataTableColumn<Company>[] = [
    {
      key: "company",
      header: "Company",
      render: (company) => (
        <div>
          <p className="font-semibold text-foreground">{company.name}</p>
          <p className="text-xs text-muted-foreground">{company.email}</p>
        </div>
      ),
    },
    {
      key: "admin",
      header: "Admin",
      render: (company) => (
        <div>
          <p className="font-medium">{company.adminName}</p>
          <p className="text-xs text-muted-foreground">{company.adminEmail}</p>
        </div>
      ),
    },
    {
      key: "plan",
      header: "Plan",
      render: (company) => <CompanyPlanBadge plan={company.plan} />,
    },
    {
      key: "users",
      header: "Users",
      render: (company) => (
        <span className="font-semibold">{company.users}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (company) => <CompanyStatusBadge status={company.status} />,
    },
    {
      key: "joined",
      header: "Joined",
      render: (company) => (
        <span className="text-muted-foreground">{company.joinedAt}</span>
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
            <DropdownMenuItem>View company</DropdownMenuItem>
            <DropdownMenuItem>Edit plan</DropdownMenuItem>
            <DropdownMenuItem>Deactivate</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  if (isLoading) {
    return <CompanyListLoader />;
  }

  return (
    <>
      <ListViewLayout
        header={
          <ListViewHeader
            badge="Platform"
            title="Companies"
            description="Manage registered companies, subscriptions, and platform tenants."
            actions={
              <>
                <UiButton variant="outline" buttonText="Export" icon={Download} />
                <UiButton
                  variant="primary"
                  buttonText="Add Company"
                  icon={Plus}
                  onClick={() => setIsAddCompanyOpen(true)}
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
            searchPlaceholder="Search by company, admin, or email..."
            hasActiveFilters={hasActiveFilters}
            onClear={handleClearFilters}
            filters={[
              {
                id: "plan",
                label: "Plan",
                value: plan,
                onChange: (value) => {
                  setPlan(value);
                  setPage(1);
                },
                options: [
                  { label: "All Plans", value: "all" },
                  ...(Object.entries(companyPlanLabels) as [
                    CompanyPlan,
                    string,
                  ][]).map(([value, label]) => ({ label, value })),
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
                  ...(Object.entries(companyStatusLabels) as [
                    CompanyStatus,
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
                  { label: "Recently Joined", value: "joined_desc" },
                  { label: "Name A-Z", value: "name_asc" },
                  { label: "Most Users", value: "users_desc" },
                ],
              },
            ]}
          />
        }
        footer={
          <ListViewPagination
            page={page}
            pageSize={PAGE_SIZE}
            total={filteredCompanies.length}
            onPageChange={setPage}
          />
        }
      >
        <DataTable
          columns={columns}
          data={paginatedCompanies}
          rowKey={(company) => company.id}
          emptyMessage="No companies match your filters."
        />
      </ListViewLayout>

      <AddCompanySheet
        open={isAddCompanyOpen}
        onOpenChange={setIsAddCompanyOpen}
        onSubmit={handleAddCompany}
      />
    </>
  );
}
