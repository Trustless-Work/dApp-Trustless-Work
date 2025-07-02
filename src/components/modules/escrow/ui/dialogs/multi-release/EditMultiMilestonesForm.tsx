import { Form, FormLabel } from "@/components/ui/form";
import TooltipInfo from "@/components/utils/ui/Tooltip";
import { Input } from "@/components/ui/input";
import { DollarSign, Loader2, Save, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useEditMultiMilestonesDialog } from "../../../hooks/multi-release/edit-multi-milestones-dialog.hook";

interface EditMultiMilestonesFormProps {
  setIsEditMilestoneDialogOpen: (value: boolean) => void;
  isEditingMilestones: boolean;
}

export const EditMultiMilestonesForm = ({
  setIsEditMilestoneDialogOpen,
  isEditingMilestones,
}: EditMultiMilestonesFormProps) => {
  const {
    form,
    onSubmit,
    milestones,
    handleAddMilestone,
    handleRemoveMilestone,
    isAnyMilestoneEmpty,
  } = useEditMultiMilestonesDialog({
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
                  {milestone.flags?.approved && (
                    <Badge className="uppercase max-w-24">Approved</Badge>
                  )}

                  {milestone.flags?.released && (
                    <Badge className="uppercase max-w-24">Released</Badge>
                  )}

                  {milestone.flags?.resolved && (
                    <Badge className="uppercase max-w-24">Resolved</Badge>
                  )}

                  {milestone.flags?.disputed && (
                    <Badge className="uppercase max-w-24">Disputed</Badge>
                  )}

                  <Badge className="uppercase max-w-24" variant="outline">
                    {milestone.status}
                  </Badge>

                  <Input
                    disabled={
                      milestone.flags?.approved ||
                      milestone.flags?.released ||
                      milestone.flags?.resolved ||
                      milestone.flags?.disputed
                    }
                    placeholder="Milestone Description"
                    value={milestone.description}
                    onChange={(e) => {
                      const updatedMilestones = [...milestones];
                      updatedMilestones[index].description = e.target.value;
                      form.setValue("milestones", updatedMilestones);
                    }}
                  />

                  <div className="relative w-2/5">
                    <DollarSign
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                      size={18}
                    />
                    <Input
                      className="pl-10"
                      placeholder="Enter milestone amount"
                      value={
                        milestone.amount ? milestone.amount.toString() : ""
                      }
                      onChange={(e) => {
                        let rawValue = e.target.value;
                        rawValue = rawValue.replace(/[^0-9.]/g, "");

                        if (rawValue.split(".").length > 2) {
                          rawValue = rawValue.slice(0, -1);
                        }

                        const updatedMilestones = [...milestones];

                        if (rawValue === "" || rawValue === ".") {
                          updatedMilestones[index].amount = 0;
                        } else {
                          const numValue = Number(rawValue);
                          updatedMilestones[index].amount = isNaN(numValue)
                            ? 0
                            : numValue;
                        }

                        form.setValue("milestones", updatedMilestones);
                      }}
                    />
                  </div>

                  <Button
                    onClick={() => handleRemoveMilestone(index)}
                    className="p-2 bg-transparent text-red-500 rounded-md border-none shadow-none hover:bg-transparent hover:shadow-none hover:text-red-500 focus:ring-0 active:ring-0"
                    disabled={
                      milestones.length === 1 ||
                      milestone.status === "completed" ||
                      milestone.flags?.approved ||
                      milestone.flags?.released ||
                      milestone.flags?.resolved ||
                      milestone.flags?.disputed
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
            type="button"
            onClick={() => onSubmit(form.getValues())}
            className="bg-green-800 hover:bg-green-700 text-white"
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
