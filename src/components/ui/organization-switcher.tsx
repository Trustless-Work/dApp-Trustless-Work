"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  useSidebar,
} from "@/components/ui/sidebar";
import { CreateOrganizationDialog } from "@/features/organizations/ui/CreateOrganizationDialog";
import { useSidebarDropdownLock } from "@/hooks/useSidebarDropdownLock";
import { useActiveOrganization } from "@/providers/OrganizationProvider";
import { ChevronsUpDownIcon, PlusIcon } from "lucide-react";

function getOrganizationInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "O";
  }
  if (parts.length === 1) {
    return parts[0]?.slice(0, 2).toUpperCase() ?? "O";
  }
  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
}

export const OrganizationSwitcher = () => {
  const { isMobile } = useSidebar();
  const handleOpenChange = useSidebarDropdownLock();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const {
    organizations,
    activeOrganization,
    setActiveOrganization,
    isLoading,
  } = useActiveOrganization();

  if (isLoading) {
    return (
      <SidebarMenu className="mt-2">
        <SidebarMenuItem>
          <SidebarMenuSkeleton showIcon />
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!activeOrganization) {
    return (
      <>
        <SidebarMenu className="mt-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              onClick={() => setCreateDialogOpen(true)}
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground group-data-[collapsible=icon]:size-8">
                <PlusIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold">
                  Create organization
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  Get started
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <CreateOrganizationDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
        />
      </>
    );
  }

  return (
    <>
      <SidebarMenu className="mt-2">
        <SidebarMenuItem>
          <DropdownMenu onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground group-data-[collapsible=icon]:size-8">
                  {getOrganizationInitials(activeOrganization.name)}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold">
                    {activeOrganization.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    Organization
                  </span>
                </div>
                <ChevronsUpDownIcon className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-fit min-w-56"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Organizations
              </DropdownMenuLabel>
              {organizations.map((organization) => (
                <DropdownMenuItem
                  key={organization.id}
                  onClick={() => setActiveOrganization(organization.id)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-md border text-xs font-medium">
                    {getOrganizationInitials(organization.name)}
                  </div>
                  <span className="truncate">{organization.name}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 p-2"
                onClick={() => setCreateDialogOpen(true)}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <PlusIcon className="size-4" />
                </div>
                <span className="font-medium text-muted-foreground">
                  Add organization
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <CreateOrganizationDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </>
  );
};
