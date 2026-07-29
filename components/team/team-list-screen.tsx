"use client";

import { Download, Loader2, MoreHorizontal, UserPlus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { getErrorMessage } from "@/api/api";

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
import { AddStaffSheet } from "@/components/team/add-staff-sheet";
import { StaffStatusBadge } from "@/components/team/staff-status-badge";
import { TeamListLoader } from "@/components/team/team-list-loader";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDebounce } from "@/hooks/use-debounce";
import { buildTeamListParams } from "@/lib/team-filters";
import {
  createStaffMember,
  fetchStaffList,
  formatRoleName,
} from "@/lib/team";
import type { AddStaffFormValues } from "@/schema/staffSchema";
import type { StaffMember, StaffStatus } from "@/types/team";
import { staffStatusLabels } from "@/types/team";

const PAGE_SIZE = 6;

export function TeamListScreen() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [total, setTotal] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [loadError, setLoadError] = useState("");

  const debouncedSearch = useDebounce(search, 400);

  const loadStaff = useCallback(async () => {
    setIsFetching(true);

    try {
      const result = await fetchStaffList(
        buildTeamListParams({
          page,
          limit: PAGE_SIZE,
          search: debouncedSearch,
          status,
        })
      );

      setStaff(result.staff);
      setTotal(result.total);
      setLoadError("");
    } catch (error: unknown) {
      setLoadError(
        getErrorMessage(error, "Unable to load team members.")
      );
    } finally {
      setIsFetching(false);
      setIsInitialLoading(false);
    }
  }, [debouncedSearch, page, status]);

  useEffect(() => {
    loadStaff();
  }, [loadStaff]);

  const handleAddStaff = async (values: AddStaffFormValues) => {
    await createStaffMember(values);
    toast.success("Staff member added", {
      description: `${values.name} has been added to your team.`,
    });
    void loadStaff();
  };

  const stats = useMemo(
    () => [
      { label: "Total Staff", value: total },
      {
        label: "Active",
        value: staff.filter((member) => member.status === "active").length,
        tone: "success" as const,
      },
      {
        label: "Invited",
        value: staff.filter((member) => member.status === "invited").length,
        tone: "warning" as const,
      },
      {
        label: "Inactive",
        value: staff.filter((member) => member.status === "inactive").length,
        tone: "danger" as const,
      },
    ],
    [staff, total]
  );

  const hasActiveFilters = search.trim() !== "" || status !== "all";

  const handleClearFilters = () => {
    setSearch("");
    setStatus("all");
    setPage(1);
  };

  const columns: DataTableColumn<StaffMember>[] = [
    {
      key: "member",
      header: "Staff Member",
      render: (member) => (
        <div>
          <p className="font-semibold text-foreground">{member.name}</p>
          <p className="text-xs text-muted-foreground">{member.email}</p>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (member) => (
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-700">
          {formatRoleName(member.roleName)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (member) => <StaffStatusBadge status={member.status} />,
    },
    {
      key: "joined",
      header: "Joined",
      render: (member) => (
        <span className="text-muted-foreground">{member.joinedAt}</span>
      ),
    },
    {
      key: "updated",
      header: "Updated",
      render: (member) => (
        <span className="text-muted-foreground">{member.updatedAt ?? "—"}</span>
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
            <DropdownMenuItem>Edit staff</DropdownMenuItem>
            <DropdownMenuItem>Reset password</DropdownMenuItem>
            <DropdownMenuItem>Deactivate</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  if (isInitialLoading) {
    return <TeamListLoader />;
  }

  return (
    <>
      <ListViewLayout
        header={
          <ListViewHeader
            badge="Company"
            title="Team"
            description="Add and manage staff members who can access your company workspace."
            actions={
              <>
                <UiButton variant="outline" buttonText="Export" icon={Download} />
                <UiButton
                  variant="primary"
                  buttonText="Add Staff"
                  icon={UserPlus}
                  onClick={() => setIsAddStaffOpen(true)}
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
            searchPlaceholder="Search by name or email..."
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
                  ...(Object.entries(staffStatusLabels) as [
                    StaffStatus,
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
            data={staff}
            rowKey={(member) => member.id}
            emptyMessage={loadError || "No staff members match your filters."}
          />
        </div>
      </ListViewLayout>

      <AddStaffSheet
        open={isAddStaffOpen}
        onOpenChange={setIsAddStaffOpen}
        onSubmit={handleAddStaff}
      />
    </>
  );
}
