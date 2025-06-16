import { useFormatUtils } from "@/utils/hook/format.hook";
import { useEscrowUIBoundedStore } from "../../../store/ui";
import useReleaseFundsEscrowDialog from "../../../hooks/release-funds-dialog.hook";
import { Button } from "@/components/ui/button";
import { CircleDollarSign, Loader2 } from "lucide-react";
import { Escrow } from "@/@types/escrow.entity";
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
  const isReleasingFunds = useEscrowUIBoundedStore(
    (state) => state.isReleasingFunds,
  );

  const { releaseFundsSubmit } = useReleaseFundsEscrowDialog();
  const { formatDateFromFirebase } = useFormatUtils();

  return (
    <>
      <div className="flex gap-4">
        <p className="italic text-sm sm:mb-0 mb-3">
          <span className="font-bold mr-1">
            {t("escrowDetailDialog.created")}:
          </span>
          {formatDateFromFirebase(
            selectedEscrow.createdAt.seconds,
            selectedEscrow.createdAt.nanoseconds,
          )}
        </p>
      </div>

      {areAllMilestonesCompleted &&
        areAllMilestonesCompletedAndFlag &&
        userRolesInEscrow.includes("releaseSigner") &&
        !selectedEscrow.flags?.released &&
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
