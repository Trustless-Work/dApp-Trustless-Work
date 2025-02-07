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
import { useGlobalUIBoundedStore } from "@/core/store/ui";
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
  const setClientFunds = useGlobalBoundedStore((state) => state.setClientFunds);
  const setServiceProviderFunds = useGlobalBoundedStore(
    (state) => state.setServiceProviderFunds,
  );
  const setIsSuccessResolveDisputeDialogOpen = useEscrowBoundedStore(
    (state) => state.setIsSuccessResolveDisputeDialogOpen,
  );
  const formSchema = getFormSchema(selectedEscrow);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientFunds: "",
      serviceProviderFunds: "",
    },
  });

  const onSubmit = async (payload: ResolveDisputePayload) => {
    setIsResolvingDispute(true);

    try {
      const data = await resolveDispute({
        contractId: selectedEscrow?.contractId,
        disputeResolver: selectedEscrow?.disputeResolver,
        clientFunds: payload.clientFunds,
        serviceProviderFunds: payload.serviceProviderFunds,
      });

      if (data.status === "SUCCESS" || data.status === 201) {
        form.reset();
        setIsResolveDisputeDialogOpen(false);
        setIsResolvingDispute(false);
        setIsDialogOpen(false);
        fetchAllEscrows({ address, type: activeTab || "client" });
        setClientFunds(payload.clientFunds);
        setServiceProviderFunds(payload.serviceProviderFunds);
        setIsSuccessResolveDisputeDialogOpen(true);

        if (selectedEscrow) {
          setRecentEscrow(selectedEscrow);
        }

        toast({
          title: "Success",
          description: data.message,
        });
      } else {
        setIsResolvingDispute(false);
        toast({
          title: "Error",
          description: data.message || "An error occurred",
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
    setIsResolveDisputeDialogOpen(false);
  };

  return { onSubmit, form, handleClose, handleOpen };
};

export default useResolveDisputeEscrowDialog;
