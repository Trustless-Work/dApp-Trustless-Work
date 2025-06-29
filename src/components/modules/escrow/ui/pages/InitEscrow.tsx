"use client";

import Loader from "@/components/utils/ui/Loader";
import { useGlobalUIBoundedStore } from "@/core/store/ui";
import { InitializeSingleEscrowForm } from "../forms/single-release/InitializeSingleEscrowForm";
import { useEscrowUIBoundedStore } from "../../store/ui";
import { InitializeMultiEscrowForm } from "../forms/multi-release/InitializeMultiEscrowForm";

const InitializeEscrow = () => {
  const isLoading = useGlobalUIBoundedStore((state) => state.isLoading);
  const escrowType = useEscrowUIBoundedStore((state) => state.escrowType);

  if (isLoading) {
    return <Loader isLoading={isLoading} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl font-bold">Fill in the details of the Escrow</h1>
      <h2>
        Fill in the details below to set up a secure and reliable escrow
        agreement.
      </h2>

      {escrowType === "single-release" ? (
        <InitializeSingleEscrowForm />
      ) : (
        <InitializeMultiEscrowForm />
      )}
    </div>
  );
};

export default InitializeEscrow;
