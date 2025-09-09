import { Form, FormLabel } from "@/ui/form";
import TooltipInfo from "@/shared/utils/Tooltip";
import { Input } from "@/ui/input";
import { Loader2, Save, Trash2 } from "lucide-react";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { DialogFooter } from "@/ui/dialog";
import { useEditSingleMilestonesDialog } from "../../hooks/single-release/useEditSingleMilestonesDialog";

interface EditSingleMilestonesFormProps {
  setIsEditMilestoneDialogOpen: (value: boolean) => void;
  isEditingMilestones: boolean;
}

export const EditSingleMilestonesForm = ({
  setIsEditMilestoneDialogOpen,
  isEditingMilestones,
}: EditSingleMilestonesFormProps) => {
  const {
    form,
    onSubmit,
    milestones,
    handleAddMilestone,
    handleRemoveMilestone,
    isAnyMilestoneEmpty,
  } = useEditSingleMilestonesDialog({
    setIsEditMilestoneDialogOpen,
  });

  return (
    <Form {...form}>
      <div className="grid gap-4 py-4">
        <div className="flex flex-col ms-center gap-4">
          <div className="space-y-4">
            <FormLabel className="flex items-center">
              Milestones
              <TooltipInfo content="Key stages or deliverables for the escrow." />
            </FormLabel>
            {milestones.map((milestone, index) => (
              <div key={`milestone-${index}`} className="flex flex-col gap-4">
                <div className="flex items-center space-x-4">
                  {milestone?.approved ? (
                    <Badge className="uppercase max-w-24">Approved</Badge>
                  ) : (
                    <Badge className="uppercase max-w-24" variant="outline">
                      {milestone.status}
                    </Badge>
                  )}

                  <Input
                    disabled={milestone?.approved}
                    placeholder="Milestone Description"
                    value={milestone.description}
                    onChange={(e) => {
                      const updatedMilestones = [...milestones];
                      updatedMilestones[index].description = e.target.value;
                      form.setValue("milestones", updatedMilestones);
                    }}
                  />

                  <Button
                    onClick={() => handleRemoveMilestone(index)}
                    className="p-2 bg-transparent text-red-500 rounded-md border-none shadow-none hover:bg-transparent hover:shadow-none hover:text-red-500 focus:ring-0 active:ring-0"
                    disabled={milestones.length === 1 || milestone?.approved}
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
            type="button"
            onClick={() => onSubmit(form.getValues())}
            variant="success"
            disabled={isAnyMilestoneEmpty || isEditingMilestones}
          >
            {isEditingMilestones ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin flex-shrink-0" />
                <span className="truncate">Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">Save Changes</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </div>
    </Form>
  );
};
