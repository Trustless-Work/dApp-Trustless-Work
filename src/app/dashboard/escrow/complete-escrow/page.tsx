"use client";

import { Bounded } from "@/components/Bounded";
import { CompleteEscrowForm } from "@/components/modules/escrow/CompleEscrowForm";
import { WrapperForm } from "@/components/Wrappers";
import WithAuthProtect from "@/helpers/WithAuth";

const CompleteEscrow = () => {
  return (
    <Bounded center={true}>
      <WrapperForm>
        <h1 className="text-4xl font-bold">Complete escrow</h1>
        <h2>Fill in the details below to fund an escrow.</h2>
        <CompleteEscrowForm />
      </WrapperForm>
    </Bounded>
  );
};

export default WithAuthProtect(CompleteEscrow);
