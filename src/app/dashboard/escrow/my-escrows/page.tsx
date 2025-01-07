"use client";

import { useLoaderStore } from "@/store/utilsStore/store";
import Loader from "@/components/utils/Loader";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tab";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEscrowBoundedStore } from "@/components/modules/escrow/store/ui";
import MyEscrowsTable from "@/components/modules/escrow/ui/tables/MyEscrowsTable";
import MyEscrowsCards from "@/components/modules/escrow/ui/cards/MyEscrowsCards";
import MyEscrowsFilter from "@/components/modules/escrow/ui/filters/MyEscrowsFilter";

const EscrowsPage = () => {
  const isLoading = useLoaderStore((state) => state.isLoading);
  const setActiveTab = useEscrowBoundedStore((state) => state.setActiveTab);

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
                <TabsTrigger
                  onClick={() => setActiveTab("user")}
                  value="client"
                >
                  Client
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => setActiveTab("serviceProvider")}
                  value="service-provider"
                >
                  Service Provider
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => setActiveTab("disputeResolver")}
                  value="dispute-resolver"
                >
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
                  <MyEscrowsFilter />
                </CardContent>
              </Card>
              {viewMode === "table" ? (
                <Card className={cn("overflow-hidden")}>
                  <MyEscrowsTable type="user" />
                </Card>
              ) : (
                <MyEscrowsCards type="user" />
              )}
            </TabsContent>

            <TabsContent
              value="service-provider"
              className="flex flex-col gap-3"
            >
              <Card className={cn("overflow-hidden")}>
                <CardContent className="p-6">
                  <MyEscrowsFilter />
                </CardContent>
              </Card>
              {viewMode === "table" ? (
                <Card className={cn("overflow-hidden")}>
                  <MyEscrowsTable type="serviceProvider" />
                </Card>
              ) : (
                <MyEscrowsCards type="serviceProvider" />
              )}
            </TabsContent>

            <TabsContent
              value="dispute-resolver"
              className="flex flex-col gap-3"
            >
              <Card className={cn("overflow-hidden")}>
                <CardContent className="p-6">
                  <MyEscrowsFilter />
                </CardContent>
              </Card>
              {viewMode === "table" ? (
                <Card className={cn("overflow-hidden")}>
                  <MyEscrowsTable type="disputeResolver" />
                </Card>
              ) : (
                <MyEscrowsCards type="disputeResolver" />
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
};

export default EscrowsPage;
