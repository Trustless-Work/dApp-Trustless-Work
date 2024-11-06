"use client";

import Bounded from "@/components/Bounded";
import { CompleteEscrowForm } from "@/components/modules/escrow/CompleEscrowForm";
import WithAuthProtect from "@/constants/helpers/WithAuth";

const CompleteEscrow = () => {
  return (
    <Bounded center={true}>
      <div className="flex flex-col gap-3 w-full md:w-1/3">
        <h1 className="text-4xl font-bold">Complete escrow</h1>
        <h2>Fill in the details below to fund an escrow.</h2>
        <CompleteEscrowForm />
      </div>
    </Bounded>
  );
};

export default WithAuthProtect(CompleteEscrow);
