import { useFormatUtils } from "@/utils/hook/format.hook";
import { useEscrowUIBoundedStore } from "../../../store/ui";
import useReleaseFundsEscrowDialog from "../../../hooks/release-funds-dialog.hook";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleDollarSign, Loader2 } from "lucide-react";
import { Escrow } from "@/@types/escrows/escrow.entity";
import { useTranslation } from "react-i18next";

interface FooterDetailsProps {
  selectedEscrow: Escrow;
  userRolesInEscrow: string[];
  areAllMilestonesCompleted: boolean;
  areAllMilestonesCompletedAndFlag: boolean;
}

export const FooterDetails = ({
  selectedEscrow,
  userRolesInEscrow,
  areAllMilestonesCompleted,
  areAllMilestonesCompletedAndFlag,
}: FooterDetailsProps) => {
  const { t } = useTranslation();
  const activeTab = useEscrowUIBoundedStore((state) => state.activeTab);
  const receiverAmount = useEscrowUIBoundedStore(
    (state) => state.receiverAmount,
  );
  const isReleasingFunds = useEscrowUIBoundedStore(
    (state) => state.isReleasingFunds,
  );

  const platformFeeAmount = useEscrowUIBoundedStore(
    (state) => state.platformFeeAmount,
  );
  const trustlessWorkAmount = useEscrowUIBoundedStore(
    (state) => state.trustlessWorkAmount,
  );

  const { releaseFundsSubmit } = useReleaseFundsEscrowDialog();

  const { formatDateFromFirebase } = useFormatUtils();

  return (
    <>
      <p className="italic text-sm sm:mb-0 mb-3">
        <span className="font-bold mr-1">
          {t("escrowDetailDialog.created")}:
        </span>
        {formatDateFromFirebase(
          selectedEscrow.createdAt.seconds,
          selectedEscrow.createdAt.nanoseconds,
        )}
      </p>
      {!selectedEscrow.flags?.releaseFlag &&
        !selectedEscrow.flags?.resolvedFlag && (
          <Card className="flex items-center p-5">
            <CardTitle className="text-sm font-bold border-r-2 border-r-gray-300 px-3">
              {t("escrowDetailDialog.releaseAmountDistribution")}
            </CardTitle>

            <div className="pl-3 flex gap-10 sm:flex-row flex-col">
              <p className="text-sm">
                <strong>{t("escrowDetailDialog.receiver")}:</strong> $
                {receiverAmount.toFixed(2)}
              </p>
              <p className="text-sm">
                <strong>{t("escrowDetailDialog.platformFee")}:</strong> $
                {platformFeeAmount.toFixed(2)}
              </p>
              <p className="text-sm">
                <strong>{t("escrowDetailDialog.trustlessWork")}:</strong> $
                {trustlessWorkAmount.toFixed(2)}
              </p>
            </div>
          </Card>
        )}
      {areAllMilestonesCompleted &&
        areAllMilestonesCompletedAndFlag &&
        userRolesInEscrow.includes("releaseSigner") &&
        !selectedEscrow.flags?.releaseFlag &&
        activeTab === "releaseSigner" && (
          <Button
            onClick={releaseFundsSubmit}
            type="button"
            className="bg-green-800 hover:bg-green-700 mb-4 md:mb-0 w-full md:w-auto"
            disabled={isReleasingFunds}
          >
            {isReleasingFunds ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("escrowDetailDialog.releasing")}
              </>
            ) : (
              <>
                <CircleDollarSign />
                {t("escrowDetailDialog.releaseFunds")}
              </>
            )}
          </Button>
        )}
    </>
  );
};
