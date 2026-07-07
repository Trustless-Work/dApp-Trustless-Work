"use client";

import { RoundedTabs } from "@/components/ui/custom-tab";
import { cn } from "@/lib/utils";
import { ESCROW_TABS } from "@/features/escrows/constants/escrow-tabs";
import {
  isEscrowType,
  type EscrowType,
} from "@/features/escrows/types/escrow.types";

type EscrowTypeTabsProps = {
  value: EscrowType;
  onValueChange: (type: EscrowType) => void;
  disabled?: boolean;
};

export const EscrowTypeTabs = ({
  value,
  onValueChange,
  disabled = false,
}: EscrowTypeTabsProps) => {
  return (
    <RoundedTabs
      fullWidth
      value={value}
      className={cn(
        "w-full lg:w-full [&>button]:flex-1 [&>button]:justify-center",
        disabled && "pointer-events-none opacity-50",
      )}
      items={ESCROW_TABS.map((tab) => ({
        value: tab.value,
        label: tab.label,
        icon: <tab.icon />,
      }))}
      onValueChange={(next) => {
        if (isEscrowType(next)) {
          onValueChange(next);
        }
      }}
    />
  );
};
