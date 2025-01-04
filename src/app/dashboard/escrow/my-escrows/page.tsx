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

const EscrowsPage = () => {
  const isLoading = useLoaderStore((state) => state.isLoading);

  return (
    <>
      {isLoading ? (
        <Loader isLoading={isLoading} />
      ) : (
        <div className="flex flex-col gap-3 w-full h-full">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-2/6 grid-cols-3">
              <TabsTrigger value="client">Client</TabsTrigger>
              <TabsTrigger value="service-provider">
                Service Provider
              </TabsTrigger>
              <TabsTrigger value="dispute-resolver">
                Dispute Resolver
              </TabsTrigger>
            </TabsList>
            <TabsContent value="client">
              <Card className={cn("overflow-hidden")}>
                <CardContent className="p-6">
                  <MyEscrowsClientFilter />
                </CardContent>
              </Card>
              <Card className={cn("overflow-hidden")}>
                <CardContent className="p-6">
                  <MyEscrowsClientTable />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="service-provider">
              <Card className={cn("overflow-hidden")}>
                <CardContent className="p-6">
                  <MyEscrowsServiceProviderFilter />
                </CardContent>
              </Card>
              <Card className={cn("overflow-hidden")}>
                <CardContent className="p-6">
                  <MyEscrowsServiceProviderTable />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="dispute-resolver">
              <Card className={cn("overflow-hidden")}>
                <CardContent className="p-6">
                  <MyEscrowsDisputeResolverFilter />
                </CardContent>
              </Card>
              <Card className={cn("overflow-hidden")}>
                <CardContent className="p-6">
                  <MyEscrowsDisputeResolverTable />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
};

export default EscrowsPage;
