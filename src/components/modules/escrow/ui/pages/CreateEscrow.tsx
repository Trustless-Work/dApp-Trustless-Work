"use client";

import { Bounded } from "@/components/layout/Bounded";
import { Button } from "@/components/ui/button";
import { useEscrowUIBoundedStore } from "../../store/ui";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileWarning } from "lucide-react";
import { useEscrowsBySignerQuery } from "../../hooks/tanstack/useEscrowsBySignerQuery";

const MAX_ESCROWS = 20;

const CreateEscrowPage = () => {
  const toggleStep = useEscrowUIBoundedStore((state) => state.toggleStep);
  const address = useGlobalAuthenticationStore((state) => state.address);

  const { data: escrows = [] } = useEscrowsBySignerQuery({
    signer: address,
    isActive: true,
  });

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
          {escrows.length >= MAX_ESCROWS && (
            <Alert variant="destructive">
              <FileWarning />
              <div className="flex flex-col ml-4">
                <AlertTitle className="font-bold">Attention!</AlertTitle>
                <AlertDescription>
                  You cannot create up to 20 escrows. Please delete some escrows
                  to create a new one.
                </AlertDescription>
              </div>
            </Alert>
          )}

          <hr className="hidden md:block bg-gray-200 w-full h-0.5" />
          <p className="text-xl text-center md:text-left">
            <span className="text-primary font-bold">
              The escrow that holds funds
            </span>{" "}
            and enforces the conditions <br /> of the agreement{" "}
            <strong>between the Service Provider and the Signer.</strong>
          </p>
        </div>
        <Button
          disabled={escrows.length >= MAX_ESCROWS}
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

export default CreateEscrowPage;
