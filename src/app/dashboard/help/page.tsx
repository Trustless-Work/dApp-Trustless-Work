"use client";

import { Bounded } from "@/components/layout/Bounded";
import HelpAccordion from "@/components/modules/help/HelpAccordion";
import Loader from "@/components/utils/Loader";
import WithAuthProtect from "@/helpers/WithAuth";
import { useLoaderStore } from "@/store/utilsStore/store";

const HelpPage = () => {
  const isLoading = useLoaderStore((state) => state.isLoading);

  return (
    <Bounded center={true}>
      {isLoading ? (
        <Loader isLoading={isLoading} />
      ) : (
        <div className="flex flex-col gap-3 w-full md:w-1/3">
          <h1 className="text-4xl font-bold">Help Center</h1>
          <h2>Find answers to common questions about our escrow service.</h2>
          <HelpAccordion />
        </div>
      )}
    </Bounded>
  );
};

export default WithAuthProtect(HelpPage);
