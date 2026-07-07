"use client";

import { useEffect, useRef, useState } from "react";
import { FileStackIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { CREATE_ESCROW_STEPS } from "@/features/escrows/constants/create-escrow.constants";
import { useCreateEscrowForm } from "@/features/escrows/hooks/useCreateEscrowForm";
import { CreateEscrowBasicsStep } from "@/features/escrows/ui/CreateEscrowBasicsStep";
import { CreateEscrowStepIndicator } from "@/features/escrows/ui/CreateEscrowStepIndicator";
import { EscrowRolesFields } from "@/features/escrows/ui/EscrowRolesFields";
import { MilestonesFieldArray } from "@/features/escrows/ui/MilestonesFieldArray";
import type { EscrowType } from "@/features/escrows/types/escrow.types";

type CreateEscrowDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialType?: EscrowType;
};

export const CreateEscrowDialog = ({
  open,
  onOpenChange,
  initialType = "single-release",
}: CreateEscrowDialogProps) => {
  const [step, setStep] = useState(0);
  const wasOpenRef = useRef(false);
  const resetFormRef = useRef<(type?: EscrowType) => void>(() => {});

  const {
    form,
    onSubmit,
    loading,
    walletAddress,
    escrowType,
    setEscrowType,
    applyTemplate,
    validateStep,
    resetForm,
  } = useCreateEscrowForm({
    initialType,
    onSuccess: () => onOpenChange(false),
  });

  resetFormRef.current = resetForm;

  const isLastStep = step === CREATE_ESCROW_STEPS.length - 1;

  useEffect(() => {
    if (!open) {
      wasOpenRef.current = false;
      setStep(0);
      return;
    }

    if (!wasOpenRef.current) {
      resetFormRef.current(initialType);
      setStep(0);
      wasOpenRef.current = true;
    }
  }, [open, initialType]);

  const handleNext = async () => {
    const isValid = await validateStep(step);
    if (!isValid) {
      return;
    }

    setStep((current) => Math.min(current + 1, CREATE_ESCROW_STEPS.length - 1));
  };

  const handleBack = () => {
    setStep((current) => Math.max(current - 1, 0));
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleCreateEscrow = async () => {
    const isValid = await validateStep(step);
    if (!isValid) {
      if (form.getFieldState("roles").invalid) {
        setStep(1);
      }
      return;
    }

    await form.handleSubmit(onSubmit)();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92vh] flex-col gap-0 overflow-hidden sm:max-w-4xl lg:max-w-5xl">
        <DialogHeader className="gap-4 border-b border-border pb-4">
          <div className="space-y-1">
            <DialogTitle>Create escrow</DialogTitle>
            <DialogDescription>
              Configure your escrow in three steps, then sign the deploy
              transaction with your wallet.
            </DialogDescription>
          </div>
          <CreateEscrowStepIndicator currentStep={step} />
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={handleFormSubmit}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-1 py-5">
              {step === 0 ? (
                <CreateEscrowBasicsStep
                  form={form}
                  escrowType={escrowType}
                  onTypeChange={setEscrowType}
                  disabled={loading}
                  walletConnected={Boolean(walletAddress)}
                />
              ) : null}

              {step === 1 ? (
                <EscrowRolesFields
                  form={form}
                  escrowType={escrowType}
                  disabled={loading}
                />
              ) : null}

              {step === 2 ? (
                <MilestonesFieldArray
                  form={form}
                  escrowType={escrowType}
                  disabled={loading}
                />
              ) : null}
            </div>

            <DialogFooter className="flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="secondary"
                disabled={loading}
                onClick={applyTemplate}
                className="w-full sm:w-auto"
              >
                <FileStackIcon />
                Use template
              </Button>

              <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row">
                <Button
                  type="button"
                  variant="destructive"
                  disabled={loading}
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>

                {step > 0 ? (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={loading}
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                ) : null}

                {isLastStep ? (
                  <Button
                    type="button"
                    disabled={loading || !walletAddress}
                    onClick={handleCreateEscrow}
                  >
                    {loading ? <Loader2Icon className="animate-spin" /> : null}
                    Create escrow
                  </Button>
                ) : (
                  <Button type="button" disabled={loading} onClick={handleNext}>
                    Next
                  </Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
