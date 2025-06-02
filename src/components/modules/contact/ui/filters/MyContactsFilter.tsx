"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Divider from "@/components/utils/ui/Divider";
import { WalletType } from "@/@types/contact.entity";
import { useContactUIBoundedStore } from "@/components/modules/contact/store/ui";
import { Button } from "@/components/ui/button";
import { Plus, Search, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import InitializeContactForm from "../forms/InitializeContactForm";
import { useContact } from "../../hooks/contact.hook";

const MyContactsFilter = () => {
  const { handleClearFilters, handleSubmit, isSheetOpen, setIsSheetOpen } =
    useContact();
  const { filters, setFilters } = useContactUIBoundedStore();

  return (
    <form
      className="flex flex-col space-y-4 w-full"
      onSubmit={(e) => e.preventDefault()}
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex flex-row items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-[300px]">
            <Input
              placeholder="Search by name..."
              value={filters.name}
              onChange={(e) => setFilters({ name: e.target.value })}
              className="w-full"
            />
            <Search className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
          <Button
            variant="destructive"
            size="icon"
            className="shrink-0"
            onClick={handleClearFilters}
            type="button"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={20} />
                Create Contact
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[400px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle>Create a New Contact</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <InitializeContactForm onSubmit={handleSubmit} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <Divider type="horizontal" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="flex flex-col">
          <label
            className="text-xs text-muted-foreground font-bold mb-2 ml-2"
            htmlFor="status"
          >
            Email
          </label>
          <Input
            placeholder="Search by email..."
            value={filters.email}
            onChange={(e) => setFilters({ email: e.target.value })}
            className="w-full"
          />
        </div>

        <div className="flex flex-col">
          <label
            className="text-xs text-muted-foreground font-bold mb-2 ml-2"
            htmlFor="status"
          >
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
              {Object.values(WalletType).map((type) => (
                <SelectItem className="cursor-pointer" key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </form>
  );
};

export default MyContactsFilter;
