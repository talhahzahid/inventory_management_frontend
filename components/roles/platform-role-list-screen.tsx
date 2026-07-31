"use client";

import { Download, Loader2, Plus, Shield } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { UiButton } from "@/components/Button";
import {
  DataTable,
  ListViewHeader,
  ListViewLayout,
  ListViewPagination,
  ListViewStats,
} from "@/components/list-view";
import type { DataTableColumn } from "@/components/list-view";
import { AddPlatformRoleSheet } from "@/components/roles/add-platform-role-sheet";
import { PlatformRoleNameBadge } from "@/components/roles/platform-role-badges";
import { PlatformRoleListLoader } from "@/components/roles/platform-role-list-loader";
import {
  createPlatformRole,
  fetchPlatformRolesList,
} from "@/lib/platform-roles";
import type { AddPlatformRoleFormValues } from "@/schema/platformRoleSchema";
import type { PlatformRole } from "@/types/platform-role";
import { platformRoleNameLabels } from "@/types/platform-role";

const PAGE_SIZE = 6;

export function PlatformRoleListScreen() {
  const [roles, setRoles] = useState<PlatformRole[]>([]);
  const [total, setTotal] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loadError, setLoadError] = useState("");

  const loadRoles = useCallback(async () => {
    setIsFetching(true);
    try {
      const result = await fetchPlatformRolesList({
        page,
        limit: PAGE_SIZE,
      });
      setRoles(result.roles);
      setTotal(result.total);
      setLoadError("");
    } catch (error: unknown) {
      setLoadError(
        error instanceof Error ? error.message : "Unable to load roles."
      );
    } finally {
      setIsFetching(false);
      setIsInitialLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  const handleAdd = async (values: AddPlatformRoleFormValues) => {
    await createPlatformRole(values);
    await loadRoles();
    toast.success("Role created successfully", {
      description: `${platformRoleNameLabels[values.name]} has been added.`,
    });
  };

  const stats = useMemo(
    () => [
      { label: "Total Roles", value: total },
      {
        label: "On This Page",
        value: roles.length,
        tone: "success" as const,
      },
    ],
    [roles.length, total]
  );

  const columns: DataTableColumn<PlatformRole>[] = [
    {
      key: "role",
      header: "Role",
      render: (role) => (
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
            <Shield className="size-4" />
          </div>
          <div>
            <PlatformRoleNameBadge name={role.name} />
            <p className="mt-1 text-xs text-muted-foreground">#{role.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (role) => (
        <span className="text-muted-foreground">
          {role.description || "—"}
        </span>
      ),
    },
    {
      key: "updated",
      header: "Updated",
      render: (role) => (
        <span className="text-muted-foreground">{role.updatedAt}</span>
      ),
    },
  ];

  if (isInitialLoading) return <PlatformRoleListLoader />;

  return (
    <>
      <ListViewLayout
        header={
          <ListViewHeader
            badge="System"
            title="Roles"
            description="Create and view system roles used for access control."
            actions={
              <>
                <UiButton variant="outline" buttonText="Export" icon={Download} />
                <UiButton
                  variant="primary"
                  buttonText="Add Role"
                  icon={Plus}
                  onClick={() => setIsAddOpen(true)}
                />
              </>
            }
          />
        }
        stats={<ListViewStats stats={stats} />}
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
            data={roles}
            rowKey={(role) => role.id}
            emptyMessage={loadError || "No roles found."}
          />
        </div>
      </ListViewLayout>

      <AddPlatformRoleSheet
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSubmit={handleAdd}
      />
    </>
  );
}
