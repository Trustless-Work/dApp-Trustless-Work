/* eslint-disable @typescript-eslint/no-explicit-any */

import { Card } from "@/ui/card";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tab";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { useGlobalUIBoundedStore } from "@/store/ui";
import Joyride from "react-joyride";
import { useState, useCallback, useMemo } from "react";
import { CircleHelp } from "lucide-react";
import { useGlobalBoundedStore } from "@/store/data";
import TooltipInfo from "@/shared/utils/Tooltip";
import { useTranslation } from "react-i18next";
import { Role } from "@trustless-work/escrow/types";
import useIsMobile from "@/hooks/useMobile";
import { useEscrowUIBoundedStore } from "../../store/ui";

import { steps } from "@/constants/steps-tutorials.constant";
import { MoonpayWidget } from "@/widgets/moonpay.widget";
import { EscrowsByRoleTable } from "@/components/tw-blocks/escrows/escrows-by-role/table/EscrowsTable";
import { EscrowsByRoleCards } from "@/components/tw-blocks/escrows/escrows-by-role/cards/EscrowsCards";
import { EscrowsBySignerTable } from "@/components/tw-blocks/escrows/escrows-by-signer/table/EscrowsTable";
import { EscrowsBySignerCards } from "@/components/tw-blocks/escrows/escrows-by-signer/cards/EscrowsCards";

export const MyEscrows = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const setActiveTab = useEscrowUIBoundedStore((state) => state.setActiveTab);
  const activeTab = useEscrowUIBoundedStore((state) => state.activeTab);
  const setActiveMode = useEscrowUIBoundedStore((state) => state.setActiveMode);
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const activeMode = useEscrowUIBoundedStore((state) => state.activeMode);
  const theme = useGlobalUIBoundedStore((state) => state.theme);

  const [run, setRun] = useState(false);
  const isMoonpayWidgetOpen = useEscrowUIBoundedStore(
    (state) => state.isMoonpayWidgetOpen,
  );

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

  // Memoized component renderers to prevent unnecessary re-renders
  // Only render based on activeMode, components will handle their own data fetching
  const renderSignerContent = useMemo(() => {
    if (activeMode === "table") {
      return <EscrowsBySignerTable />;
    }
    return <EscrowsBySignerCards />;
  }, [activeMode]);

  // Create memoized renderers for each role to avoid recreating functions
  const renderApproverContent = useMemo(() => {
    if (activeMode === "table") {
      return (
        <Card className={cn("overflow-hidden")}>
          <EscrowsByRoleTable role="approver" />
        </Card>
      );
    }
    return <EscrowsByRoleCards role="approver" />;
  }, [activeMode]);

  const renderServiceProviderContent = useMemo(() => {
    if (activeMode === "table") {
      return (
        <Card className={cn("overflow-hidden")}>
          <EscrowsByRoleTable role="serviceProvider" />
        </Card>
      );
    }
    return <EscrowsByRoleCards role="serviceProvider" />;
  }, [activeMode]);

  const renderDisputeResolverContent = useMemo(() => {
    if (activeMode === "table") {
      return (
        <Card className={cn("overflow-hidden")}>
          <EscrowsByRoleTable role="disputeResolver" />
        </Card>
      );
    }
    return <EscrowsByRoleCards role="disputeResolver" />;
  }, [activeMode]);

  const renderReleaseSignerContent = useMemo(() => {
    if (activeMode === "table") {
      return (
        <Card className={cn("overflow-hidden")}>
          <EscrowsByRoleTable role="releaseSigner" />
        </Card>
      );
    }
    return <EscrowsByRoleCards role="releaseSigner" />;
  }, [activeMode]);

  const renderPlatformAddressContent = useMemo(() => {
    if (activeMode === "table") {
      return (
        <Card className={cn("overflow-hidden")}>
          <EscrowsByRoleTable role="platformAddress" />
        </Card>
      );
    }
    return <EscrowsByRoleCards role="platformAddress" />;
  }, [activeMode]);

  const renderReceiverContent = useMemo(() => {
    if (activeMode === "table") {
      return (
        <Card className={cn("overflow-hidden")}>
          <EscrowsByRoleTable role="receiver" />
        </Card>
      );
    }
    return <EscrowsByRoleCards role="receiver" />;
  }, [activeMode]);

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

          <TabsContent value="signer">{renderSignerContent}</TabsContent>

          <TabsContent value="approver">{renderApproverContent}</TabsContent>

          <TabsContent value="serviceProvider">
            {renderServiceProviderContent}
          </TabsContent>

          <TabsContent value="disputeResolver">
            {renderDisputeResolverContent}
          </TabsContent>

          <TabsContent value="releaseSigner">
            {renderReleaseSignerContent}
          </TabsContent>

          <TabsContent value="platformAddress">
            {renderPlatformAddressContent}
          </TabsContent>

          <TabsContent value="receiver">{renderReceiverContent}</TabsContent>
        </Tabs>
      </div>
    </>
  );
};
