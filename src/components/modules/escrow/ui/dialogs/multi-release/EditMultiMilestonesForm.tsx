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

  const handleMilestoneAmountChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    let rawValue = e.target.value;
    rawValue = rawValue.replace(/[^0-9.]/g, "");

    if (rawValue.split(".").length > 2) {
      rawValue = rawValue.slice(0, -1);
    }

    // Limit to 2 decimal places
    if (rawValue.includes(".")) {
      const parts = rawValue.split(".");
      if (parts[1] && parts[1].length > 2) {
        rawValue = parts[0] + "." + parts[1].slice(0, 2);
      }
    }

    // Always keep as string to allow partial input like "0." or "0.5"
    const updatedMilestones = [...milestones];
    updatedMilestones[index] = {
      ...updatedMilestones[index],
      amount: rawValue,
    };
    form.setValue("milestones", updatedMilestones);
  };

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
              <div
                key={`milestone-${index}`}
                className="flex flex-col gap-4 p-4 border rounded-lg bg-gray-50/50"
              >
                {/* Badges Section - Responsive */}
                <div className="flex flex-wrap gap-2 items-center">
                  {milestone.flags?.approved && (
                    <Badge className="uppercase text-xs">Approved</Badge>
                  )}

                  {milestone.flags?.released && (
                    <Badge className="uppercase text-xs">Released</Badge>
                  )}

                  {milestone.flags?.resolved && (
                    <Badge className="uppercase text-xs">Resolved</Badge>
                  )}

                  {milestone.flags?.disputed && (
                    <Badge className="uppercase text-xs">Disputed</Badge>
                  )}

                  <Badge className="uppercase text-xs" variant="outline">
                    {milestone.status}
                  </Badge>
                </div>

                {/* Form Fields Section - Responsive */}
                <div className="flex flex-col lg:flex-row gap-3">
                  <div className="flex-1">
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
                  </div>

                  <div className="relative flex-1 lg:w-48">
                    <DollarSign
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                      size={18}
                    />
                    <Input
                      className="pl-10"
                      placeholder="Amount"
                      value={
                        milestone.amount ? milestone.amount.toString() : ""
                      }
                      onChange={(e) => handleMilestoneAmountChange(index, e)}
                    />
                  </div>

                  <Button
                    onClick={() => handleRemoveMilestone(index)}
                    className="p-2 bg-transparent text-red-500 rounded-md border-none shadow-none hover:bg-transparent hover:shadow-none hover:text-red-500 focus:ring-0 active:ring-0 self-start lg:self-center"
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

                {/* Add Item Button - Responsive */}
                {index === milestones.length - 1 && (
                  <Button
                    disabled={isAnyMilestoneEmpty}
                    className="w-full sm:w-auto"
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
            className="w-full sm:w-auto"
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
