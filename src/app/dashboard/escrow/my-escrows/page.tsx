"use client";

import { useLoaderStore } from "@/store/utilsStore/store";
import Loader from "@/components/utils/Loader";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import MyEscrowsClientTable from "@/components/modules/escrow/table/MyEscrowsClientTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tab";
import MyEscrowsClientFilter from "@/components/modules/escrow/filters/MyEscrowsClientFilter";
import MyEscrowsServiceProviderFilter from "@/components/modules/escrow/filters/MyEscrowsServiceProviderFilter";
import MyEscrowsServiceProviderTable from "@/components/modules/escrow/table/MyEscrowsServiceProviderTable";
import MyEscrowsDisputeResolverFilter from "@/components/modules/escrow/filters/MyEscrowsDisputeResolverFilter";
import MyEscrowsDisputeResolverTable from "@/components/modules/escrow/table/MyEscrowsDisputeResolverTable";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EscrowsPage = () => {
  const isLoading = useLoaderStore((state) => state.isLoading);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  return (
    <>
      {isLoading ? (
        <Loader isLoading={isLoading} />
      ) : (
        <div className="flex gap-3 w-full h-full justify-between">
          <Tabs defaultValue="client" className="w-full">
            <div className="flex w-full justify-between items-center">
              <TabsList className="grid w-2/6 grid-cols-3">
                <TabsTrigger value="client">Client</TabsTrigger>
                <TabsTrigger value="service-provider">
                  Service Provider
                </TabsTrigger>
                <TabsTrigger value="dispute-resolver">
                  Dispute Resolver
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <label className="text-sm">View:</label>
                <Select
                  value={viewMode}
                  onValueChange={(value) =>
                    setViewMode(value as "table" | "cards")
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Select view" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="table">Table</SelectItem>
                    <SelectItem value="cards">Cards</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="client" className="flex flex-col gap-3">
              <Card className={cn("overflow-hidden")}>
                <CardContent className="p-6">
                  <MyEscrowsClientFilter />
                </CardContent>
              </Card>
              {viewMode === "table" ? (
                <Card className={cn("overflow-hidden")}>
                  <CardContent className="p-6">
                    <MyEscrowsClientTable />
                  </CardContent>
                </Card>
              ) : (
                <Card className={cn("overflow-hidden")}>
                  <CardContent className="p-6">
                    {/* SET CARDS */}
                    <p>Cards View for Client</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent
              value="service-provider"
              className="flex flex-col gap-3"
            >
              <Card className={cn("overflow-hidden")}>
                <CardContent className="p-6">
                  <MyEscrowsServiceProviderFilter />
                </CardContent>
              </Card>
              {viewMode === "table" ? (
                <Card className={cn("overflow-hidden")}>
                  <CardContent className="p-6">
                    <MyEscrowsServiceProviderTable />
                  </CardContent>
                </Card>
              ) : (
                <Card className={cn("overflow-hidden")}>
                  <CardContent className="p-6">
                    {/* SET CARDS */}
                    <p>Cards View for Service Provider</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent
              value="dispute-resolver"
              className="flex flex-col gap-3"
            >
              <Card className={cn("overflow-hidden")}>
                <CardContent className="p-6">
                  <MyEscrowsDisputeResolverFilter />
                </CardContent>
              </Card>
              {viewMode === "table" ? (
                <Card className={cn("overflow-hidden")}>
                  <CardContent className="p-6">
                    <MyEscrowsDisputeResolverTable />
                  </CardContent>
                </Card>
              ) : (
                <Card className={cn("overflow-hidden")}>
                  <CardContent className="p-6">
                    {/* SET CARDS */}
                    <p>Cards View for Dispute Resolver</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
};

export default EscrowsPage;
