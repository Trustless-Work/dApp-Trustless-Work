"use client";

import { Bounded } from "@/components/Bounded";
import { InitializeEscrowForm } from "@/components/modules/escrow/InitializeEscrowForm";
import Loader from "@/components/utils/Loader";
import { WrapperForm } from "@/components/Wrappers";
import WithAuthProtect from "@/helpers/WithAuth";
import { useLoaderStore } from "@/store/utilsStore/store";

const CreateEscrow = () => {
  const isLoading = useLoaderStore((state) => state.isLoading);

  return (
    <Bounded center={true}>
      {isLoading ? (
        <Loader isLoading={isLoading} />
      ) : (
        <WrapperForm>
          <h1 className="text-4xl font-bold">
            Fill in the details of the Escrow
          </h1>
          <h2>
            Fill in the details below to set up a secure and reliable escrow
            agreement.
          </h2>
          <InitializeEscrowForm />
        </WrapperForm>
      )}
    </Bounded>
  );
};

export default WithAuthProtect(CreateEscrow);
