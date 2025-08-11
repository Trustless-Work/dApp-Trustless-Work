import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  ExternalLink,
  GalleryHorizontalEnd,
  AudioWaveform,
  Hash,
} from "lucide-react";
import { useFormatUtils } from "@/utils/hook/format.hook";
import { useTranslation } from "react-i18next";
import { Escrow } from "@/@types/escrow.entity";
import TooltipInfo from "@/components/utils/ui/Tooltip";
import {
  getMultiReleaseStatusBadge,
  getStatusBadge,
} from "@/components/utils/ui/Status";
import { MultiReleaseMilestone } from "@trustless-work/escrow";
import useNetwork from "@/hooks/useNetwork";

interface EscrowCardProps {
  escrow: Escrow;
  onCardClick: (escrow: Escrow) => void;
}

const EscrowCard = ({ escrow, onCardClick }: EscrowCardProps) => {
  const { t } = useTranslation();
  const { currentNetwork } = useNetwork();
  const { formatDateFromFirebase, formatCurrency } = useFormatUtils();

  const calculateTotalAmount = (escrow: Escrow) => {
    //todo: move to utils function
    if (!escrow) return 0;

    const milestones = escrow.milestones as MultiReleaseMilestone[];

    if (escrow?.type === "single-release") {
      return escrow.amount;
    } else {
      return milestones.reduce(
        (acc, milestone) => acc + Number(milestone.amount),
        0,
      );
    }
  };

  // Get the appropriate escrow viewer URL based on network
  const escrowViewerUrl =
    currentNetwork === "testnet"
      ? `https://viewer.trustlesswork.com/${escrow.contractId}`
      : `https://viewer.trustlesswork.com/${escrow.contractId}`;

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-md transition-all border border-border/40 min-h-[220px] flex flex-col justify-between"
      onClick={(e) => {
        e.stopPropagation();
        onCardClick(escrow);
      }}
    >
      <CardHeader className="p-4 pb-0 flex flex-col sm:flex-row justify-between items-start space-y-3 sm:space-y-0">
        <div className="space-y-1.5 w-full sm:w-2/3">
          <CardTitle className="text-base font-medium line-clamp-2">
            {escrow.title || "No title"}
          </CardTitle>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {escrow.description || "No description"}
          </p>
        </div>

        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto justify-between sm:justify-start">
          {escrow.type === "single-release" && getStatusBadge(escrow)}

          {escrow.type === "multi-release" &&
            getMultiReleaseStatusBadge(escrow)}

          <TooltipInfo content="View from TW Escrow Viewer">
            <Link href={escrowViewerUrl} target="_blank" className="sm:ml-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-transparent"
              >
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>
          </TooltipInfo>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="mt-2">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold">
            <span className="font-extrabold">
              {formatCurrency(escrow?.balance, escrow.trustline?.name)}
            </span>
            <span className="text-xs sm:text-sm text-muted-foreground font-normal ml-1">
              of{" "}
              {formatCurrency(
                calculateTotalAmount(escrow),
                escrow.trustline?.name,
              )}
            </span>
          </h3>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-0 mt-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
          <Badge variant="outline" className="gap-2 w-fit">
            {escrow.type === "multi-release" ? (
              <GalleryHorizontalEnd className="h-3.5 w-3.5" />
            ) : (
              <AudioWaveform className="h-3.5 w-3.5" />
            )}
            <span>
              {escrow.type === "multi-release"
                ? t("reusable.multiRelease")
                : t("reusable.singleRelease")}
            </span>
          </Badge>

          <TooltipInfo content="Number of milestones">
            <Badge variant="outline" className="gap-2 w-fit">
              <Hash className="h-3.5 w-3.5" />
              <span>{escrow.milestones.length}</span>
            </Badge>
          </TooltipInfo>
        </div>

        <p className="text-xs text-muted-foreground italic w-full sm:w-auto text-center sm:text-right">
          Created:{" "}
          {formatDateFromFirebase(
            escrow.createdAt._seconds,
            escrow.createdAt._nanoseconds,
          )}
        </p>
      </CardFooter>
    </Card>
  );
};

export default EscrowCard;
