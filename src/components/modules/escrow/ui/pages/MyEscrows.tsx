/* eslint-disable @typescript-eslint/no-explicit-any */

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
import { useState, useCallback, useMemo } from "react";
import { CircleHelp } from "lucide-react";
import { MoonpayWidget } from "@/components/modules/payment/widgets/moonpay.widget";
import { useGlobalBoundedStore } from "@/core/store/data";
import TooltipInfo from "@/components/utils/ui/Tooltip";
import { useTranslation } from "react-i18next";
import { Role } from "@trustless-work/escrow/types";
import useIsMobile from "@/hooks/mobile.hook";
import useMyEscrows from "@/components/modules/escrow/hooks/my-escrows.hook"

const MyEscrows = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const setActiveTab = useEscrowUIBoundedStore((state) => state.setActiveTab);
  const activeTab = useEscrowUIBoundedStore((state) => state.activeTab);
  const setActiveMode = useEscrowUIBoundedStore((state) => state.setActiveMode);
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const activeMode = useEscrowUIBoundedStore((state) => state.activeMode);
  const theme = useGlobalUIBoundedStore((state) => state.theme);
  const { escrows } = useMyEscrows({ role: activeTab })


  const [run, setRun] = useState(false);
  const isMoonpayWidgetOpen = useEscrowUIBoundedStore(
    (state) => state.isMoonpayWidgetOpen,
  );
  const steps = useSteps();

  const handleSetActiveTab = useCallback(
    (tab: Role) => {
      setActiveTab(tab);
    },
    [setActiveTab],
  );

  const handleTabValueChange = useCallback(
    (value: string) => {
      setActiveTab(value as Role);
    },
    [setActiveTab],
  );

  const handleSetActiveMode = useCallback(
    (mode: "table" | "cards") => {
      setActiveMode(mode);
    },
    [setActiveMode],
  );

  const handleJoyrideCallback = useCallback((data: any) => {
    const { status } = data;
    if (status === "skipped" || status === "finished") {
      setRun(false);
    }
  }, []);

  const handleStartTutorial = useCallback(() => {
    setRun(true);
  }, []);

  const joyrideStyles = useMemo(
    () => ({
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
    }),
    [theme],
  );

  const joyrideLocale = useMemo(
    () => ({
      back: t("onboarding.buttons.back"),
      next: t("onboarding.buttons.next"),
      skip: t("onboarding.buttons.skip"),
      close: t("onboarding.buttons.close"),
      last: t("onboarding.buttons.last"),
    }),
    [t],
  );

  const viewOptions = useMemo(
    () => [
      { value: "table", label: t("myEscrows.view.table") },
      { value: "cards", label: t("myEscrows.view.cards") },
    ],
    [t],
  );

  const tabOptions = useMemo(
    () => [
      { value: "signer", label: t("myEscrows.tabs.signer") },
      { value: "approver", label: t("myEscrows.tabs.approver") },
      { value: "serviceProvider", label: t("myEscrows.tabs.serviceProvider") },
      { value: "disputeResolver", label: t("myEscrows.tabs.disputeResolver") },
      { value: "releaseSigner", label: t("myEscrows.tabs.releaseSigner") },
      { value: "platformAddress", label: "Platform" },
      { value: "receiver", label: t("myEscrows.tabs.receiver") },
    ],
    [t],
  );

  const renderTabContent = useCallback(
    (role: Role) => (
      <div className="flex flex-col gap-3">
        <Card className={cn("overflow-hidden")}>
          <CardContent className="p-6">
            <MyEscrowsFilter escrows={escrows} role={role} />
          </CardContent>
        </Card>
        {activeMode === "table" ? (
          <Card className={cn("overflow-hidden")}>
            <MyEscrowsTable role={role} />
          </Card>
        ) : (
          <MyEscrowsCards role={role} />
        )}
      </div>
    ),
    [activeMode],
  );

  return (
    <>
      <MoonpayWidget
        visible={isMoonpayWidgetOpen}
        wallet={selectedEscrow?.contractId || ""}
      />

      <Joyride
        run={run}
        steps={steps}
        locale={joyrideLocale}
        continuous
        showSkipButton
        hideCloseButton
        callback={handleJoyrideCallback}
        disableOverlayClose
        styles={joyrideStyles}
      />

      <div className="flex gap-3 w-full h-full justify-between">
        <Tabs
          value={activeTab}
          onValueChange={handleTabValueChange}
          className="w-full"
        >
          <div className="flex w-full justify-between items-center flex-col 2xl:flex-row gap-2 md:gap-3">
            {isMobile ? (
              <Select value={activeTab} onValueChange={handleSetActiveTab}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("myEscrows.tabs.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {tabOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <TabsList
                className="grid w-full grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-7 gap-4"
                id="step-1"
              >
                <TabsTrigger value="signer">
                  {t("myEscrows.tabs.signer")}
                </TabsTrigger>
                <TabsTrigger value="approver">
                  {t("myEscrows.tabs.approver")}
                </TabsTrigger>
                <TabsTrigger value="serviceProvider">
                  {t("myEscrows.tabs.serviceProvider")}
                </TabsTrigger>
                <TabsTrigger value="disputeResolver">
                  {t("myEscrows.tabs.disputeResolver")}
                </TabsTrigger>
                <TabsTrigger value="releaseSigner">
                  {t("myEscrows.tabs.releaseSigner")}
                </TabsTrigger>
                <TabsTrigger value="platformAddress">Platform</TabsTrigger>
                <TabsTrigger value="receiver">
                  {t("myEscrows.tabs.receiver")}
                </TabsTrigger>
              </TabsList>
            )}

            {isMobile ? (
              <div className="flex items-center gap-2 mt-4 2xl:mt-0 justify-evenly w-full">
                <TooltipInfo content={t("reusable.tooltips.help")}>
                  <button
                    className="btn-dark"
                    type="button"
                    onClick={handleStartTutorial}
                  >
                    <CircleHelp size={29} />
                  </button>
                </TooltipInfo>
                <Select value={activeMode} onValueChange={handleSetActiveMode}>
                  <SelectTrigger className="w-32">
                    <SelectValue
                      placeholder={t("myEscrows.view.placeholder")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {viewOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mt-20 sm:mt-10 xl:mt-10 2xl:mt-0">
                  <Select
                    value={activeMode}
                    onValueChange={handleSetActiveMode}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue
                        placeholder={t("myEscrows.view.placeholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {viewOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <TooltipInfo content={t("reusable.tooltips.help")}>
                  <button
                    className="btn-dark"
                    type="button"
                    onClick={handleStartTutorial}
                  >
                    <CircleHelp size={29} />
                  </button>
                </TooltipInfo>
              </>
            )}
          </div>

          <TabsContent value="signer">{renderTabContent("signer")}</TabsContent>

          <TabsContent value="approver">
            {renderTabContent("approver")}
          </TabsContent>

          <TabsContent value="serviceProvider">
            {renderTabContent("serviceProvider")}
          </TabsContent>

          <TabsContent value="disputeResolver">
            {renderTabContent("disputeResolver")}
          </TabsContent>

          <TabsContent value="releaseSigner">
            {renderTabContent("releaseSigner")}
          </TabsContent>

          <TabsContent value="platformAddress">
            {renderTabContent("platformAddress")}
          </TabsContent>

          <TabsContent value="receiver">
            {renderTabContent("receiver")}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default MyEscrows;
