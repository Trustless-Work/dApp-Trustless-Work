/* eslint-disable @typescript-eslint/no-explicit-any */

import { Card } from "@/ui/card";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import { Button } from "@/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { useGlobalUIBoundedStore } from "@/store/ui";
import Joyride from "react-joyride";
import { useState, useCallback, useMemo, useEffect } from "react";
import {
  CircleHelp,
  ChevronsUpDown,
  Check,
  PenLine,
  ShieldCheck,
  Briefcase,
  Scale,
  Unlock,
  Building2,
  Inbox,
} from "lucide-react";
import TooltipInfo from "@/shared/utils/Tooltip";
import { useTranslation } from "react-i18next";
import { Role } from "@trustless-work/escrow/types";
import { useEscrowUIBoundedStore } from "../../store/ui";
import { steps } from "@/constants/steps-tutorials.constant";
import { EscrowsByRoleTable } from "@/components/tw-blocks/escrows/escrows-by-role/EscrowsTable";
import { EscrowsBySignerTable } from "@/components/tw-blocks/escrows/escrows-by-signer/EscrowsTable";
import { EscrowsBySignerCards } from "@/components/tw-blocks/escrows/escrows-by-signer/EscrowsCards";
import { EscrowsByRoleCards } from "@/components/tw-blocks/escrows/escrows-by-role/EscrowsCards";

export const MyEscrows = () => {
  const { t } = useTranslation();
  const setActiveTab = useEscrowUIBoundedStore((state) => state.setActiveTab);
  const activeTab = useEscrowUIBoundedStore((state) => state.activeTab);
  const setActiveMode = useEscrowUIBoundedStore((state) => state.setActiveMode);
  const activeMode = useEscrowUIBoundedStore((state) => state.activeMode);
  const theme = useGlobalUIBoundedStore((state) => state.theme);

  const [run, setRun] = useState(false);
  const [roleCommandOpen, setRoleCommandOpen] = useState(false);
  // const isMoonpayWidgetOpen = useEscrowUIBoundedStore(
  //   (state) => state.isMoonpayWidgetOpen,
  // );

  const handleSetActiveTab = useCallback(
    (tab: Role) => {
      setActiveTab(tab);
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

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key?.toLowerCase();
      if (key !== "k") return;
      if (!e.ctrlKey && !e.metaKey) return;

      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const isTypingContext =
        tag === "input" ||
        tag === "textarea" ||
        target?.getAttribute("contenteditable") === "true";
      if (isTypingContext) return;

      e.preventDefault();
      setRoleCommandOpen(true);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
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
      { value: "signer", label: t("myEscrows.tabs.signer"), icon: PenLine },
      {
        value: "approver",
        label: t("myEscrows.tabs.approver"),
        icon: ShieldCheck,
      },
      {
        value: "serviceProvider",
        label: t("myEscrows.tabs.serviceProvider"),
        icon: Briefcase,
      },
      {
        value: "disputeResolver",
        label: t("myEscrows.tabs.disputeResolver"),
        icon: Scale,
      },
      {
        value: "releaseSigner",
        label: t("myEscrows.tabs.releaseSigner"),
        icon: Unlock,
      },
      {
        value: "platformAddress",
        label: t("myEscrows.tabs.platformAddress"),
        icon: Building2,
      },
      { value: "receiver", label: t("myEscrows.tabs.receiver"), icon: Inbox },
    ],
    [t],
  );

  const activeTabLabel = useMemo(() => {
    return tabOptions.find((opt) => opt.value === activeTab)?.label ?? "";
  }, [activeTab, tabOptions]);

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
      {/* <MoonpayWidget
        visible={isMoonpayWidgetOpen}
        wallet={selectedEscrow?.contractId || ""}
      /> */}

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
        <div className="w-full flex flex-col gap-4">
          {/* Toolbar: role picker + view mode + help */}
          <div className="flex w-full items-center gap-2 flex-wrap">
            {/* Role picker */}
            <Popover open={roleCommandOpen} onOpenChange={setRoleCommandOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={roleCommandOpen}
                  className="flex-1 min-w-[200px] justify-between font-normal"
                  id="step-1"
                >
                  <span className="flex items-center gap-2 truncate">
                    {(() => {
                      const active = tabOptions.find(
                        (o) => o.value === activeTab,
                      );
                      const Icon = active?.icon;
                      return (
                        <>
                          {Icon && (
                            <Icon className="size-4 shrink-0 text-muted-foreground" />
                          )}
                          <span className="truncate">{activeTabLabel}</span>
                        </>
                      );
                    })()}
                  </span>
                  <span className="flex items-center gap-1.5 shrink-0 ml-2">
                    <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                      <span>⌘</span>K
                    </kbd>
                    <ChevronsUpDown className="size-4 text-muted-foreground" />
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder={t("myEscrows.tabs.placeholder")}
                    autoFocus
                  />
                  <CommandList>
                    <CommandEmpty>
                      {t("myEscrows.tabs.placeholder")}
                    </CommandEmpty>
                    <CommandGroup heading={t("myEscrows.tabs.role")}>
                      {tabOptions.map((option) => {
                        const isActive = activeTab === option.value;
                        const Icon = option.icon;
                        return (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={() => {
                              handleSetActiveTab(option.value as Role);
                              setRoleCommandOpen(false);
                            }}
                            className="flex items-center gap-2"
                          >
                            <Icon
                              className={cn(
                                "size-4 shrink-0",
                                isActive
                                  ? "text-primary"
                                  : "text-muted-foreground",
                              )}
                            />
                            <span className="flex-1">{option.label}</span>
                            <Check
                              className={cn(
                                "size-4 shrink-0",
                                isActive
                                  ? "opacity-100 text-primary"
                                  : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* View mode selector */}
            <Select value={activeMode} onValueChange={handleSetActiveMode}>
              <SelectTrigger className="w-32 shrink-0">
                <SelectValue placeholder={t("myEscrows.view.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                {viewOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Help walkthrough */}
            <TooltipInfo content={t("reusable.tooltips.help")}>
              <button
                className="btn-dark shrink-0"
                type="button"
                onClick={handleStartTutorial}
              >
                <CircleHelp size={20} />
              </button>
            </TooltipInfo>
          </div>

          <div className="w-full">
            {activeTab === "signer" ? renderSignerContent : null}
            {activeTab === "approver" ? renderApproverContent : null}
            {activeTab === "serviceProvider"
              ? renderServiceProviderContent
              : null}
            {activeTab === "disputeResolver"
              ? renderDisputeResolverContent
              : null}
            {activeTab === "releaseSigner" ? renderReleaseSignerContent : null}
            {activeTab === "platformAddress"
              ? renderPlatformAddressContent
              : null}
            {activeTab === "receiver" ? renderReceiverContent : null}
          </div>
        </div>
      </div>
    </>
  );
};
