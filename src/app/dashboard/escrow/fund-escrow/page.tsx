"use client";

import { Bounded } from "@/components/Bounded";
import { FundEscrowForm } from "@/components/modules/escrow/FundEscrowForm";
import Loader from "@/components/utils/Loader";
import { WrapperForm } from "@/components/Wrappers";
import WithAuthProtect from "@/helpers/WithAuth";
import { useLoaderStore } from "@/store/utilsStore";

const FundEscrow = () => {
  const isLoading = useLoaderStore((state) => state.isLoading);

  return (
    <Bounded center={false}>
      {isLoading ? (
        <Loader isLoading={isLoading} />
      ) : (
        <WrapperForm>
          <h1 className="text-4xl font-bold">Fund an Escrow</h1>
          <h2>Fill in the details below to fund an escrow.</h2>
          <FundEscrowForm />
        </WrapperForm>
      )}
    </Bounded>
  );
};

export default WithAuthProtect(FundEscrow);
