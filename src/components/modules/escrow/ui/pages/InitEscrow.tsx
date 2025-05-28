"use client";

import Loader from "@/components/utils/ui/Loader";
import { useGlobalUIBoundedStore } from "@/core/store/ui";
import InitializeEscrowForm from "../forms/InitializeEscrowForm";
import { Button } from "@/components/ui/button";
import { useInitializeEscrow } from "../../hooks/initialize-escrow.hook";

const InitializeEscrow = () => {
  const isLoading = useGlobalUIBoundedStore((state) => state.isLoading);
  const { fillTemplateForm } = useInitializeEscrow();

  return (
    <>
      {isLoading ? (
        <Loader isLoading={isLoading} />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <h1 className="text-4xl font-bold">
                Fill in the details of the Escrow
              </h1>

              {process.env.NEXT_PUBLIC_ENV == "DEV" ||
              process.env.NEXT_PUBLIC_ENV == "LOCAL" ? (
                <Button variant="outline" onClick={fillTemplateForm}>
                  Use Template
                </Button>
              ) : null}
            </div>
            <h2>
              Fill in the details below to set up a secure and reliable escrow
              agreement.
            </h2>
          </div>

          <InitializeEscrowForm />
        </div>
      )}
    </>
  );
};

export default InitializeEscrow;
