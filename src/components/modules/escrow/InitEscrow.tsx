"use client";

import InitializeEscrowForm from "@/components/modules/escrow/InitializeEscrowForm";
import FlipCard from "@/components/utils/Code/FlipCard";
import Loader from "@/components/utils/Loader";
import WithAuthProtect from "@/helpers/WithAuth";
import { useLoaderStore } from "@/store/utilsStore/store";
import { initializeEscrowCode } from "./code/initialize.code";

const InitializeEscrow = () => {
  const isLoading = useLoaderStore((state) => state.isLoading);

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

export default WithAuthProtect(InitializeEscrow);
