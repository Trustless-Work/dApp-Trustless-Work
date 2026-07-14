"use client";

import { PlusIcon, Trash2Icon } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CREATE_ESCROW_PLACEHOLDERS } from "@/features/escrows/constants/create-escrow.constants";
import type { ManageMilestonesFormData } from "@/features/escrows/schemas/escrow-action.schemas";
import type { StoredEscrow } from "@/features/escrows/types/escrow.types";
import { getApprovalsTargetHint } from "@/features/escrows/utils/create-escrow.helper";
import { createEmptyNewMilestone } from "@/features/escrows/utils/manage-milestones.helper";

type ManageMilestonesFormProps = {
  form: UseFormReturn<ManageMilestonesFormData>;
  escrow: StoredEscrow;
  isMulti: boolean;
  canEditExisting: boolean;
  approversCount: number;
};

export const ManageMilestonesForm = ({
  form,
  escrow,
  isMulti,
  canEditExisting,
  approversCount,
}: ManageMilestonesFormProps) => {
  const existingFields = useFieldArray({
    control: form.control,
    name: "existingMilestones",
  });
  const newFields = useFieldArray({
    control: form.control,
    name: "newMilestones",
  });

  return (
    <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto">
      {canEditExisting ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium">Existing milestones</p>
          {existingFields.fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col gap-2 rounded-lg border border-border p-3"
            >
              <FormField
                control={form.control}
                name={`existingMilestones.${index}.description`}
                render={({ field: descriptionField }) => (
                  <FormItem>
                    <FormLabel>
                      Milestone {field.index + 1} description
                    </FormLabel>
                    <FormControl>
                      <Input {...descriptionField} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isMulti ? (
                <FormField
                  control={form.control}
                  name={`existingMilestones.${index}.amount`}
                  render={({ field: amountField }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          step="any"
                          value={amountField.value ?? ""}
                          onChange={(event) =>
                            amountField.onChange(
                              event.target.value === ""
                                ? ""
                                : Number(event.target.value),
                            )
                          }
                          onBlur={amountField.onBlur}
                          name={amountField.name}
                          ref={amountField.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Existing milestones cannot be edited after funding. You can still add
          new milestones.
        </p>
      )}

      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">New milestones</p>
        {newFields.fields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-col gap-2 rounded-lg border border-border p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium">New milestone {index + 1}</p>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => newFields.remove(index)}
              >
                <Trash2Icon />
              </Button>
            </div>

            <FormField
              control={form.control}
              name={`newMilestones.${index}.description`}
              render={({ field: descriptionField }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      {...descriptionField}
                      placeholder="Milestone description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`newMilestones.${index}.approvalsTarget`}
              render={({ field: approvalsField }) => (
                <FormItem>
                  <FormLabel>Approvals Required</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={Math.max(approversCount, 1)}
                      placeholder={CREATE_ESCROW_PLACEHOLDERS.approvalsTarget}
                      value={approvalsField.value ?? ""}
                      onChange={(event) =>
                        approvalsField.onChange(
                          event.target.value === ""
                            ? ""
                            : Number(event.target.value),
                        )
                      }
                      onBlur={approvalsField.onBlur}
                      name={approvalsField.name}
                      ref={approvalsField.ref}
                    />
                  </FormControl>
                  <FormDescription>
                    {getApprovalsTargetHint(approversCount)}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isMulti ? (
              <>
                <FormField
                  control={form.control}
                  name={`newMilestones.${index}.amount`}
                  render={({ field: amountField }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          step="any"
                          placeholder={
                            CREATE_ESCROW_PLACEHOLDERS.milestoneAmount
                          }
                          value={amountField.value ?? ""}
                          onChange={(event) =>
                            amountField.onChange(
                              event.target.value === ""
                                ? ""
                                : Number(event.target.value),
                            )
                          }
                          onBlur={amountField.onBlur}
                          name={amountField.name}
                          ref={amountField.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`newMilestones.${index}.receiver`}
                  render={({ field: receiverField }) => (
                    <FormItem>
                      <FormLabel>Receiver</FormLabel>
                      <FormControl>
                        <Input
                          {...receiverField}
                          placeholder={
                            CREATE_ESCROW_PLACEHOLDERS.stellarAddress
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : null}
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="self-start"
          onClick={() =>
            newFields.append(createEmptyNewMilestone(escrow, isMulti))
          }
        >
          <PlusIcon />
          Add milestone
        </Button>
      </div>
    </div>
  );
};
