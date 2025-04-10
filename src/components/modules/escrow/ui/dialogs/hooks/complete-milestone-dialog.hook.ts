/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { useEscrowUIBoundedStore } from "../../../store/ui";
import { toast } from "@/hooks/toast.hook";
import { Escrow, Milestone } from "@/@types/escrow.entity";
import { changeMilestoneFlag } from "../../../services/change-mileston-flag.service";
import { formSchema } from "../../../schema/complete-milestone.schema";

interface completeMilestoneDialogHookProps {
  setIsCompleteMilestoneDialogOpen?: (value: boolean) => void;
}

const useCompleteMilestoneDialogHook = ({
  setIsCompleteMilestoneDialogOpen,
}: completeMilestoneDialogHookProps) => {
  const { address } = useGlobalAuthenticationStore();
  const setIsChangingStatus = useEscrowUIBoundedStore(
    (state) => state.setIsChangingStatus,
  );
  const setIsDialogOpen = useEscrowUIBoundedStore(
    (state) => state.setIsDialogOpen,
  );
  const setSelectedEscrow = useGlobalBoundedStore(
    (state) => state.setSelectedEscrow,
  );
  const fetchAllEscrows = useGlobalBoundedStore(
    (state) => state.fetchAllEscrows,
  );
  const activeTab = useEscrowUIBoundedStore((state) => state.activeTab);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      evidence: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (
    selectedEscrow: Escrow,
    milestone: Milestone,
    index: number,
  ) => {
    setIsChangingStatus(true);

    try {
      const response = await changeMilestoneFlag({
        contractId: selectedEscrow?.contractId,
        milestoneIndex: index.toString(),
        newFlag: true,
        approver: address,
      });

      if (response.status === "SUCCESS") {
        setIsChangingStatus(false);
        setIsDialogOpen(false);
        setSelectedEscrow(undefined);
        fetchAllEscrows({ address, type: activeTab || "approver" });

        toast({
          title: "Success",
          description: `The Milestone ${milestone.description} has been approved.`,
        });
      }
    } catch (error: any) {
      setIsChangingStatus(false);

      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setIsCompleteMilestoneDialogOpen?.(false);
  };

  return {
    form,
    onSubmit,
    handleClose,
    setIsDialogOpen,
  };
};

export default useCompleteMilestoneDialogHook;
