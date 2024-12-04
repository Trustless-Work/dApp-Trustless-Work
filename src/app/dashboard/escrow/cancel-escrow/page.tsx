"use client";

import { Bounded } from "@/components/Bounded";
import { CancelEscrowForm } from "@/components/modules/escrow/CancelEscrowForm";
import { WrapperForm } from "@/components/Wrappers";
import WithAuthProtect from "@/helpers/WithAuth";

const CancelEscrow = () => {
  return (
    <Bounded center={true}>
      <WrapperForm>
        <h1 className="text-4xl font-bold">Cancel escrow</h1>
        <h2>Fill in the details below to fund an escrow.</h2>
        <CancelEscrowForm />
      </WrapperForm>
    </Bounded>
  );
};

export default WithAuthProtect(CancelEscrow);
