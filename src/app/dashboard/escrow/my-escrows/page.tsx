"use client";

import { useLoaderStore } from "@/store/utilsStore/store";
import Loader from "@/components/utils/Loader";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import MyEscrowsClientTable from "@/components/modules/escrow/ui/tables/MyEscrowsClientTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tab";
import MyEscrowsClientFilter from "@/components/modules/escrow/ui/filters/MyEscrowsClientFilter";
import MyEscrowsServiceProviderFilter from "@/components/modules/escrow/ui/filters/MyEscrowsServiceProviderFilter";
import MyEscrowsServiceProviderTable from "@/components/modules/escrow/ui/tables/MyEscrowsServiceProviderTable";
import MyEscrowsDisputeResolverFilter from "@/components/modules/escrow/ui/filters/MyEscrowsDisputeResolverFilter";
import MyEscrowsDisputeResolverTable from "@/components/modules/escrow/ui/tables/MyEscrowsDisputeResolverTable";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MyEscrowsClientCards from "@/components/modules/escrow/ui/cards/MyEscrowsClientCards";
import MyEscrowsServiceProviderCards from "@/components/modules/escrow/ui/cards/MyEscrowsServiceProviderCards";
import MyEscrowsDisputeResolverCards from "@/components/modules/escrow/ui/cards/MyEscrowsDisputeResolverCards";

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
            <div className="flex w-full justify-between items-center flex-col md:flex-row md:gap-3">
              <TabsList className="grid w-full sm:w-2/3 md:w-1/2 lg:w-1/3 grid-cols-2 md:grid-cols-3">
                <TabsTrigger value="client">Client</TabsTrigger>
                <TabsTrigger value="service-provider">
                  Service Provider
                </TabsTrigger>
                <TabsTrigger value="dispute-resolver">
                  Dispute Resolver
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
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
                  <MyEscrowsClientTable />
                </Card>
              ) : (
                <MyEscrowsClientCards />
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
                  <MyEscrowsServiceProviderTable />
                </Card>
              ) : (
                <MyEscrowsServiceProviderCards />
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
                  <MyEscrowsDisputeResolverTable />
                </Card>
              ) : (
                <MyEscrowsDisputeResolverCards />
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
};

export default EscrowsPage;
