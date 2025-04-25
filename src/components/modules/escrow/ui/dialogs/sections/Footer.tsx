import { useFormatUtils } from "@/utils/hook/format.hook";
import { useEscrowUIBoundedStore } from "../../../store/ui";
import useDistributeEarningsEscrowDialog from "../hooks/distribute-earnings-escrow-dialog.hook";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleDollarSign } from "lucide-react";
import { Escrow } from "@/@types/escrow.entity";

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
  const activeTab = useEscrowUIBoundedStore((state) => state.activeTab);
  const receiverAmount = useEscrowUIBoundedStore(
    (state) => state.receiverAmount,
  );
  const platformFeeAmount = useEscrowUIBoundedStore(
    (state) => state.platformFeeAmount,
  );
  const trustlessWorkAmount = useEscrowUIBoundedStore(
    (state) => state.trustlessWorkAmount,
  );

  const { distributeEscrowEarningsSubmit } =
    useDistributeEarningsEscrowDialog();

  const { formatDateFromFirebase } = useFormatUtils();

  return (
    <>
      <p className="italic text-sm sm:mb-0 mb-3">
        <span className="font-bold mr-1">Created:</span>
        {formatDateFromFirebase(
          selectedEscrow.createdAt.seconds,
          selectedEscrow.createdAt.nanoseconds,
        )}
      </p>
      {!selectedEscrow.releaseFlag && !selectedEscrow.resolvedFlag && (
        <Card className="flex gap-10 items-center p-5">
          <CardTitle className="text-sm font-bold border-r-2 border-r-gray-300 pr-3">
            Release Amount Distribution
          </CardTitle>

          <div className="flex gap-10 sm:flex-row flex-col">
            <p className="text-sm">
              <strong>Receiver:</strong> ${receiverAmount.toFixed(2)}
            </p>
            <p className="text-sm">
              <strong>Platform Fee:</strong> ${platformFeeAmount.toFixed(2)}
            </p>
            <p className="text-sm">
              <strong>Trustless Work:</strong> ${trustlessWorkAmount.toFixed(2)}
            </p>
          </div>
        </Card>
      )}
      {areAllMilestonesCompleted &&
        areAllMilestonesCompletedAndFlag &&
        userRolesInEscrow.includes("releaseSigner") &&
        !selectedEscrow.releaseFlag &&
        activeTab === "releaseSigner" && (
          <Button
            onClick={distributeEscrowEarningsSubmit}
            type="button"
            className="bg-green-800 hover:bg-green-700 mb-4 md:mb-0 w-full md:w-auto"
          >
            <CircleDollarSign />
            Release Payment
          </Button>
        )}
    </>
  );
};
