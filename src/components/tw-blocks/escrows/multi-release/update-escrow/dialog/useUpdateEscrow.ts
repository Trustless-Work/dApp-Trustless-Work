import * as React from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateEscrowSchema } from "./schema";
import { z } from "zod";
import {
  UpdateMultiReleaseEscrowPayload,
  UpdateMultiReleaseEscrowResponse,
  MultiReleaseMilestone,
} from "@trustless-work/escrow/types";
import { toast } from "sonner";
import { useEscrowsMutations } from "@/components/tw-blocks/tanstack/useEscrowsMutations";
import {
  ErrorResponse,
  handleError,
} from "@/components/tw-blocks/handle-errors/handle";
import { GetEscrowsFromIndexerResponse } from "@trustless-work/escrow/types";
import { useGlobalAuthenticationStore } from "@/store/data";
import { useEscrowContext } from "@/providers/EscrowProvider";
import { trustlines } from "@/constants/trustlines.constant";

const isEmptyAmount = (amount: string | number | undefined) => {
  if (amount === "" || amount === undefined || amount === null) return true;
  if (amount === 0 || amount === "0") return true;
  return false;
};

function getFirstErrorMessage(errors: FieldErrors): string | undefined {
  for (const value of Object.values(errors)) {
    if (!value) continue;
    if (typeof value === "object" && "message" in value && value.message) {
      return String(value.message);
    }
    if (typeof value === "object") {
      const nested = getFirstErrorMessage(value as FieldErrors);
      if (nested) return nested;
    }
  }
  return undefined;
}

export function useUpdateEscrow({
  onSuccess,
}: { onSuccess?: () => void } = {}) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [initialMilestonesCount, setInitialMilestonesCount] = React.useState(0);

  const { getMultiReleaseFormSchema } = useUpdateEscrowSchema();

  const walletAddress = useGlobalAuthenticationStore((state) => state.address);
  const { selectedEscrow, setSelectedEscrow } = useEscrowContext();
  const { updateEscrow } = useEscrowsMutations();

  const isEscrowLocked = Number(selectedEscrow?.balance || 0) > 0;

  const formSchema = React.useMemo(
    () =>
      getMultiReleaseFormSchema({
        isLocked: isEscrowLocked,
        existingMilestoneCount: initialMilestonesCount,
      }),
    [getMultiReleaseFormSchema, isEscrowLocked, initialMilestonesCount],
  );

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      engagementId: selectedEscrow?.engagementId || "",
      title: selectedEscrow?.title || "",
      description: selectedEscrow?.description || "",
      platformFee: selectedEscrow?.platformFee as unknown as
        | number
        | string
        | undefined,
      trustline: {
        address: selectedEscrow?.trustline?.address || "",
        symbol: selectedEscrow?.trustline?.symbol || "",
      },
      roles: {
        approver: selectedEscrow?.roles?.approver || "",
        serviceProvider: selectedEscrow?.roles?.serviceProvider || "",
        platformAddress: selectedEscrow?.roles?.platformAddress || "",
        releaseSigner: selectedEscrow?.roles?.releaseSigner || "",
        disputeResolver: selectedEscrow?.roles?.disputeResolver || "",
      },
      milestones: (
        (selectedEscrow?.milestones as MultiReleaseMilestone[]) ?? []
      ).map((m) => ({
        receiver:
          (m as MultiReleaseMilestone & { receiver?: string })?.receiver || "",
        description: m?.description || "",
        amount: m?.amount ?? 0,
      })) || [
        {
          receiver: "",
          description: "",
          amount: 0,
        },
      ],
    },
    mode: "onChange",
  });

  React.useEffect(() => {
    if (!selectedEscrow) return;
    const milestones = (selectedEscrow.milestones as MultiReleaseMilestone[]) ?? [];
    setInitialMilestonesCount(milestones.length);

    form.reset({
      engagementId: selectedEscrow?.engagementId || "",
      title: selectedEscrow?.title || "",
      description: selectedEscrow?.description || "",
      platformFee:
        (selectedEscrow?.platformFee as unknown as
          | number
          | string
          | undefined) || "",
      trustline: {
        address: selectedEscrow?.trustline?.address || "",
        symbol: selectedEscrow?.trustline?.symbol || "",
      },
      roles: {
        approver: selectedEscrow?.roles?.approver || "",
        serviceProvider: selectedEscrow?.roles?.serviceProvider || "",
        platformAddress: selectedEscrow?.roles?.platformAddress || "",
        releaseSigner: selectedEscrow?.roles?.releaseSigner || "",
        disputeResolver: selectedEscrow?.roles?.disputeResolver || "",
      },
      milestones: milestones.map((m) => ({
        receiver:
          (m as MultiReleaseMilestone & { receiver?: string })?.receiver || "",
        description: m?.description || "",
        amount: m?.amount ?? "",
      })) || [
        {
          receiver: "",
          description: "",
          amount: "",
        },
      ],
    });
  }, [selectedEscrow, form]);

  const milestones = form.watch("milestones");
  const isAnyMilestoneEmpty = milestones.some((m, index) => {
    const shouldValidate =
      !isEscrowLocked || index >= initialMilestonesCount;
    if (!shouldValidate) return false;
    return (
      m.description === "" ||
      (m as { receiver?: string }).receiver === "" ||
      isEmptyAmount(m.amount)
    );
  });

  const handleTrustlineAddressChange = (address: string) => {
    const match = trustlines.find((tl) => tl.address === address);
    form.setValue("trustline.address", address, { shouldValidate: true });
    form.setValue(
      "trustline.symbol",
      match?.symbol ?? selectedEscrow?.trustline?.symbol ?? "",
      { shouldValidate: true },
    );
  };

  const handleAddMilestone = () => {
    const current = form.getValues("milestones");
    const updated = [...current, { receiver: "", description: "", amount: "" }];
    form.setValue("milestones", updated);
  };

  const handleRemoveMilestone = (index: number) => {
    if (isEscrowLocked && index < initialMilestonesCount) {
      return;
    }
    const current = form.getValues("milestones");
    const updated = current.filter((_, i) => i !== index);
    form.setValue("milestones", updated);
  };

  const handleMilestoneAmountChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    let rawValue = e.target.value;
    rawValue = rawValue.replace(/[^0-9.]/g, "");

    if (rawValue.split(".").length > 2) {
      rawValue = rawValue.slice(0, -1);
    }

    if (rawValue.includes(".")) {
      const parts = rawValue.split(".");
      if (parts[1] && parts[1].length > 2) {
        rawValue = parts[0] + "." + parts[1].slice(0, 2);
      }
    }

    const updatedMilestones = [...milestones];
    updatedMilestones[index] = {
      ...updatedMilestones[index],
      amount: rawValue,
    };
    form.setValue("milestones", updatedMilestones, { shouldValidate: true });
  };

  const handlePlatformFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value;
    rawValue = rawValue.replace(/[^0-9.]/g, "");
    if (rawValue.split(".").length > 2) rawValue = rawValue.slice(0, -1);
    if (rawValue.includes(".")) {
      const parts = rawValue.split(".");
      if (parts[1] && parts[1].length > 2) {
        rawValue = parts[0] + "." + parts[1].slice(0, 2);
      }
    }
    form.setValue("platformFee", rawValue);
  };

  const getMilestoneError = (
    index: number,
    field: "receiver" | "description" | "amount",
  ) => {
    const milestoneErrors = form.formState.errors.milestones;
    if (!milestoneErrors || !Array.isArray(milestoneErrors)) return undefined;
    const fieldError = milestoneErrors[index]?.[field];
    return fieldError?.message as string | undefined;
  };

  const handleSubmit = form.handleSubmit(
    async (payload) => {
      try {
        setIsSubmitting(true);

        const finalPayload: UpdateMultiReleaseEscrowPayload = {
          contractId: selectedEscrow?.contractId || "",
          signer: walletAddress || "",
          escrow: {
            engagementId: payload.engagementId,
            title: payload.title,
            description: payload.description,
            platformFee:
              typeof payload.platformFee === "string"
                ? Number(payload.platformFee)
                : payload.platformFee,
            trustline: {
              address: payload.trustline.address,
              symbol:
                payload.trustline.symbol ||
                selectedEscrow?.trustline?.symbol ||
                "",
            },
            roles: payload.roles,
            milestones: payload.milestones.map((milestone, index: number) => ({
              ...milestone,
              amount:
                typeof milestone.amount === "string"
                  ? Number(milestone.amount)
                  : milestone.amount,
              evidence: selectedEscrow?.milestones?.[index]?.evidence || "",
              status: selectedEscrow?.milestones?.[index]?.status || "",
            })),
          },
        };

        (await updateEscrow.mutateAsync({
          payload: finalPayload,
          type: "multi-release",
          address: walletAddress || "",
        })) as UpdateMultiReleaseEscrowResponse;

        if (!selectedEscrow) return;

        const nextSelectedEscrow: GetEscrowsFromIndexerResponse = {
          ...selectedEscrow,
          ...finalPayload.escrow,
          trustline: {
            symbol: finalPayload.escrow.trustline.symbol,
            address: finalPayload.escrow.trustline.address,
          },
        };

        setSelectedEscrow(nextSelectedEscrow);
        toast.success("Escrow updated successfully");
        onSuccess?.();
      } catch (error) {
        toast.error(handleError(error as ErrorResponse).message);
      } finally {
        setIsSubmitting(false);
      }
    },
    (errors) => {
      const message = getFirstErrorMessage(errors);
      toast.error(
        message || "Please complete all required milestone fields.",
      );
    },
  );

  return {
    form,
    isSubmitting,
    milestones,
    isAnyMilestoneEmpty,
    handleSubmit,
    handleAddMilestone,
    handleRemoveMilestone,
    handleMilestoneAmountChange,
    handlePlatformFeeChange,
    handleTrustlineAddressChange,
    getMilestoneError,
    isEscrowLocked,
    initialMilestonesCount,
  };
};
