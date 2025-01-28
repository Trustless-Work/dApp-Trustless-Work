"use client";

import Loader from "@/components/utils/ui/Loader";
import { initializeEscrowCode } from "../../code/initialize.code";
import InitializeEscrowForm from "../forms/InitializeEscrowForm";
import FlipCard from "@/components/utils/code/FlipCard";
import { useGlobalUIBoundedStore } from "@/core/store/ui";

const InitializeEscrow = () => {
  const isLoading = useGlobalUIBoundedStore((state) => state.isLoading);

  return (
    <>
      {isLoading ? (
        <Loader isLoading={isLoading} />
      ) : (
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold">
            Fill in the details of the Escrow
          </h1>
          <h2>
            Fill in the details below to set up a secure and reliable escrow
            agreement.
          </h2>
          <FlipCard
            children={<InitializeEscrowForm />}
            codeExample={initializeEscrowCode}
          />
        </div>
      )}
    </>
  );
};

export default InitializeEscrow;
