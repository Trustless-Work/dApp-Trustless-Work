"use client";

import Bounded from "@/components/Bounded";
import { InitializeEscrowForm } from "@/components/modules/escrow/InitializeEscrowForm";
import Loader from "@/components/utils/Loader";
import WithAuthProtect from "@/constants/helpers/WithAuth";
import { useLoaderStore } from "@/store/utilsStore/store";

const CreateEscrow = () => {
  const isLoading = useLoaderStore((state) => state.isLoading);

  return (
    <Bounded center={true}>
      {isLoading ? (
        <Loader isLoading={isLoading} />
      ) : (
        <div className="flex flex-col gap-3 w-full md:w-1/3">
          <h1 className="text-4xl font-bold">Initialize an Escrow</h1>
          <h2>
            Fill in the details below to set up a secure and reliable escrow
            agreement.
          </h2>
          <InitializeEscrowForm />
        </div>
      )}
    </Bounded>
  );
};

export default WithAuthProtect(CreateEscrow);
