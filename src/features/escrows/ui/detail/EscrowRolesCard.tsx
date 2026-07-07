"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { useLinkedAddressHighlight } from "@/features/escrows/hooks/useLinkedAddressHighlight";
import type { StoredEscrow } from "@/features/escrows/types/escrow.types";
import { EscrowCopyField } from "@/features/escrows/ui/detail/EscrowCopyField";
import {
  getAddressOccurrenceCounts,
  getEscrowRoleEntries,
  isSharedEscrowAddress,
} from "@/features/escrows/utils/escrow-display.helper";

type EscrowRolesCardProps = {
  escrow: StoredEscrow;
};

export const EscrowRolesCard = ({ escrow }: EscrowRolesCardProps) => {
  const roles = getEscrowRoleEntries(escrow);
  const { getLinkedAddressProps } = useLinkedAddressHighlight();
  const addressCounts = useMemo(() => getAddressOccurrenceCounts(roles), [roles]);

  return (
    <section className="rounded-3xl border border-border bg-card p-4 sm:p-6 lg:p-8">
      <h2 className="text-lg font-semibold tracking-tight">Roles</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Accounts authorized to act on this escrow.
      </p>

      <ul className="mt-6 grid min-w-0 gap-3 sm:gap-4 md:grid-cols-2">
        {roles.map((role) => (
          <li
            key={role.label}
            className="min-w-0 rounded-2xl border border-border bg-muted/30 p-3 sm:p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold tracking-tight">
                {role.label}
              </h3>
              <Badge variant="secondary" className="shrink-0 uppercase">
                {role.addresses.length}{" "}
                {role.addresses.length === 1 ? "wallet" : "wallets"}
              </Badge>
            </div>

            <ul className="mt-3 flex min-w-0 flex-col gap-2">
              {role.addresses.map((address) => {
                const isShared = isSharedEscrowAddress(addressCounts, address);
                const linkProps = getLinkedAddressProps(address, isShared);

                return (
                  <li key={`${role.label}-${address}`} className="min-w-0">
                    <EscrowCopyField value={address} compact {...linkProps} />
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
};
