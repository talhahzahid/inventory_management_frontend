"use client";

import { Download, MoreHorizontal, UserPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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
import { createStaffMember, fetchStaff } from "@/lib/team";
import type { AddStaffFormValues } from "@/schema/staffSchema";
import type { StaffMember, StaffStatus } from "@/types/team";
import { staffDepartments, staffStatusLabels } from "@/types/team";

const PAGE_SIZE = 6;

export function TeamListScreen() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("joined_desc");
  const [page, setPage] = useState(1);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchStaff()
      .then((data) => {
        if (!cancelled) {
          setStaff(data);
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

  const handleAddStaff = async (values: AddStaffFormValues) => {
    const member = await createStaffMember(values);
    setStaff((current) => [member, ...current]);
  };

  const filteredStaff = useMemo(() => {
    let result = [...staff];

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (member) =>
          member.name.toLowerCase().includes(query) ||
          member.email.toLowerCase().includes(query) ||
          member.department.toLowerCase().includes(query)
      );
    }

    if (department !== "all") {
      result = result.filter((member) => member.department === department);
    }

    if (status !== "all") {
      result = result.filter((member) => member.status === status);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "department_asc":
          return a.department.localeCompare(b.department);
        case "joined_desc":
        default:
          return b.joinedAt.localeCompare(a.joinedAt);
      }
    });

    return result;
  }, [staff, search, department, status, sortBy]);

  const paginatedStaff = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredStaff.slice(start, start + PAGE_SIZE);
  }, [filteredStaff, page]);

  const stats = useMemo(
    () => [
      { label: "Total Staff", value: staff.length },
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
    [staff]
  );

  const hasActiveFilters =
    search.trim() !== "" || department !== "all" || status !== "all";

  const handleClearFilters = () => {
    setSearch("");
    setDepartment("all");
    setStatus("all");
    setSortBy("joined_desc");
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
      key: "department",
      header: "Department",
      render: (member) => (
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
          {member.department}
        </span>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (member) => (
        <span className="text-muted-foreground">{member.phone ?? "—"}</span>
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
      key: "lastActive",
      header: "Last Active",
      render: (member) => (
        <span className="text-muted-foreground">{member.lastActive ?? "—"}</span>
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

  if (isLoading) {
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
            searchPlaceholder="Search by name, email, or department..."
            hasActiveFilters={hasActiveFilters}
            onClear={handleClearFilters}
            filters={[
              {
                id: "department",
                label: "Department",
                value: department,
                onChange: (value) => {
                  setDepartment(value);
                  setPage(1);
                },
                options: [
                  { label: "All Departments", value: "all" },
                  ...staffDepartments
                    .filter((item) => item !== "All Departments")
                    .map((item) => ({ label: item, value: item })),
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
                  ...(Object.entries(staffStatusLabels) as [StaffStatus, string][]).map(
                    ([value, label]) => ({ label, value })
                  ),
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
                  { label: "Department A-Z", value: "department_asc" },
                ],
              },
            ]}
          />
        }
        footer={
          <ListViewPagination
            page={page}
            pageSize={PAGE_SIZE}
            total={filteredStaff.length}
            onPageChange={setPage}
          />
        }
      >
        <DataTable
          columns={columns}
          data={paginatedStaff}
          rowKey={(member) => member.id}
          emptyMessage="No staff members match your filters."
        />
      </ListViewLayout>

      <AddStaffSheet
        open={isAddStaffOpen}
        onOpenChange={setIsAddStaffOpen}
        onSubmit={handleAddStaff}
      />
    </>
  );
}
