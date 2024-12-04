"use client";

import { Bounded } from "@/components/Bounded";
import { ClaimEscrowEarningsForm } from "@/components/modules/escrow/ClaimEscrowEarningsForm";
import { WrapperForm } from "@/components/Wrappers";
import WithAuthProtect from "@/helpers/WithAuth";

const ClaimEscrowEarnings = () => {
  return (
    <Bounded center={true}>
      <WrapperForm>
        <h1 className="text-4xl font-bold">Claim escrow earnings</h1>
        <h2>Fill in the details below to claim escrow earnings.</h2>
        <ClaimEscrowEarningsForm />
      </WrapperForm>
    </Bounded>
  );
};

export default WithAuthProtect(ClaimEscrowEarnings);
