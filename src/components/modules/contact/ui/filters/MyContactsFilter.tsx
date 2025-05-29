"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreateButton from "@/components/utils/ui/Create";
import Divider from "@/components/utils/ui/Divider";
import { WalletType } from "@/@types/contact.entity";
import { useContactUIBoundedStore } from "@/components/modules/contact/store/ui";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const MyContactsFilter = () => {
  const { filters, setFilters } = useContactUIBoundedStore();
  const router = useRouter();
  const pathname = usePathname();

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.name) params.set("name", filters.name);
    if (filters.email) params.set("email", filters.email);
    if (filters.walletType) params.set("walletType", filters.walletType);

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(newUrl);
  }, [filters, pathname, router]);

  const handleClearFilters = () => {
    setFilters({
      name: "",
      email: "",
      walletType: null,
    });
    router.push(pathname);
  };

  return (
    <form
      className="flex flex-col space-y-4 w-full"
      onSubmit={(e) => e.preventDefault()}
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-lg font-semibold">Filter Contacts</h2>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="icon"
            className="shrink-0"
            onClick={handleClearFilters}
            type="button"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <CreateButton
            className="shrink-0"
            label="Create Contact"
            url="/dashboard/contact/initialize-contact"
            id="step-2"
          />
        </div>
      </div>

      <Divider type="horizontal" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Name */}
        <div className="flex flex-col">
          <label className="text-xs text-muted-foreground font-bold mb-2 ml-2">
            Name
          </label>
          <Input
            placeholder="Filter by name"
            value={filters.name}
            onChange={(e) => setFilters({ name: e.target.value })}
            className="w-full"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="text-xs text-muted-foreground font-bold mb-2 ml-2">
            Email
          </label>
          <Input
            placeholder="Filter by email"
            value={filters.email}
            onChange={(e) => setFilters({ email: e.target.value })}
            className="w-full"
          />
        </div>

        {/* Wallet Type */}
        <div className="flex flex-col">
          <label className="text-xs text-muted-foreground font-bold mb-2 ml-2">
            Wallet Type
          </label>
          <Select
            value={filters.walletType || "all"}
            onValueChange={(value) =>
              setFilters({ walletType: value === "all" ? null : value })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by wallet type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value={WalletType.ALBEDO}>
                {WalletType.ALBEDO}
              </SelectItem>
              <SelectItem value={WalletType.LOBSTR}>
                {WalletType.LOBSTR}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </form>
  );
};

export default MyContactsFilter;
