/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../../../schema/fund-escrow.schema";
import {
  useGlobalAuthenticationStore,
  useGlobalBoundedStore,
} from "@/core/store/data";

interface useEditMilestonesDialogProps {
  setIsEditMilestoneDialogOpen: (value: boolean) => void;
}

const useEditMilestonesDialog = ({
  setIsEditMilestoneDialogOpen,
}: useEditMilestonesDialogProps) => {
  const { address } = useGlobalAuthenticationStore();
  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
    },
  });

  const onSubmit = async (payload: z.infer<typeof formSchema>) => {
    // setIsFundingEscrow(true);

    try {
    } catch (error) {}
  };

  const handleClose = () => {
    setIsEditMilestoneDialogOpen(false);
  };

  return { onSubmit, form, handleClose };
};

export default useEditMilestonesDialog;
