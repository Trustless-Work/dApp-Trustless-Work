"use client";

import { PlusIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  ExistingMilestoneRow,
  NewMilestoneRow,
} from "@/features/escrows/utils/manage-milestones.helper";

type ManageMilestonesFormProps = {
  isMulti: boolean;
  canEditExisting: boolean;
  existingRows: ExistingMilestoneRow[];
  newRows: NewMilestoneRow[];
  onExistingRowsChange: (rows: ExistingMilestoneRow[]) => void;
  onNewRowsChange: (rows: NewMilestoneRow[]) => void;
};

export const ManageMilestonesForm = ({
  isMulti,
  canEditExisting,
  existingRows,
  newRows,
  onExistingRowsChange,
  onNewRowsChange,
}: ManageMilestonesFormProps) => {
  return (
    <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto">
      {canEditExisting ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium">Existing milestones</p>
          {existingRows.map((row, index) => (
            <div
              key={row.index}
              className="flex flex-col gap-2 rounded-lg border p-3"
            >
              <Label htmlFor={`manage-milestone-desc-${row.index}`}>
                Milestone {row.index + 1} description
              </Label>
              <Input
                id={`manage-milestone-desc-${row.index}`}
                value={row.description}
                onChange={(event) => {
                  const next = [...existingRows];
                  next[index] = {
                    ...row,
                    description: event.target.value,
                  };
                  onExistingRowsChange(next);
                }}
              />
              {isMulti ? (
                <>
                  <Label htmlFor={`manage-milestone-amount-${row.index}`}>
                    Amount
                  </Label>
                  <Input
                    id={`manage-milestone-amount-${row.index}`}
                    type="number"
                    min={0}
                    step="any"
                    value={row.amount}
                    onChange={(event) => {
                      const next = [...existingRows];
                      next[index] = {
                        ...row,
                        amount: event.target.value,
                      };
                      onExistingRowsChange(next);
                    }}
                  />
                </>
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
        {newRows.map((row, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 rounded-lg border p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor={`new-milestone-desc-${index}`}>Description</Label>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() =>
                  onNewRowsChange(
                    newRows.filter((_, rowIndex) => rowIndex !== index),
                  )
                }
              >
                <Trash2Icon />
              </Button>
            </div>
            <Input
              id={`new-milestone-desc-${index}`}
              value={row.description}
              onChange={(event) => {
                const next = [...newRows];
                next[index] = {
                  ...row,
                  description: event.target.value,
                };
                onNewRowsChange(next);
              }}
              placeholder="Milestone description"
            />
            <Label htmlFor={`new-milestone-target-${index}`}>
              Approvals target
            </Label>
            <Input
              id={`new-milestone-target-${index}`}
              type="number"
              min={1}
              value={row.approvalsTarget}
              onChange={(event) => {
                const next = [...newRows];
                next[index] = {
                  ...row,
                  approvalsTarget: event.target.value,
                };
                onNewRowsChange(next);
              }}
            />
            {isMulti ? (
              <>
                <Label htmlFor={`new-milestone-amount-${index}`}>Amount</Label>
                <Input
                  id={`new-milestone-amount-${index}`}
                  type="number"
                  min={0}
                  step="any"
                  value={row.amount}
                  onChange={(event) => {
                    const next = [...newRows];
                    next[index] = {
                      ...row,
                      amount: event.target.value,
                    };
                    onNewRowsChange(next);
                  }}
                />
                <Label htmlFor={`new-milestone-receiver-${index}`}>
                  Receiver
                </Label>
                <Input
                  id={`new-milestone-receiver-${index}`}
                  value={row.receiver}
                  onChange={(event) => {
                    const next = [...newRows];
                    next[index] = {
                      ...row,
                      receiver: event.target.value,
                    };
                    onNewRowsChange(next);
                  }}
                  placeholder="G…"
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
            onNewRowsChange([
              ...newRows,
              {
                description: "",
                approvalsTarget: "1",
                amount: "",
                receiver: "",
              },
            ])
          }
        >
          <PlusIcon />
          Add milestone
        </Button>
      </div>
    </div>
  );
};
