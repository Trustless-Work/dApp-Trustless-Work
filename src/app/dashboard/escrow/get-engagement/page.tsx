"use client";

import { Bounded } from "@/components/layout/Bounded";
import GetEngagementForm from "@/components/modules/escrow/GetEngagementForm";
import { WrapperForm } from "@/components/layout/Wrappers";
import WithAuthProtect from "@/helpers/WithAuth";

const GetEngagementPage = () => {
  return (
    <Bounded center={true}>
      <WrapperForm>
        <h1 className="text-4xl font-bold">Get Engagement</h1>
        <h2>Fill in the details below to fund an escrow.</h2>
        <GetEngagementForm />
      </WrapperForm>
    </Bounded>
  );
};

export default WithAuthProtect(GetEngagementPage);
