/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";
import { resolveDispute } from "../../../services/resolve-dispute.service";
import { ResolveDisputePayload } from "@/@types/escrow.entity";
import { MouseEvent } from "react";
import { getFormSchema } from "../../../schema/resolve-dispute-escrow.schema";
import { toast } from "@/hooks/toast.hook";
import { useEscrowBoundedStore } from "../../../store/ui";

interface useResolveDisputeEscrowDialogProps {
  setIsResolveDisputeDialogOpen: (value: boolean) => void;
}

const useResolveDisputeEscrowDialog = ({
  setIsResolveDisputeDialogOpen,
}: useResolveDisputeEscrowDialogProps) => {
  const setIsResolvingDispute = useEscrowBoundedStore(
    (state) => state.setIsResolvingDispute,
  );
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const setIsDialogOpen = useEscrowBoundedStore(
    (state) => state.setIsDialogOpen,
  );
  const fetchAllEscrows = useGlobalBoundedStore(
    (state) => state.fetchAllEscrows,
  );
  const activeTab = useEscrowBoundedStore((state) => state.activeTab);
  const address = useGlobalAuthenticationStore((state) => state.address);
  const setRecentEscrow = useGlobalBoundedStore(
    (state) => state.setRecentEscrow,
  );
  const setIsSuccessResolveDisputeDialogOpen = useEscrowBoundedStore(
    (state) => state.setIsSuccessResolveDisputeDialogOpen,
  );
  const formSchema = getFormSchema();
  const setServiceProviderResolve = useEscrowBoundedStore(
    (state) => state.setServiceProviderResolve,
  );
  const setApproverResolve = useEscrowBoundedStore(
    (state) => state.setApproverResolve,
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      approverFunds: "",
      serviceProviderFunds: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (payload: ResolveDisputePayload) => {
    setIsResolvingDispute(true);

    if (!selectedEscrow) return;

    try {
      const response = await resolveDispute({
        contractId: selectedEscrow?.contractId,
        disputeResolver: selectedEscrow?.disputeResolver,
        approverFunds: payload.approverFunds,
        serviceProviderFunds: payload.serviceProviderFunds,
      });

      if (response.status === "SUCCESS") {
        form.reset();
        setServiceProviderResolve(payload.serviceProviderFunds);
        setApproverResolve(payload.approverFunds);
        setIsResolveDisputeDialogOpen(false);
        setIsResolvingDispute(false);
        setIsDialogOpen(false);
        fetchAllEscrows({ address, type: activeTab || "client" });
        setIsSuccessResolveDisputeDialogOpen(true);

        if (selectedEscrow) {
          setRecentEscrow(selectedEscrow);
        }

        toast({
          title: "Success",
          description: response.message,
        });
      } else {
        setIsResolvingDispute(false);
        toast({
          title: "Error",
          description: response.message || "An error occurred",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      setIsResolvingDispute(false);

      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleOpen = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (Number(selectedEscrow?.balance) !== 0) {
      setIsResolveDisputeDialogOpen(true);
    } else {
      toast({
        title: "Error",
        description: "The balance cannot be 0",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setServiceProviderResolve("");
    setApproverResolve("");
    setIsResolveDisputeDialogOpen(false);
  };

  return { onSubmit, form, handleClose, handleOpen };
};

export default useResolveDisputeEscrowDialog;
