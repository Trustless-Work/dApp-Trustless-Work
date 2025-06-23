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
import { useEscrowUIBoundedStore } from "@/components/modules/escrow/store/ui";
import MyEscrowsTable from "@/components/modules/escrow/ui/tables/MyEscrowsTable";
import MyEscrowsCards from "@/components/modules/escrow/ui/cards/MyEscrowsCards";
import MyEscrowsFilter from "@/components/modules/escrow/ui/filters/MyEscrowsFilter";
import { useGlobalUIBoundedStore } from "@/core/store/ui";
import Joyride from "react-joyride";
import { useSteps } from "@/constants/steps/steps";
import { useState } from "react";
import { CircleHelp } from "lucide-react";
import { MoonpayWidget } from "@/components/modules/payment/widgets/moonpay.widget";
import { useGlobalBoundedStore } from "@/core/store/data";
import TooltipInfo from "@/components/utils/ui/Tooltip";
import { useTranslation } from "react-i18next";

const MyEscrows = () => {
  const { t } = useTranslation();
  const isLoading = useGlobalUIBoundedStore((state) => state.isLoading);
  const setActiveTab = useEscrowUIBoundedStore((state) => state.setActiveTab);
  const setActiveMode = useEscrowUIBoundedStore((state) => state.setActiveMode);
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const activeMode = useEscrowUIBoundedStore((state) => state.activeMode);
  const theme = useGlobalUIBoundedStore((state) => state.theme);

  const [run, setRun] = useState(false);
  const isMoonpayWidgetOpen = useEscrowUIBoundedStore(
    (state) => state.isMoonpayWidgetOpen,
  );

  const steps = useSteps();

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
            locale={{
              back: t("onboarding.buttons.back"),
              next: t("onboarding.buttons.next"),
              skip: t("onboarding.buttons.skip"),
              close: t("onboarding.buttons.close"),
              last: t("onboarding.buttons.last"),
            }}
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
                  className="grid w-full grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-7 gap-4"
                  id="step-1"
                >
                  <TabsTrigger
                    onClick={() => setActiveTab("issuer")}
                    value="issuer"
                  >
                    {t("myEscrows.tabs.issuer")}
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() => setActiveTab("approver")}
                    value="approver"
                  >
                    {t("myEscrows.tabs.approver")}
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() => setActiveTab("serviceProvider")}
                    value="service-provider"
                  >
                    {t("myEscrows.tabs.serviceProvider")}
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() => setActiveTab("disputeResolver")}
                    value="dispute-resolver"
                  >
                    {t("myEscrows.tabs.disputeResolver")}
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() => setActiveTab("releaseSigner")}
                    value="release-signer"
                  >
                    {t("myEscrows.tabs.releaseSigner")}
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() => setActiveTab("platformAddress")}
                    value="platform-address"
                  >
                    {t("myEscrows.tabs.platformAddress")}
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() => setActiveTab("receiver")}
                    value="receiver"
                  >
                    {t("myEscrows.tabs.receiver")}
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2 mt-20 sm:mt-10 xl:mt-10 2xl:mt-0">
                  <Select
                    value={activeMode}
                    onValueChange={(value) =>
                      setActiveMode(value as "table" | "cards")
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue
                        placeholder={t("myEscrows.view.placeholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="table">
                        {t("myEscrows.view.table")}
                      </SelectItem>
                      <SelectItem value="cards">
                        {t("myEscrows.view.cards")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <TooltipInfo content={t("reusable.tooltips.help")}>
                  <button
                    className="btn-dark"
                    type="button"
                    onClick={() => setRun(true)}
                  >
                    <CircleHelp size={29} />
                  </button>
                </TooltipInfo>
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

              <TabsContent value="receiver" className="flex flex-col gap-3">
                <Card className={cn("overflow-hidden")}>
                  <CardContent className="p-6">
                    <MyEscrowsFilter />
                  </CardContent>
                </Card>
                {activeMode === "table" ? (
                  <Card className={cn("overflow-hidden")}>
                    <MyEscrowsTable type="receiver" />
                  </Card>
                ) : (
                  <MyEscrowsCards type="receiver" />
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
