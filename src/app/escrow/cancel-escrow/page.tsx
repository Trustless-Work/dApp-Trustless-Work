"use client";

import Bounded from "@/components/Bounded";
import { CancelEscrowForm } from "@/components/modules/escrow/CancelEscrowForm";
import WithAuthProtect from "@/constants/helpers/WithAuth";

const CancelEscrow = () => {
  return (
    <Bounded center={true}>
      <div className="flex flex-col gap-3 w-full md:w-1/3">
        <h1 className="text-4xl font-bold">Cancel escrow</h1>
        <h2>Fill in the details below to fund an escrow.</h2>
        <CancelEscrowForm />
      </div>
    </Bounded>
  );
};

export default WithAuthProtect(CancelEscrow);
