import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateEscrowSchema } from "./schema";
import { z } from "zod";
import {
  UpdateSingleReleaseEscrowPayload,
  UpdateSingleReleaseEscrowResponse,
  SingleReleaseMilestone,
  Roles,
  GetEscrowsFromIndexerResponse,
  MultiReleaseMilestone,
} from "@trustless-work/escrow/types";
import { toast } from "sonner";
import { useEscrowContext } from "@/components/tw-blocks/providers/EscrowProvider";
import { useWalletContext } from "@/components/tw-blocks/wallet-kit/WalletProvider";
import { useEscrowsMutations } from "@/components/tw-blocks/tanstack/useEscrowsMutations";
import {
  ErrorResponse,
  handleError,
} from "@/components/tw-blocks/handle-errors/handle";

export function useUpdateEscrow() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { getSingleReleaseFormSchema } = useUpdateEscrowSchema();
  const formSchema = getSingleReleaseFormSchema();

  const { walletAddress } = useWalletContext();
  const { selectedEscrow, setSelectedEscrow } = useEscrowContext();
  const { updateEscrow } = useEscrowsMutations();

  const isEscrowLocked = Number(selectedEscrow?.balance || 0) > 0;
  const initialMilestonesCountRef = React.useRef<number>(
    ((selectedEscrow?.milestones as MultiReleaseMilestone[]) || []).length
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      engagementId: selectedEscrow?.engagementId || "",
      title: selectedEscrow?.title || "",
      description: selectedEscrow?.description || "",
      platformFee: selectedEscrow?.platformFee as unknown as
        | number
        | string
        | undefined,
      amount: selectedEscrow?.amount as unknown as number | string | undefined,
      trustline: {
        address: selectedEscrow?.trustline?.address || "",
      },
      roles: {
        approver: selectedEscrow?.roles?.approver || "",
        serviceProvider: selectedEscrow?.roles?.serviceProvider || "",
        platformAddress: selectedEscrow?.roles?.platformAddress || "",
        receiver:
          (selectedEscrow?.roles as Roles & { receiver?: string })?.receiver ||
          "",
        releaseSigner: selectedEscrow?.roles?.releaseSigner || "",
        disputeResolver: selectedEscrow?.roles?.disputeResolver || "",
      },
      milestones: (selectedEscrow?.milestones || []).map(
        (m: SingleReleaseMilestone) => ({
          description: m?.description || "",
        })
      ),
    },
    mode: "onChange",
  });

  React.useEffect(() => {
    if (!selectedEscrow) return;
    form.reset({
      engagementId: selectedEscrow?.engagementId || "",
      title: selectedEscrow?.title || "",
      description: selectedEscrow?.description || "",
      platformFee:
        (selectedEscrow?.platformFee as unknown as
          | number
          | string
          | undefined) || "",
      amount:
        (selectedEscrow?.amount as unknown as number | string | undefined) ||
        "",
      trustline: {
        address: selectedEscrow?.trustline?.address || "",
      },
      roles: {
        approver: selectedEscrow?.roles?.approver || "",
        serviceProvider: selectedEscrow?.roles?.serviceProvider || "",
        platformAddress: selectedEscrow?.roles?.platformAddress || "",
        receiver:
          (selectedEscrow?.roles as Roles & { receiver?: string })?.receiver ||
          "",
        releaseSigner: selectedEscrow?.roles?.releaseSigner || "",
        disputeResolver: selectedEscrow?.roles?.disputeResolver || "",
      },
      milestones: (selectedEscrow?.milestones || []).map(
        (m: SingleReleaseMilestone) => ({
          description: m?.description || "",
        })
      ),
    });
  }, [selectedEscrow, form]);

  const milestones = form.watch("milestones");
  const isAnyMilestoneEmpty = milestones.some((m, index) => {
    const shouldValidate =
      !isEscrowLocked || index >= initialMilestonesCountRef.current;
    if (!shouldValidate) return false;

    return m.description === "";
  });

  const handleAddMilestone = () => {
    const current = form.getValues("milestones");
    const updated = [...current, { description: "" }];
    form.setValue("milestones", updated);
  };

  const handleRemoveMilestone = (index: number) => {
    const current = form.getValues("milestones");
    const updated = current.filter((_, i) => i !== index);
    form.setValue("milestones", updated);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value;
    rawValue = rawValue.replace(/[^0-9.]/g, "");
    if (rawValue.split(".").length > 2) rawValue = rawValue.slice(0, -1);
    if (rawValue.includes(".")) {
      const parts = rawValue.split(".");
      if (parts[1] && parts[1].length > 2) {
        rawValue = parts[0] + "." + parts[1].slice(0, 2);
      }
    }
    form.setValue("amount", rawValue);
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

  const handleSubmit = form.handleSubmit(async (payload) => {
    try {
      setIsSubmitting(true);

      /**
       * Create the final payload for the update escrow mutation
       *
       * @param payload - The payload from the form
       * @returns The final payload for the update escrow mutation
       */
      const finalPayload: UpdateSingleReleaseEscrowPayload = {
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
          amount:
            typeof payload.amount === "string"
              ? Number(payload.amount)
              : payload.amount,
          trustline: {
            address: payload.trustline.address,
          },
          roles: payload.roles,
          milestones: payload.milestones.map((milestone, index) => ({
            ...milestone,
            evidence: selectedEscrow?.milestones?.[index]?.evidence || "",
            status: selectedEscrow?.milestones?.[index]?.status || "",
          })),
        },
      };

      /**
       * Call the update escrow mutation
       *
       * @param payload - The final payload for the update escrow mutation
       * @param type - The type of the escrow
       * @param address - The address of the escrow
       */
      (await updateEscrow.mutateAsync({
        payload: finalPayload,
        type: "single-release",
        address: walletAddress || "",
      })) as UpdateSingleReleaseEscrowResponse;

      if (!selectedEscrow) return;

      const nextSelectedEscrow: GetEscrowsFromIndexerResponse = {
        ...selectedEscrow,
        ...finalPayload.escrow,
        trustline: {
          name:
            selectedEscrow.trustline?.name ||
            (selectedEscrow.trustline?.address as string) ||
            "",
          address: finalPayload.escrow.trustline.address,
        },
      };

      setSelectedEscrow(nextSelectedEscrow);
      toast.success("Escrow updated successfully");
    } catch (error) {
      toast.error(handleError(error as ErrorResponse).message);
    } finally {
      setIsSubmitting(false);
    }
  });

  return {
    form,
    isSubmitting,
    milestones,
    isAnyMilestoneEmpty,
    handleSubmit,
    handleAddMilestone,
    handleRemoveMilestone,
    handleAmountChange,
    handlePlatformFeeChange,
    isEscrowLocked,
    initialMilestonesCount: initialMilestonesCountRef.current,
  };
}
