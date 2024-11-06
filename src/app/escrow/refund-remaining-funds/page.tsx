"use client";

import Bounded from "@/components/Bounded";
import { RefundRemainingFundsForm } from "@/components/modules/escrow/RefundRemainingFundsForm";
import WithAuthProtect from "@/constants/helpers/WithAuth";

const RefundRemainingFuns = () => {
  return (
    <Bounded center={true}>
      <div className="flex flex-col gap-3 w-full md:w-1/3">
        <h1 className="text-4xl font-bold">Refund remaining funds</h1>
        <h2>Fill in the details below to fund an escrow.</h2>
        <RefundRemainingFundsForm />
      </div>
    </Bounded>
  );
};

export default WithAuthProtect(RefundRemainingFuns);
