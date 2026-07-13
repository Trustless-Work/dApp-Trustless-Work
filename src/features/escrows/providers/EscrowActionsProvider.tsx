"use client";

import type { EscrowType } from "@trustless-work/escrow";
import { createContext, useContext, type ReactNode } from "react";
import { useEscrowActions } from "@/features/escrows/hooks/useEscrowActions";

type EscrowActionsContextValue = ReturnType<typeof useEscrowActions>;

const EscrowActionsContext = createContext<EscrowActionsContextValue | null>(
  null,
);

type EscrowActionsProviderProps = {
  contractId: string;
  escrowType: EscrowType;
  children: ReactNode;
};

export const EscrowActionsProvider = ({
  contractId,
  escrowType,
  children,
}: EscrowActionsProviderProps) => {
  const actions = useEscrowActions(contractId, escrowType);

  return (
    <EscrowActionsContext.Provider value={actions}>
      {children}
    </EscrowActionsContext.Provider>
  );
};

export function useEscrowActionsContext(): EscrowActionsContextValue {
  const context = useContext(EscrowActionsContext);

  if (!context) {
    throw new Error(
      "useEscrowActionsContext must be used within EscrowActionsProvider",
    );
  }

  return context;
}
