"use client";

import { Bounded } from "@/components/Bounded";
import { RefundRemainingFundsForm } from "@/components/modules/escrow/RefundRemainingFundsForm";
import { WrapperForm } from "@/components/Wrappers";
import WithAuthProtect from "@/helpers/WithAuth";

const RefundRemainingFuns = () => {
  return (
    <Bounded center={true}>
      <WrapperForm>
        <h1 className="text-4xl font-bold">Refund remaining funds</h1>
        <h2>Fill in the details below to fund an escrow.</h2>
        <RefundRemainingFundsForm />
      </WrapperForm>
    </Bounded>
  );
};

export default WithAuthProtect(RefundRemainingFuns);
