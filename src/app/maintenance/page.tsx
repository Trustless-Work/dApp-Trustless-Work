"use client";

import { Bounded } from "@/shared/Bounded";
import { CountdownTimer } from "@/modules/maintenance/ui/CountdownTimer";

const Maintenance: React.FC = () => {
  return (
    <Bounded center={true} className="mt-20">
      <div className="flex flex-col justify-center items-center w-full mt-10 md:mt-16 gap-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold">
          Site Under Maintenance
        </h1>
        <p className="text-xl text-muted-foreground">
          We are making improvements to our platform to provide you with better
          service.
        </p>
        <CountdownTimer />
      </div>
    </Bounded>
  );
};

export default Maintenance;
