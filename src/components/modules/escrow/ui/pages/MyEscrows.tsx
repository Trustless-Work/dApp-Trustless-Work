import { useLoaderStore } from "@/store/utilsStore/store";
import Loader from "@/components/utils/ui/Loader";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tab";
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

const MyEscrows = () => {
  const isLoading = useLoaderStore((state) => state.isLoading);
  const setActiveTab = useEscrowBoundedStore((state) => state.setActiveTab);
  const setActiveMode = useEscrowBoundedStore((state) => state.setActiveMode);
  const activeMode = useEscrowBoundedStore((state) => state.activeMode);

  return (
    <>
      {isLoading ? (
        <Loader isLoading={isLoading} />
      ) : (
        <div className="flex gap-3 w-full h-full justify-between">
          <Tabs defaultValue="issuer" className="w-full">
            <div className="flex w-full justify-between items-center flex-col md:flex-row gap-16 md:gap-3">
              <TabsList className="grid w-full sm:w-9/12 md:w-9/12 lg:w-3/5 grid-cols-2 sm:grid-cols-5 gap-4">
                <TabsTrigger
                  onClick={() => setActiveTab("issuer")}
                  value="issuer"
                >
                  Initiated Escrows
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => setActiveTab("client")}
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
                <TabsTrigger
                  onClick={() => setActiveTab("releaseSigner")}
                  value="release-signer"
                >
                  Release Signer
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <Select
                  value={activeMode}
                  onValueChange={(value) =>
                    setActiveMode(value as "table" | "cards")
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

            <TabsContent value="issuer" className="flex flex-col gap-3">
              <Card className={cn("overflow-hidden")}>
                <CardContent className="p-6">
                  <MyEscrowsFilter />
                </CardContent>
              </Card>
              {activeMode === "table" ? (
                <Card className={cn("overflow-hidden")}>
                  <MyEscrowsTable type="issuer" />
                </Card>
              ) : (
                <MyEscrowsCards type="issuer" />
              )}
            </TabsContent>

            <TabsContent value="client" className="flex flex-col gap-3">
              <Card className={cn("overflow-hidden")}>
                <CardContent className="p-6">
                  <MyEscrowsFilter />
                </CardContent>
              </Card>
              {activeMode === "table" ? (
                <Card className={cn("overflow-hidden")}>
                  <MyEscrowsTable type="client" />
                </Card>
              ) : (
                <MyEscrowsCards type="client" />
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
              {activeMode === "table" ? (
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
              {activeMode === "table" ? (
                <Card className={cn("overflow-hidden")}>
                  <MyEscrowsTable type="disputeResolver" />
                </Card>
              ) : (
                <MyEscrowsCards type="disputeResolver" />
              )}
            </TabsContent>

            <TabsContent value="release-signer" className="flex flex-col gap-3">
              <Card className={cn("overflow-hidden")}>
                <CardContent className="p-6">
                  <MyEscrowsFilter />
                </CardContent>
              </Card>
              {activeMode === "table" ? (
                <Card className={cn("overflow-hidden")}>
                  <MyEscrowsTable type="releaseSigner" />
                </Card>
              ) : (
                <MyEscrowsCards type="releaseSigner" />
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
};

export default MyEscrows;
