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
} from "lucide-react";
import { useFormatUtils } from "@/utils/hook/format.hook";
import { useTranslation } from "react-i18next";
import { Escrow } from "@/@types/escrow.entity";
import TooltipInfo from "@/components/utils/ui/Tooltip";
import ProgressEscrow from "../dialogs/utils/ProgressEscrow";
import { getStatusBadge } from "@/components/utils/ui/StatusBadge";
import { MultiReleaseMilestone } from "@trustless-work/escrow";

interface EscrowCardProps {
  escrow: Escrow;
  onCardClick: (escrow: Escrow) => void;
}

const EscrowCard = ({ escrow, onCardClick }: EscrowCardProps) => {
  const { t } = useTranslation();
  const { formatDateFromFirebase, formatDollar } = useFormatUtils();

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

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-md transition-all border border-border/40 min-h-[280px] flex flex-col justify-between"
      onClick={(e) => {
        e.stopPropagation();
        onCardClick(escrow);
      }}
    >
      <div>
        <CardHeader className="p-4 pb-0 flex-col sm:flex-row justify-between items-start space-y-2 sm:space-y-0">
          <div className="space-y-1.5 w-full sm:w-2/3">
            <CardTitle className="text-base font-medium line-clamp-2">
              {escrow.title || "No title"}
            </CardTitle>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {escrow.description || "No description"}
            </p>
          </div>

          <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
            {escrow.type === "single-release" && getStatusBadge(escrow)}

            <TooltipInfo content="View from TW Escrow Viewer">
              <Link
                href={`https://viewer.trustlesswork.com/${escrow.contractId}`}
                target="_blank"
                className="sm:ml-2"
              >
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
            <h3 className="text-xl sm:text-2xl font-semibold">
              <span className="font-extrabold">
                {formatDollar(escrow?.balance) || "N/A"}
              </span>
              <span className="text-sm text-muted-foreground font-normal ml-1">
                of {formatDollar(calculateTotalAmount(escrow)) || "N/A"}
              </span>
            </h3>
          </div>

          <ProgressEscrow escrow={escrow} />
        </CardContent>
      </div>

      <CardFooter className="p-4 pt-0 justify-between items-end mt-auto">
        <Badge variant="outline" className="gap-2">
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

        <p className="text-xs text-muted-foreground italic">
          Created:{" "}
          {formatDateFromFirebase(
            escrow.createdAt.seconds,
            escrow.createdAt.nanoseconds,
          )}
        </p>
      </CardFooter>
    </Card>
  );
};

export default EscrowCard;
