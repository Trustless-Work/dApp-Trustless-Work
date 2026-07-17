"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatAddress } from "@/helpers/format.helper";
import { getCctpDestinationOptions } from "@/features/cctp-bridge/lib/chains";
import { useCrossChainDestination } from "@/features/cctp-bridge/hooks/useCrossChainDestination";
import {
  useClearPayoutPreference,
  useSetPayoutPreference,
} from "@/features/cctp-bridge/hooks/usePayoutPreferenceMutations";
import { usePayoutPreferenceForm } from "@/features/cctp-bridge/hooks/usePayoutPreferenceForm";
import type { EscrowKind } from "@/features/cctp-bridge/types/cctp-bridge.types";

type PayoutPreferenceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  escrowKind: EscrowKind;
  contractId: string;
  milestoneIndex?: number;
};

/**
 * Receiver-only dialog: lets the receiver pick where they get paid on the
 * next release — Stellar (default) or a chain + address via CCTP. The
 * release signer never sees or controls this; the receiver pre-registers it
 * and a normal release routes automatically.
 */
export const PayoutPreferenceDialog = ({
  open,
  onOpenChange,
  escrowKind,
  contractId,
  milestoneIndex,
}: PayoutPreferenceDialogProps) => {
  const escrow = { escrowKind, contractId, milestoneIndex };
  const chains = getCctpDestinationOptions();

  const { data: current, isLoading } = useCrossChainDestination({
    ...escrow,
    enabled: open,
  });

  const setPreference = useSetPayoutPreference(escrow);
  const clearPreference = useClearPayoutPreference(escrow);
  const isBusy = setPreference.isPending || clearPreference.isPending;

  const { form, onSubmit } = usePayoutPreferenceForm({
    isSubmitting: setPreference.isPending,
    onSubmit: async (values) => {
      await setPreference.mutateAsync(values);
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        destinationDomain: current?.destinationDomain ?? 6,
        recipientAddress: current?.recipient ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, current]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>How you want to get paid</DialogTitle>
          <DialogDescription>
            Choose where your share lands when this escrow releases. Leave it
            unset to receive USDC on Stellar as usual.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {current ? (
              <p className="text-sm text-muted-foreground">
                Currently set to route to{" "}
                <span className="font-medium text-foreground">
                  {formatAddress(current.recipient, 6)}
                </span>{" "}
                on domain {current.destinationDomain}.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                No cross-chain preference set — you&apos;ll receive USDC on
                Stellar.
              </p>
            )}

            <Form {...form}>
              <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="destinationDomain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination chain</FormLabel>
                      <Select
                        value={String(field.value)}
                        onValueChange={(value) => field.onChange(Number(value))}
                        disabled={isBusy}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a chain" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {chains.map((chain) => (
                            <SelectItem key={chain.domain} value={String(chain.domain)}>
                              {chain.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recipientAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Recipient address on the destination chain"
                          autoComplete="off"
                          disabled={isBusy}
                        />
                      </FormControl>
                      <FormDescription>
                        The address that will receive native USDC on the
                        destination chain.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
                  {current ? (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => clearPreference.mutate()}
                      disabled={isBusy}
                    >
                      {clearPreference.isPending ? (
                        <>
                          <Loader2 className="animate-spin" />
                          Reverting...
                        </>
                      ) : (
                        "Revert to Stellar"
                      )}
                    </Button>
                  ) : (
                    <span />
                  )}

                  <Button type="submit" disabled={isBusy}>
                    {setPreference.isPending ? (
                      <>
                        <Loader2 className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save preference"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
