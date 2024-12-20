"use client";

import { Bounded } from "@/components/layout/Bounded";
import CompleteEscrowForm from "@/components/modules/escrow/CompleEscrowForm";
import { WrapperForm } from "@/components/layout/Wrappers";
import WithAuthProtect from "@/helpers/WithAuth";

const CompleteEscrowPage = () => {
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

export default WithAuthProtect(CompleteEscrowPage);
