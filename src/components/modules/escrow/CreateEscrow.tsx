"use client";

import { Bounded } from "@/components/layout/Bounded";
import { Button } from "@/components/ui/button";
import WithAuthProtect from "@/helpers/WithAuth";
import { useEscrowStepsStore } from "@/store/EscrowStepStore/store";

const CreateEscrowPage = () => {
  const { toggleStep } = useEscrowStepsStore();

  const handleStart = async () => {
    toggleStep(2);
  };

  return (
    <Bounded center={true}>
      <div className="flex flex-col justify-center items-center w-full h-full gap-10 px-5">
        <div className="flex flex-col justify-center gap-6 text-center md:text-left">
          <h1 className="text-center text-3xl md:text-4xl font-semibold">
            Create an Escrow
          </h1>
          <hr className="hidden md:block bg-gray-200 w-full h-0.5" />
          <p className="text-xl text-center md:text-left">
            <span className="text-primary font-bold">
              The escrow that holds funds
            </span>{" "}
            and enforces the conditions <br /> of the agreement
            <strong>between the Service Provider and the Signer.</strong>
          </p>
        </div>
        <Button
          type="submit"
          onClick={handleStart}
          className="w-2/5 mx-auto bg-primary text-white bg-gradient-to-br 0 text-lg font-semibold rounded-lg px-2 py-1 text-center"
        >
          Start
        </Button>
      </div>
    </Bounded>
  );
};

export default WithAuthProtect(CreateEscrowPage);
