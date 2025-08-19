import useMyEscrows from "../../hooks/useMyEscrows";
import { Card } from "@/ui/card";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import NoData from "@/shared/utils/NoData";
import EscrowDetailDialog from "../dialogs/EscrowDetailDialog";
import { useEscrowUIBoundedStore } from "../../store/ui";
import { useGlobalBoundedStore } from "@/store/data";
import SuccessDialog, {
  SuccessReleaseDialog,
  SuccessResolveDisputeDialog,
} from "../dialogs/SuccessDialog";
import SkeletonCards from "../utils/SkeletonCards";
import { Button } from "@/ui/button";
import EscrowCard from "./EscrowCard";
import { Escrow } from "@/types/escrow.entity";
import { Role } from "@trustless-work/escrow";

interface MyEscrowsCardsProps {
  role: Role;
}

const MyEscrowsCards = ({ role }: MyEscrowsCardsProps) => {
  const isDialogOpen = useEscrowUIBoundedStore((state) => state.isDialogOpen);
  const setIsDialogOpen = useEscrowUIBoundedStore(
    (state) => state.setIsDialogOpen,
  );
  const setSelectedEscrow = useGlobalBoundedStore(
    (state) => state.setSelectedEscrow,
  );
  const isSuccessDialogOpen = useEscrowUIBoundedStore(
    (state) => state.isSuccessDialogOpen,
  );
  const setIsSuccessDialogOpen = useEscrowUIBoundedStore(
    (state) => state.setIsSuccessDialogOpen,
  );
  const isSuccessReleaseDialogOpen = useEscrowUIBoundedStore(
    (state) => state.isSuccessReleaseDialogOpen,
  );
  const setIsSuccessReleaseDialogOpen = useEscrowUIBoundedStore(
    (state) => state.setIsSuccessReleaseDialogOpen,
  );
  const isSuccessResolveDisputeDialogOpen = useEscrowUIBoundedStore(
    (state) => state.isSuccessResolveDisputeDialogOpen,
  );
  const setIsSuccessResolveDisputeDialogOpen = useEscrowUIBoundedStore(
    (state) => state.setIsSuccessResolveDisputeDialogOpen,
  );
  const recentEscrow = useGlobalBoundedStore((state) => state.recentEscrow);

  const {
    escrows,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    itemsPerPageOptions,
    isLoading,
    setItemsPerPage,
    setCurrentPage,
  } = useMyEscrows({ role });

  const handleCardClick = (escrow: Escrow) => {
    setIsDialogOpen(true);
    setSelectedEscrow(escrow);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonCards />
      ) : escrows.length !== 0 ? (
        <div className="py-3" id="step-3">
          <div className="flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {escrows.map((escrow, index) => (
                <EscrowCard
                  key={index}
                  escrow={escrow}
                  onCardClick={handleCardClick}
                />
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mt-8 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  Items per page:
                </span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => setItemsPerPage(Number(value))}
                >
                  <SelectTrigger className="w-20 h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {itemsPerPageOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value.toString()}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 justify-between sm:justify-end">
                <Button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  Page {currentPage} of {totalPages} ({totalItems} total)
                </span>
                <Button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Card className={cn("overflow-hidden")}>
          <NoData isCard={true} />
        </Card>
      )}

      {/* Dialog */}
      <EscrowDetailDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        setSelectedEscrow={setSelectedEscrow}
      />

      {/* Success Dialog */}
      <SuccessDialog
        isSuccessDialogOpen={isSuccessDialogOpen}
        setIsSuccessDialogOpen={setIsSuccessDialogOpen}
        title="Escrow initialized successfully"
        description="Now that your escrow is initialized, you will be able to view it directly in"
        recentEscrow={recentEscrow}
      />

      {/* Success Release Dialog */}
      <SuccessReleaseDialog
        isSuccessReleaseDialogOpen={isSuccessReleaseDialogOpen}
        setIsSuccessReleaseDialogOpen={setIsSuccessReleaseDialogOpen}
        title={"Escrow released"}
        description="Now that your escrow is released, you will be able to view it directly in"
        recentEscrow={recentEscrow}
      />

      {/* Success Resolve Dispute Dialog */}
      <SuccessResolveDisputeDialog
        isSuccessResolveDisputeDialogOpen={isSuccessResolveDisputeDialogOpen}
        setIsSuccessResolveDisputeDialogOpen={
          setIsSuccessResolveDisputeDialogOpen
        }
        title={"Escrow's dispute resolved"}
        description="Now that your escrow's dispute is resolved, you will be able to view it directly in"
        recentEscrow={recentEscrow}
      />
    </>
  );
};

export default MyEscrowsCards;
