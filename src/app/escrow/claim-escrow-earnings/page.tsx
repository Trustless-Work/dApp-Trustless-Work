"use client";

import Bounded from "@/components/Bounded";
import { ClaimEscrowEarningsForm } from "@/components/modules/escrow/ClaimEscrowEarningsForm";
import WithAuthProtect from "@/constants/helpers/WithAuth";

const ClaimEscrowEarnings = () => {
  return (
    <Bounded center={true}>
      <div className="flex flex-col gap-3 w-full md:w-1/3">
        <h1 className="text-4xl font-bold">Claim escrow earnings</h1>
        <h2>Fill in the details below to claim escrow earnings.</h2>
        <ClaimEscrowEarningsForm />
      </div>
    </Bounded>
  );
};

export default WithAuthProtect(ClaimEscrowEarnings);
