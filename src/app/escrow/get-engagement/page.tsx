"use client";

import Bounded from "@/components/Bounded";
import { GetEngagementForm } from "@/components/modules/escrow/GetEngagementForm";
import WithAuthProtect from "@/constants/helpers/WithAuth";

const GetEngagement = () => {
  return (
    <Bounded center={true}>
      <div className="flex flex-col gap-3 w-full md:w-1/3">
        <h1 className="text-4xl font-bold">Get Engagement</h1>
        <h2>Fill in the details below to fund an escrow.</h2>
        <GetEngagementForm />
      </div>
    </Bounded>
  );
};

export default WithAuthProtect(GetEngagement);
