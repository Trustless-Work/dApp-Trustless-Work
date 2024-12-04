"use client";

import { Bounded } from "@/components/Bounded";
import { Button } from "@/components/ui/button";
import { fetchCreateEscrow } from "@/services/deploy/createEscrow";

export default function CreateEscrow() {
  const handleStart = async () => {
    const result = await fetchCreateEscrow();

    if (result.success === false) {
      console.log("Error initializing escrow:", result.message);
    } else {
      console.log("Escrow initialized successfully:", result);
    }
  };

  return (
    <Bounded center={true}>
      <div className="flex flex-col md:flex-row justify-center items-center w-full h-full mt-0 md:mt-20 gap-10 px-5">
        <div className="flex flex-col justify-center gap-6 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-semibold">
            Create an Escrow
          </h1>
          <Button
            type="submit"
            onClick={handleStart}
            className="w-1/2 mx-auto bg-primary text-white bg-gradient-to-br 0 text-lg font-semibold  rounded-lg px-2 py-1 text-center "
          >
            Start
          </Button>
        </div>
        <hr className="hidden md:block bg-gray-200 w-0.5 h-96" />
        <p className="text-xl text-center md:text-left">
          <span className="text-primary font-bold">
            The escrow that holds funds
          </span>{" "}
          and enforces the conditions of the agreement <br />
          <strong>between the Service Provider and the Signer.</strong>
        </p>
      </div>
    </Bounded>
  );
}
