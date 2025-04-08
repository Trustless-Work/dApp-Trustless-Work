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
import { useGlobalUIBoundedStore } from "@/core/store/ui";
import Joyride from "react-joyride";
import { steps } from "@/constants/steps/steps";
import { useState } from "react";
import { CircleHelp } from "lucide-react";
import { MoonpayWidget } from "@/components/modules/payment/widgets/moonpay.widget";
import { useGlobalBoundedStore } from "@/core/store/data";
import useFundEscrowDialog from "../dialogs/hooks/fund-escrow-dialog.hook";

const MyEscrows = () => {
  const isLoading = useGlobalUIBoundedStore((state) => state.isLoading);
  const setActiveTab = useEscrowBoundedStore((state) => state.setActiveTab);
  const setActiveMode = useEscrowBoundedStore((state) => state.setActiveMode);
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const activeMode = useEscrowBoundedStore((state) => state.activeMode);
  const theme = useGlobalUIBoundedStore((state) => state.theme);

  const [run, setRun] = useState(false);
  const isMoonpayWidgetOpen = useEscrowBoundedStore(
    (state) => state.isMoonpayWidgetOpen,
  );

  return (
    <>
      {isLoading ? (
        <Loader isLoading={isLoading} />
      ) : (
        <>
          <MoonpayWidget
            visible={isMoonpayWidgetOpen}
            wallet={selectedEscrow?.contractId || ""}
          />

          <Joyride
            run={run}
            steps={steps}
            continuous
            showSkipButton
            hideCloseButton
            callback={(data) => {
              const { status } = data;
              if (status === "skipped" || status === "finished") {
                setRun(false);
              }
            }}
            disableOverlayClose
            styles={{
              options:
                theme === "dark"
                  ? {
                      backgroundColor: "#19191B",
                      overlayColor: "rgba(0, 0, 0, 0.80)",
                      primaryColor: "#006BE4",
                      textColor: "#FFF",
                      width: 500,
                      zIndex: 1000,
                    }
                  : {
                      backgroundColor: "#FFFFFF",
                      overlayColor: "rgba(0, 0, 0, 0.60)",
                      primaryColor: "#006BE4",
                      textColor: "#000",
                      width: 500,
                      zIndex: 1000,
                    },
            }}
          />

          <div className="flex gap-3 w-full h-full justify-between">
            <Tabs defaultValue="issuer" className="w-full">
              <div className="flex w-full justify-between items-center flex-col 2xl:flex-row gap-16 md:gap-3">
                <TabsList
                  className="grid w-full grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-4"
                  id="step-1"
                >
                  <TabsTrigger
                    onClick={() => setActiveTab("issuer")}
                    value="issuer"
                  >
                    Initiated Escrows
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() => setActiveTab("approver")}
                    value="approver"
                  >
                    Approver
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
                  <TabsTrigger
                    onClick={() => setActiveTab("platformAddress")}
                    value="platform-address"
                  >
                    Platform Address
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2 mt-10 sm:mt-10 xl:mt-10 2xl:mt-0">
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

                <button
                  title="Help"
                  className="btn-dark"
                  type="button"
                  onClick={() => setRun(true)}
                >
                  <CircleHelp size={29} />
                </button>
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

              <TabsContent value="approver" className="flex flex-col gap-3">
                <Card className={cn("overflow-hidden")}>
                  <CardContent className="p-6">
                    <MyEscrowsFilter />
                  </CardContent>
                </Card>
                {activeMode === "table" ? (
                  <Card className={cn("overflow-hidden")}>
                    <MyEscrowsTable type="approver" />
                  </Card>
                ) : (
                  <MyEscrowsCards type="approver" />
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

              <TabsContent
                value="release-signer"
                className="flex flex-col gap-3"
              >
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

              <TabsContent
                value="platform-address"
                className="flex flex-col gap-3"
              >
                <Card className={cn("overflow-hidden")}>
                  <CardContent className="p-6">
                    <MyEscrowsFilter />
                  </CardContent>
                </Card>
                {activeMode === "table" ? (
                  <Card className={cn("overflow-hidden")}>
                    <MyEscrowsTable type="platformAddress" />
                  </Card>
                ) : (
                  <MyEscrowsCards type="platformAddress" />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </>
  );
};

export default MyEscrows;
