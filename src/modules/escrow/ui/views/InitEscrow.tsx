"use client";

import Loader from "@/shared/utils/Loader";
import { InitializeSingleEscrowForm } from "../forms/InitializeSingleEscrowForm";
import { useEscrowUIBoundedStore } from "../../store/ui";
import { InitializeMultiEscrowForm } from "../forms/InitializeMultiEscrowForm";
import { useGlobalAuthenticationStore } from "@/store/data";
import { useEscrowsBySignerQuery } from "../../hooks/tanstack/useEscrowsBySignerQuery";
import { FileWarning } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/ui/alert";

const MAX_ESCROWS = 20;

export const InitializeEscrow = () => {
  const isInitializingEscrow = useEscrowUIBoundedStore(
    (state) => state.isInitializingEscrow,
  );
  const escrowType = useEscrowUIBoundedStore((state) => state.escrowType);

  const address = useGlobalAuthenticationStore((state) => state.address);

  const { data: escrows = [] } = useEscrowsBySignerQuery({
    signer: address,
    isActive: true,
  });

  if (isInitializingEscrow) {
    return <Loader isLoading={isInitializingEscrow} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl font-bold">Fill in the details of the Escrow</h1>
      <h2>
        Fill in the details below to set up a secure and reliable escrow
        agreement.
      </h2>

      {escrows.length >= MAX_ESCROWS && (
        <Alert variant="destructive" className="mt-5">
          <FileWarning />
          <div className="flex flex-col ml-4">
            <AlertTitle className="font-bold">Attention!</AlertTitle>
            <AlertDescription>
              You cannot create up to 20 escrows. If you want to create a new
              escrow, you'll need to contact us by Telegram or Discord.
            </AlertDescription>
          </div>
        </Alert>
      )}

      {escrowType === "single-release" ? (
        <InitializeSingleEscrowForm disabled={escrows.length >= MAX_ESCROWS} />
      ) : (
        <InitializeMultiEscrowForm disabled={escrows.length >= MAX_ESCROWS} />
      )}
    </div>
  );
};
