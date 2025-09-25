import { useEffect, useState } from "react";
import { Button } from "@/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { Input } from "@/ui/input";
import { FormProvider } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";
import TooltipInfo from "@/shared/utils/Tooltip";
import { useWithdrawRemainingFundsDialog } from "../../hooks/useWithdrawRemainingFundsDialog";
import { useEscrowUIBoundedStore } from "../../store/ui";
import { useGlobalBoundedStore } from "@/store/data";
import { DollarSign, Loader2, Wallet2, Plus, Trash2 } from "lucide-react";
import { Card } from "@/ui/card";
import { Escrow } from "@/types/escrow.entity";
import { useEscrowBoundedStore } from "../../store/data";
import { MultiReleaseMilestone } from "@trustless-work/escrow";
import { t } from "i18next";
import { formatCurrency } from "@/lib/format";
import { z } from "zod";
import { FieldPath } from "react-hook-form";
import { getFormSchema } from "../../schema/resolve-dispute-escrow.schema";

interface WithdrawRemainingFundsDialogProps {
  isWithdrawRemainingFundsDialogOpen: boolean;
  recentEscrow?: Escrow;
}

const WithdrawRemainingFundsDialog = ({
  isWithdrawRemainingFundsDialogOpen,
  recentEscrow,
}: WithdrawRemainingFundsDialogProps) => {
  const { form, onSubmit, handleClose } = useWithdrawRemainingFundsDialog();

  const isWithdrawing = useEscrowUIBoundedStore(
    (state) => state.isWithdrawingRemainingFunds,
  );

  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const escrow = selectedEscrow || recentEscrow;

  const [isEqualToAmount, setIsEqualToAmount] = useState<boolean>(false);
  const [isMissing, setIsMissing] = useState<number>(0);

  const milestoneIndex = useEscrowBoundedStore((state) => state.milestoneIndex);
  const milestone = escrow?.milestones[
    milestoneIndex || 0
  ] as MultiReleaseMilestone;

  // Tipos derivados del schema
  type WithdrawFormValues = z.infer<ReturnType<typeof getFormSchema>>;
  type Distribution = WithdrawFormValues["distributions"][number];

  const distributions =
    (form.watch("distributions") as WithdrawFormValues["distributions"]) || [];

  const hasEmptyDistributionFields = distributions.some((d: Distribution) => {
    const amt = d.amount;
    const isAmountEmpty =
      (typeof amt === "string" && (amt.trim() === "" || amt === ".")) ||
      (typeof amt === "number" && isNaN(amt));
    return !d.address || d.address.trim() === "" || isAmountEmpty;
  });

  useEffect(() => {
    const balanceToCheck = escrow?.balance;

    const sumDistributions = distributions.reduce(
      (sum: number, d: Distribution) => {
        const val =
          typeof d.amount === "string"
            ? parseFloat(d.amount)
            : Number(d.amount);
        return sum + (isNaN(val) ? 0 : val);
      },
      0,
    );

    setIsEqualToAmount(sumDistributions === Number(balanceToCheck || "0"));

    setIsMissing(sumDistributions - Number(balanceToCheck || "0"));
  }, [distributions, escrow]);

  const handleDistributionAmountChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    let rawValue = e.target.value;
    rawValue = rawValue.replace(/[^0-9.]/g, "");

    if (rawValue.split(".").length > 2) {
      rawValue = rawValue.slice(0, -1);
    }

    if (rawValue.includes(".")) {
      const parts = rawValue.split(".");
      if (parts[1] && parts[1].length > 2) {
        rawValue = parts[0] + "." + parts[1].slice(0, 2);
      }
    }

    const current =
      (form.getValues(
        "distributions",
      ) as WithdrawFormValues["distributions"]) || [];
    const updated: WithdrawFormValues["distributions"] = current.map((d, i) =>
      i === index ? { ...d, amount: rawValue } : d,
    );
    form.setValue("distributions", updated, {
      shouldValidate: true,
      shouldTouch: true,
      shouldDirty: true,
    });
    form.trigger(
      `distributions.${index}.amount` as FieldPath<WithdrawFormValues>,
    );
  };

  const handleDistributionAddressChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const current =
      (form.getValues(
        "distributions",
      ) as WithdrawFormValues["distributions"]) || [];
    const updated: WithdrawFormValues["distributions"] = current.map((d, i) =>
      i === index ? { ...d, address: e.target.value } : d,
    );
    form.setValue("distributions", updated, {
      shouldValidate: true,
      shouldTouch: true,
      shouldDirty: true,
    });
    form.trigger(
      `distributions.${index}.address` as FieldPath<WithdrawFormValues>,
    );
    form.trigger("distributions" as FieldPath<WithdrawFormValues>);
  };

  const handleAddDistribution = () => {
    const current =
      (form.getValues(
        "distributions",
      ) as WithdrawFormValues["distributions"]) || [];
    form.setValue("distributions", [...current, { address: "", amount: 0 }]);
  };

  const handleRemoveDistribution = (index: number) => {
    const current =
      (form.getValues(
        "distributions",
      ) as WithdrawFormValues["distributions"]) || [];
    const updated: WithdrawFormValues["distributions"] = current.filter(
      (_: Distribution, i: number) => i !== index,
    );
    form.setValue("distributions", updated);
  };

  if (!escrow) {
    return null;
  }

  return (
    <Dialog
      open={isWithdrawRemainingFundsDialogOpen}
      onOpenChange={handleClose}
    >
      <DialogContent className="sm:max-w-[600px] h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Withdraw Remaining Funds</DialogTitle>
          <DialogDescription>
            Withdraw remaining balance from this escrow by distributing funds to
            one or more addresses.
          </DialogDescription>

          <Card className="grid grid-cols-1 gap-4 !mt-4 p-4">
            <div className="grid grid-cols-2 gap-4">
              <p className="text-sm text-muted-foreground p-0">
                <span className="font-extrabold">Total Balance:</span>{" "}
                {formatCurrency(escrow.balance, escrow.trustline?.name)}
              </p>

              {escrow.type === "multi-release" && (
                <p className="text-sm text-muted-foreground p-0">
                  <span className="font-extrabold">Milestone Amount:</span>{" "}
                  {formatCurrency(
                    (milestone as MultiReleaseMilestone)?.amount || 0,
                    escrow.trustline?.name,
                  )}
                </p>
              )}
            </div>
          </Card>
        </DialogHeader>

        <div className="flex-1 min-h-0 flex flex-col">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit((data) => onSubmit(data))}
              className="flex flex-col h-full"
            >
              <div className="flex-1 min-h-0 flex flex-col gap-4 overflow-y-auto px-4">
                {distributions.map((d: Distribution, index: number) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-3 items-end"
                  >
                    <div className="col-span-7">
                      <FormField<WithdrawFormValues>
                        control={form.control}
                        name={
                          `distributions.${index}.address` as FieldPath<WithdrawFormValues>
                        }
                        render={() => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              Address{" "}
                              <span className="text-destructive ml-1">*</span>
                              <TooltipInfo content="The destination address for this share." />
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter Stellar address (G...)"
                                value={d.address || ""}
                                onChange={(e) =>
                                  handleDistributionAddressChange(index, e)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-4">
                      <FormField<WithdrawFormValues>
                        control={form.control}
                        name={
                          `distributions.${index}.amount` as FieldPath<WithdrawFormValues>
                        }
                        render={() => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              Amount{" "}
                              <span className="text-destructive ml-1">*</span>
                              <TooltipInfo content="The amount to distribute to this address." />
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <DollarSign
                                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                  size={18}
                                />
                                <Input
                                  placeholder="0.00"
                                  className="pl-10"
                                  value={
                                    typeof d.amount === "string"
                                      ? d.amount
                                      : d.amount?.toString() || ""
                                  }
                                  onChange={(e) =>
                                    handleDistributionAmountChange(index, e)
                                  }
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        onClick={() => handleRemoveDistribution(index)}
                        className="mt-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddDistribution}
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Distribution
                  </Button>
                  {!isEqualToAmount && (
                    <p className="text-destructive text-xs font-bold text-end">
                      Sum must equal balance (
                      {formatCurrency(escrow.balance, escrow.trustline?.name)}
                      )
                      <br />
                      Difference:{" "}
                      {formatCurrency(
                        isMissing.toString(),
                        escrow.trustline?.name,
                      ).replace("$", "")}
                    </p>
                  )}
                </div>
              </div>

              <DialogFooter className="flex-shrink-0 flex flex-col sm:flex-row gap-4 sm:gap-0 justify-end items-center">
                <Button
                  type="submit"
                  variant="success"
                  disabled={
                    !isEqualToAmount ||
                    isWithdrawing ||
                    hasEmptyDistributionFields
                  }
                >
                  {isWithdrawing ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-1 animate-spin flex-shrink-0" />
                      <span className="truncate">Withdrawing...</span>
                    </>
                  ) : (
                    <>
                      <Wallet2 className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="truncate">Withdraw</span>
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawRemainingFundsDialog;
