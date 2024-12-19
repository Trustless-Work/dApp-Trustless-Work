"use client";

import { Bounded } from "@/components/layout/Bounded";
import ClaimEscrowEarningsForm from "@/components/modules/escrow/ClaimEscrowEarningsForm";
import { WrapperForm } from "@/components/layout/Wrappers";
import WithAuthProtect from "@/helpers/WithAuth";

const ClaimEscrowEarningsPage = () => {
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

export default WithAuthProtect(ClaimEscrowEarningsPage);
