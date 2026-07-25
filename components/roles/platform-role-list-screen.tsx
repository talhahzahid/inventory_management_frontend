"use client";

import { Download, MoreHorizontal, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { UiButton } from "@/components/Button";
import { AddPlatformRoleSheet } from "@/components/roles/add-platform-role-sheet";
import {
  PlatformRoleScopeBadge,
  PlatformRoleStatusBadge,
} from "@/components/roles/platform-role-badges";
import { PlatformRoleListLoader } from "@/components/roles/platform-role-list-loader";
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
  createPlatformRole,
  fetchPlatformRoles,
} from "@/lib/platform-roles";
import type { AddPlatformRoleFormValues } from "@/schema/platformRoleSchema";
import type {
  PlatformRole,
  PlatformRoleScope,
  PlatformRoleStatus,
} from "@/types/platform-role";
import {
  platformRoleScopeLabels,
  platformRoleStatusLabels,
} from "@/types/platform-role";

const PAGE_SIZE = 6;

export function PlatformRoleListScreen() {
  const [roles, setRoles] = useState<PlatformRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [scope, setScope] = useState("all");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("updated_desc");
  const [page, setPage] = useState(1);
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchPlatformRoles()
      .then((data) => {
        if (!cancelled) {
          setRoles(data);
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

  const handleAddRole = async (values: AddPlatformRoleFormValues) => {
    const role = await createPlatformRole(values);
    setRoles((current) => [role, ...current]);
  };

  const filteredRoles = useMemo(() => {
    let result = [...roles];

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (role) =>
          role.name.toLowerCase().includes(query) ||
          role.slug.toLowerCase().includes(query) ||
          role.description?.toLowerCase().includes(query)
      );
    }

    if (scope !== "all") {
      result = result.filter((role) => role.scope === scope);
    }

    if (status !== "all") {
      result = result.filter((role) => role.status === status);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "users_desc":
          return b.userCount - a.userCount;
        case "updated_desc":
        default:
          return b.updatedAt.localeCompare(a.updatedAt);
      }
    });

    return result;
  }, [roles, search, scope, status, sortBy]);

  const paginatedRoles = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredRoles.slice(start, start + PAGE_SIZE);
  }, [filteredRoles, page]);

  const stats = useMemo(
    () => [
      { label: "Total Roles", value: roles.length },
      {
        label: "Platform Roles",
        value: roles.filter((r) => r.scope === "platform").length,
        tone: "default" as const,
      },
      {
        label: "Company Roles",
        value: roles.filter((r) => r.scope === "company").length,
        tone: "success" as const,
      },
      {
        label: "Active",
        value: roles.filter((r) => r.status === "active").length,
        tone: "warning" as const,
      },
    ],
    [roles]
  );

  const hasActiveFilters =
    search.trim() !== "" || scope !== "all" || status !== "all";

  const handleClearFilters = () => {
    setSearch("");
    setScope("all");
    setStatus("all");
    setSortBy("updated_desc");
    setPage(1);
  };

  const columns: DataTableColumn<PlatformRole>[] = [
    {
      key: "role",
      header: "Role",
      render: (role) => (
        <div>
          <p className="font-semibold text-foreground">{role.name}</p>
          <p className="text-xs text-muted-foreground">{role.slug}</p>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (role) => (
        <span className="text-muted-foreground">
          {role.description ?? "—"}
        </span>
      ),
    },
    {
      key: "scope",
      header: "Scope",
      render: (role) => <PlatformRoleScopeBadge scope={role.scope} />,
    },
    {
      key: "users",
      header: "Users",
      render: (role) => (
        <span className="font-semibold">{role.userCount}</span>
      ),
    },
    {
      key: "permissions",
      header: "Permissions",
      render: (role) => (
        <span className="font-medium text-muted-foreground">
          {role.permissionCount}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (role) => <PlatformRoleStatusBadge status={role.status} />,
    },
    {
      key: "updated",
      header: "Updated",
      render: (role) => (
        <span className="text-muted-foreground">{role.updatedAt}</span>
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
            <DropdownMenuItem>Edit role</DropdownMenuItem>
            <DropdownMenuItem>Manage permissions</DropdownMenuItem>
            <DropdownMenuItem>Deactivate</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  if (isLoading) {
    return <PlatformRoleListLoader />;
  }

  return (
    <>
      <ListViewLayout
        header={
          <ListViewHeader
            badge="System"
            title="Roles"
            description="Manage platform and company roles, access levels, and permissions."
            actions={
              <>
                <UiButton variant="outline" buttonText="Export" icon={Download} />
                <UiButton
                  variant="primary"
                  buttonText="Add Role"
                  icon={Plus}
                  onClick={() => setIsAddRoleOpen(true)}
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
            searchPlaceholder="Search by role name, slug, or description..."
            hasActiveFilters={hasActiveFilters}
            onClear={handleClearFilters}
            filters={[
              {
                id: "scope",
                label: "Scope",
                value: scope,
                onChange: (value) => {
                  setScope(value);
                  setPage(1);
                },
                options: [
                  { label: "All Scopes", value: "all" },
                  ...(Object.entries(platformRoleScopeLabels) as [
                    PlatformRoleScope,
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
                  ...(Object.entries(platformRoleStatusLabels) as [
                    PlatformRoleStatus,
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
            total={filteredRoles.length}
            onPageChange={setPage}
          />
        }
      >
        <DataTable
          columns={columns}
          data={paginatedRoles}
          rowKey={(role) => role.id}
          emptyMessage="No roles match your filters."
        />
      </ListViewLayout>

      <AddPlatformRoleSheet
        open={isAddRoleOpen}
        onOpenChange={setIsAddRoleOpen}
        onSubmit={handleAddRole}
      />
    </>
  );
}
