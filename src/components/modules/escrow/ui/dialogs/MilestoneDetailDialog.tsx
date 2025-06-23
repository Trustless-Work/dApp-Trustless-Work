"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  FileCheck2,
  User,
  Calendar,
  Hash,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  CircleAlert,
  CircleCheckBig,
} from "lucide-react";
import { useValidData } from "@/utils/hook/valid-data.hook";
import { useTranslation } from "react-i18next";
import { Escrow } from "@/@types/escrow.entity";
import {
  MultiReleaseMilestone,
  SingleReleaseMilestone,
} from "@trustless-work/escrow";
import Link from "next/link";

interface MilestoneDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMilestone: {
    milestone: MultiReleaseMilestone | SingleReleaseMilestone;
    index: number;
  } | null;
  selectedEscrow: Escrow;
  userRolesInEscrow: string[];
  activeTab: string;
  evidenceVisibleMap: Record<number, boolean>;
  setEvidenceVisibleMap: React.Dispatch<
    React.SetStateAction<Record<number, boolean>>
  >;
  loadingMilestoneStates: Record<
    number,
    {
      isDisputing: boolean;
      isReleasing: boolean;
      isResolving: boolean;
    }
  >;
  setLoadingMilestoneStates: React.Dispatch<
    React.SetStateAction<
      Record<
        number,
        {
          isDisputing: boolean;
          isReleasing: boolean;
          isResolving: boolean;
        }
      >
    >
  >;
}

export const MilestoneDetailDialog = ({
  isOpen,
  onClose,
  selectedMilestone,
}: MilestoneDetailDialogProps) => {
  const { t } = useTranslation();
  const { isValidUrl } = useValidData();

  const getMilestoneStatusBadge = (
    milestone: MultiReleaseMilestone | SingleReleaseMilestone,
  ) => {
    if (
      "disputeStartedBy" in milestone &&
      "flags" in milestone &&
      !milestone.flags?.resolved
    ) {
      return (
        <Badge variant="destructive" className="gap-1">
          <CircleAlert className="h-3.5 w-3.5" />
          <span>{t("reusable.disputed")}</span>
        </Badge>
      );
    }
    if ("flags" in milestone && milestone.flags?.released) {
      return (
        <Badge
          variant="outline"
          className="gap-1 border-green-500 text-green-600"
        >
          <CircleCheckBig className="h-3.5 w-3.5" />
          <span>{t("reusable.released")}</span>
        </Badge>
      );
    }
    if (
      "flags" in milestone &&
      milestone.flags?.resolved &&
      !milestone.flags?.disputed
    ) {
      return (
        <Badge className="uppercase text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white">
          <CheckCircle className="w-3 h-3 mr-1" />
          {t("reusable.resolved")}
        </Badge>
      );
    }
    if (
      ("flags" in milestone && milestone.flags?.approved) ||
      ("approved" in milestone && milestone.approved)
    ) {
      return (
        <Badge className="uppercase text-xs px-3 py-1 bg-green-800 hover:bg-green-800 text-white">
          <CheckCircle className="w-3 h-3 mr-1" />
          {t("reusable.approved")}
        </Badge>
      );
    }
    return (
      <Badge className="uppercase text-xs px-3 py-1" variant="outline">
        <Clock className="w-3 h-3 mr-1" />
        {t(`reusable.${milestone.status?.toLowerCase() ?? "pending"}`)}
      </Badge>
    );
  };

  const getFlagBadge = (
    flag: boolean,
    label: string,
    variant: "default" | "secondary" | "destructive" = "default",
  ) => {
    return (
      <Badge
        variant={flag ? variant : "secondary"}
        className="px-3 py-1 text-xs font-medium"
      >
        {flag ? (
          <>
            <CheckCircle className="w-3 h-3 mr-1" />
            {label}
          </>
        ) : (
          <>
            <XCircle className="w-3 h-3 mr-1" />
            {label}
          </>
        )}
      </Badge>
    );
  };

  if (!selectedMilestone) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
              <Hash className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">
                Milestone {selectedMilestone.index + 1}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Detailed information about this milestone
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Status Overview */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-background rounded-full shadow-sm border border-border">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Current Status
                </p>
                <p className="text-xs text-muted-foreground">
                  Milestone progress
                </p>
              </div>
            </div>
            {getMilestoneStatusBadge(selectedMilestone.milestone)}
          </div>

          {/* Basic Information */}
          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-1 h-6 bg-primary rounded-full"></div>
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-muted-foreground" />
                  Description
                </label>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md border-l-4 border-primary/20">
                  {selectedMilestone.milestone.description}
                </p>
              </div>

              {"amount" in selectedMilestone.milestone && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                    Amount
                  </label>
                  <div className="flex items-center gap-2 bg-green-500/10 dark:bg-green-400/10 p-3 rounded-md border-l-4 border-green-500/20 dark:border-green-400/20">
                    <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-lg font-bold text-green-700 dark:text-green-300">
                      {selectedMilestone.milestone.amount}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Evidence Section */}
          {selectedMilestone.milestone.evidence && (
            <Card className="border border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-1 h-6 bg-green-600 dark:bg-green-400 rounded-full"></div>
                  Evidence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                    Evidence URL
                  </label>
                  <div className="bg-muted/50 p-3 rounded-md border-l-4 border-green-500/20 dark:border-green-400/20">
                    {(() => {
                      const result = isValidUrl(
                        selectedMilestone.milestone.evidence,
                      );
                      return (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground break-all pr-2">
                            {selectedMilestone.milestone.evidence}
                          </span>
                          {(result === true ||
                            (result &&
                              typeof result === "object" &&
                              result.warning)) && (
                            <Link
                              href={selectedMilestone.milestone.evidence}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button
                                size="sm"
                                variant="outline"
                                className="shrink-0"
                              >
                                <ExternalLink className="w-4 h-4 mr-1" />
                                Open
                              </Button>
                            </Link>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Dispute Information */}
          {"disputeStartedBy" in selectedMilestone.milestone && (
            <Card className="border border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-1 h-6 bg-red-600 dark:bg-red-400 rounded-full"></div>
                  Dispute Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 bg-red-500/10 dark:bg-red-400/10 p-3 rounded-md border-l-4 border-red-500/20 dark:border-red-400/20">
                  <User className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <div>
                    <p className="text-sm font-medium text-red-700 dark:text-red-300">
                      Disputed by:{" "}
                      {selectedMilestone.milestone.disputeStartedBy ===
                      "serviceProvider"
                        ? t("reusable.serviceProvider")
                        : t("reusable.approver")}
                    </p>
                    <p className="text-xs text-red-600 dark:text-red-400">
                      This milestone is currently under dispute
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Flags Information */}
          {"flags" in selectedMilestone.milestone && (
            <Card className="border border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-1 h-6 bg-purple-600 dark:bg-purple-400 rounded-full"></div>
                  Milestone Flags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                    <span className="text-sm font-medium text-foreground">
                      Approved
                    </span>
                    {getFlagBadge(
                      selectedMilestone.milestone.flags?.approved || false,
                      "Approved",
                      "default",
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                    <span className="text-sm font-medium text-foreground">
                      Released
                    </span>
                    {getFlagBadge(
                      selectedMilestone.milestone.flags?.released || false,
                      "Released",
                      "default",
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                    <span className="text-sm font-medium text-foreground">
                      Disputed
                    </span>
                    {getFlagBadge(
                      selectedMilestone.milestone.flags?.disputed || false,
                      "Disputed",
                      "destructive",
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                    <span className="text-sm font-medium text-foreground">
                      Resolved
                    </span>
                    {getFlagBadge(
                      selectedMilestone.milestone.flags?.resolved || false,
                      "Resolved",
                      "default",
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
