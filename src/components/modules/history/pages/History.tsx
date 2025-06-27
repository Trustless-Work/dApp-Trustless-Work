"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tab";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useHistory } from "../hooks/useHistory.hook";
import HistoryTable from "../tables/HistoryTable";
import EscrowDetailDialog from "@/components/modules/escrow/ui/dialogs/EscrowDetailDialog";

const History = () => {
  const {
    data,
    isLoading,
    error,
    totalPages,
    activeTab,
    currentPage,
    itemsPerPage,
    filters,
    isDialogOpen,
    handleClearFilters,
    handleTabChange,
    handleSearchChange,
    handleStatusChange,
    handleActivityTypeChange,
    handlePageChange,
    handleItemsPerPageChange,
    setIsDialogOpen,
    setSelectedEscrow,
    t,
    address,
  } = useHistory();

  if (!address) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">
              {t("history.connectWallet")}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("history.title")}
        </h1>
        <p className="text-muted-foreground">{t("history.description")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("history.filters.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("history.filters.searchPlaceholder")}
                  value={filters.search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filters.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue
                  placeholder={t("history.filters.statusPlaceholder")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">
                  {t("history.filters.allStatuses")}
                </SelectItem>
                <SelectItem value="active">
                  {t("history.filters.active")}
                </SelectItem>
                <SelectItem value="released">
                  {t("history.filters.released")}
                </SelectItem>
                <SelectItem value="resolved">
                  {t("history.filters.resolved")}
                </SelectItem>
                <SelectItem value="disputed">
                  {t("history.filters.disputed")}
                </SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.activityType}
              onValueChange={handleActivityTypeChange}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue
                  placeholder={t("history.filters.activityPlaceholder")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">
                  {t("history.filters.allActivities")}
                </SelectItem>
                <SelectItem value="created">
                  {t("history.filters.created")}
                </SelectItem>
                <SelectItem value="funded">
                  {t("history.filters.funded")}
                </SelectItem>
                <SelectItem value="milestone_completed">
                  {t("history.filters.milestoneCompleted")}
                </SelectItem>
                <SelectItem value="milestone_approved">
                  {t("history.filters.milestoneApproved")}
                </SelectItem>
                <SelectItem value="disputed">
                  {t("history.filters.disputed")}
                </SelectItem>
                <SelectItem value="resolved">
                  {t("history.filters.resolved")}
                </SelectItem>
                <SelectItem value="released">
                  {t("history.filters.released")}
                </SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="w-full sm:w-auto"
            >
              <X className="h-4 w-4 mr-2" />
              {t("history.filters.clear")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("history.table.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="approver">
                {t("history.tabs.approver")}
              </TabsTrigger>
              <TabsTrigger value="serviceProvider">
                {t("history.tabs.serviceProvider")}
              </TabsTrigger>
              <TabsTrigger value="issuer">
                {t("history.tabs.issuer")}
              </TabsTrigger>
              <TabsTrigger value="disputeResolver">
                {t("history.tabs.disputeResolver")}
              </TabsTrigger>
              <TabsTrigger value="releaseSigner">
                {t("history.tabs.releaseSigner")}
              </TabsTrigger>
              <TabsTrigger value="platformAddress">
                {t("history.tabs.platformAddress")}
              </TabsTrigger>
              <TabsTrigger value="receiver">
                {t("history.tabs.receiver")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {error ? (
                <div className="flex items-center justify-center h-64">
                  <p className="text-destructive">
                    {t("history.error")}: {error.message}
                  </p>
                </div>
              ) : (
                <HistoryTable
                  data={data}
                  isLoading={isLoading}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  totalPages={totalPages}
                  setCurrentPage={handlePageChange}
                  setItemsPerPage={handleItemsPerPageChange}
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <EscrowDetailDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        setSelectedEscrow={setSelectedEscrow}
      />
    </div>
  );
};

export default History;
