import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useGlobalBoundedStore } from "@/core/store/data";
import { FormProvider } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import TooltipInfo from "@/components/utils/ui/Tooltip";
import useFundEscrowDialogHook from "../../hooks/fund-escrow-dialog.hook";
import { useEscrowUIBoundedStore } from "../../store/ui";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CircleDollarSignIcon, DollarSign, Loader2 } from "lucide-react";

interface FundEscrowDialogProps {
  isSecondDialogOpen: boolean;
  setIsSecondDialogOpen: (value: boolean) => void;
}

const FundEscrowDialog = ({
  isSecondDialogOpen,
  setIsSecondDialogOpen,
}: FundEscrowDialogProps) => {
  const { form, onSubmit, handleClose, paymentMethod, setIsDialogOpen } =
    useFundEscrowDialogHook({
      setIsSecondDialogOpen,
    });

  const selectedEscrow = useGlobalBoundedStore((state) => state.selectedEscrow);
  const isFundingEscrow = useEscrowUIBoundedStore(
    (state) => state.isFundingEscrow,
  );
  const isMoonpayWidgetOpen = useEscrowUIBoundedStore(
    (state) => state.isMoonpayWidgetOpen,
  );
  const setIsMoonpayWidgetOpen = useEscrowUIBoundedStore(
    (state) => state.setIsMoonpayWidgetOpen,
  );

  return (
    <>
      <Dialog open={isSecondDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Funding - {selectedEscrow?.title}</DialogTitle>
            <DialogDescription>
              Allows users to deposit funds into an existing escrow contract,
              securing them until the agreed conditions are met.
            </DialogDescription>
          </DialogHeader>

          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4 py-4"
            >
              <div className="flex flex-col ms-center gap-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Amount <span className="text-destructive ml-1">*</span>
                        <TooltipInfo content="The amount to be funded." />
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                            size={18}
                          />
                          <Input
                            placeholder="Enter amount"
                            className="pl-10"
                            value={field.value === 0 ? "" : field.value || ""}
                            onChange={(e) => {
                              let rawValue = e.target.value;
                              rawValue = rawValue.replace(/[^0-9.]/g, "");

                              if (rawValue.split(".").length > 2) {
                                rawValue = rawValue.slice(0, -1);
                              }

                              field.onChange(rawValue ? Number(rawValue) : 0);
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex justify-between"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="wallet" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Pay by Wallet
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="card" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Pay by Card (via MoonPay)
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                {paymentMethod === "card" ? (
                  <Button
                    type="button"
                    disabled={isFundingEscrow}
                    onClick={() => {
                      setIsDialogOpen(false);
                      setIsSecondDialogOpen(false);
                      setIsMoonpayWidgetOpen(!isMoonpayWidgetOpen);
                    }}
                  >
                    <CircleDollarSignIcon />
                    Fund Escrow
                  </Button>
                ) : (
                  <Button type="submit" disabled={isFundingEscrow}>
                    {isFundingEscrow ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Funding...
                      </>
                    ) : (
                      <>
                        <CircleDollarSignIcon />
                        Fund Escrow
                      </>
                    )}
                  </Button>
                )}
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FundEscrowDialog;
