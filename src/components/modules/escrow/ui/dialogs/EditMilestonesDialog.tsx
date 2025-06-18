import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGlobalBoundedStore } from "@/core/store/data";
import { Form, FormLabel } from "@/components/ui/form";
import TooltipInfo from "@/components/utils/ui/Tooltip";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEscrowUIBoundedStore } from "../../store/ui";
import SkeletonEditMilestones from "./utils/SkeletonEditMilestones";
import { useEditSingleMilestonesDialog } from "../../hooks/single-release/edit-single-milestones-dialog.hook";

interface EditEscrowDialogProps {
  isEditMilestoneDialogOpen: boolean;
  setIsEditMilestoneDialogOpen: (value: boolean) => void;
}

const EditMilestonesDialog = ({
  isEditMilestoneDialogOpen,
  setIsEditMilestoneDialogOpen,
}: EditEscrowDialogProps) => {
  const {
    form,
    onSubmit,
    handleClose,
    milestones,
    handleAddMilestone,
    handleRemoveMilestone,
    isAnyMilestoneEmpty,
  } = useEditSingleMilestonesDialog({
    setIsEditMilestoneDialogOpen,
  });

  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const isEditingMilestones = useEscrowUIBoundedStore(
    (state) => state.isEditingMilestones,
  );

  if (!selectedEscrow) return null;

  return (
    <Dialog open={isEditMilestoneDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editing - {selectedEscrow?.title}</DialogTitle>
          <DialogDescription>
            You can edit escrow milestones, but not if they're completed or
            approved.
          </DialogDescription>
        </DialogHeader>

        {isEditingMilestones ? (
          <SkeletonEditMilestones />
        ) : (
          <Form {...form}>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col ms-center gap-4">
                <div className="space-y-4">
                  <FormLabel className="flex items-center">
                    Milestones
                    <TooltipInfo content="Key stages or deliverables for the escrow." />
                  </FormLabel>
                  {milestones.map((milestone, index) => (
                    <div
                      key={`milestone-${index}`}
                      className="flex flex-col gap-4"
                    >
                      <div className="flex items-center space-x-4">
                        {milestone.flags?.approved ? (
                          <Badge className="uppercase max-w-24">Approved</Badge>
                        ) : (
                          <Badge
                            className="uppercase max-w-24"
                            variant="outline"
                          >
                            {milestone.status}
                          </Badge>
                        )}

                        <Input
                          disabled={milestone.flags?.approved}
                          placeholder="Milestone Description"
                          value={milestone.description}
                          onChange={(e) => {
                            const updatedMilestones = [...milestones];
                            updatedMilestones[index].description =
                              e.target.value;
                            form.setValue("milestones", updatedMilestones);
                          }}
                        />

                        <Button
                          onClick={() => handleRemoveMilestone(index)}
                          className="p-2 bg-transparent text-red-500 rounded-md border-none shadow-none hover:bg-transparent hover:shadow-none hover:text-red-500 focus:ring-0 active:ring-0"
                          disabled={
                            index === 0 ||
                            milestone.status === "completed" ||
                            milestone.flags?.approved
                          }
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>

                      {index === milestones.length - 1 && (
                        <Button
                          disabled={isAnyMilestoneEmpty}
                          className="w-full md:w-1/4"
                          variant="outline"
                          onClick={handleAddMilestone}
                          type="button"
                        >
                          Add Item
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <DialogFooter>
                <Button
                  disabled={isAnyMilestoneEmpty}
                  type="button"
                  onClick={() => onSubmit(form.getValues())}
                >
                  Save
                </Button>
              </DialogFooter>
            </div>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditMilestonesDialog;
