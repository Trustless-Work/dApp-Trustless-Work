import * as React from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/ui/form";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/ui/select";
import { Textarea } from "@/ui/textarea";
import { useUpdateEscrow } from "./useUpdateEscrow";
import { Trash2, DollarSign, Percent, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { trustlines } from "@/constants/trustlines.constant";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog";

export const UpdateEscrowDialog = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const {
    form,
    isSubmitting,
    milestones,
    isAnyMilestoneEmpty,
    handleSubmit,
    handleAddMilestone,
    handleRemoveMilestone,
    handleAmountChange,
    handlePlatformFeeChange,
    isEscrowLocked,
    initialMilestonesCount,
  } = useUpdateEscrow({ onSuccess: () => setIsOpen(false) });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button type="button" className="cursor-pointer w-full">
          Update
        </Button>
      </DialogTrigger>
      <DialogContent className="!w-full sm:!max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Escrow</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
            <Card className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4">
              <Link
                className="flex-1"
                href="https://docs.trustlesswork.com/trustless-work/technology-overview/escrow-types"
                target="_blank"
              >
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <h2 className="text-xl font-semibold">
                    Single Release Escrow
                  </h2>
                </div>
                <p className="text-muted-foreground mt-1">
                  Update escrow details and milestones
                </p>

                {isEscrowLocked && (
                  <div className="flex flex-col gap-2 text-sm bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-md border border-yellow-200 dark:border-yellow-800 mt-3 px-4">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-yellow-600 dark:text-yellow-500 font-medium" />
                      <span className="text-yellow-600 dark:text-yellow-500 font-medium">
                        Escrow is locked
                      </span>
                    </div>

                    <p className="text-muted-foreground font-medium">
                      When the escrow has balance, it cannot be updated in all
                      fields, just adding new milestones is allowed.
                    </p>
                  </div>
                )}
              </Link>
            </Card>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Title<span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Escrow title"
                        disabled={isEscrowLocked}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="engagementId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Engagement<span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter identifier"
                        disabled={isEscrowLocked}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="trustline.address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Trustline<span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        disabled={isEscrowLocked}
                        onValueChange={(e) => {
                          field.onChange(e);
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select trustline" />
                        </SelectTrigger>
                        <SelectContent>
                          {trustlines
                            .filter((option) => option.address)
                            .map((option, index) => (
                              <SelectItem
                                key={`${option.address}-${index}`}
                                value={option.address}
                              >
                                {option.symbol}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="roles.approver"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      <span className="flex items-center">
                        Approver<span className="text-destructive ml-1">*</span>
                      </span>
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Enter approver address"
                        {...field}
                        disabled={isEscrowLocked}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roles.serviceProvider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      <span className="flex items-center">
                        Service Provider
                        <span className="text-destructive ml-1">*</span>
                      </span>
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Enter service provider address"
                        {...field}
                        disabled={isEscrowLocked}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="roles.releaseSigner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      <span className="flex items-center">
                        Release Signer
                        <span className="text-destructive ml-1">*</span>
                      </span>
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Enter release signer address"
                        {...field}
                        disabled={isEscrowLocked}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roles.disputeResolver"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      <span className="flex items-center">
                        Dispute Resolver
                        <span className="text-destructive ml-1">*</span>
                      </span>
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Enter dispute resolver address"
                        {...field}
                        disabled={isEscrowLocked}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="roles.platformAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      <span className="flex items-center">
                        Platform
                        <span className="text-destructive ml-1">*</span>
                      </span>
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Enter platform address"
                        {...field}
                        disabled={isEscrowLocked}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="roles.receiver"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      <span className="flex items-center">
                        Receiver<span className="text-destructive ml-1">*</span>
                      </span>
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Enter receiver address"
                        {...field}
                        disabled={isEscrowLocked}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="platformFee"
                render={() => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Platform Fee
                      <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Percent
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                          size={18}
                        />
                        <Input
                          placeholder="Enter platform fee"
                          className="pl-10"
                          disabled={isEscrowLocked}
                          value={form.watch("platformFee")?.toString() || ""}
                          onChange={handlePlatformFeeChange}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={() => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Amount<span className="text-destructive ml-1">*</span>
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
                          value={form.watch("amount")?.toString() || ""}
                          onChange={handleAmountChange}
                          disabled={isEscrowLocked}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Description<span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isEscrowLocked}
                      placeholder="Escrow description"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel className="flex items-center">
                Milestones<span className="text-destructive ml-1">*</span>
              </FormLabel>
              {milestones.map((milestone, index) => (
                <div key={index}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <Input
                      placeholder="Milestone Description"
                      value={milestone.description}
                      className="w-full sm:flex-1"
                      disabled={
                        isEscrowLocked && index < initialMilestonesCount
                      }
                      onChange={(e) => {
                        const updatedMilestones = [...milestones];
                        updatedMilestones[index].description = e.target.value;
                        form.setValue("milestones", updatedMilestones);
                      }}
                    />

                    <Button
                      onClick={() => handleRemoveMilestone(index)}
                      className="p-2 bg-transparent text-destructive rounded-md border-none shadow-none hover:bg-transparent hover:shadow-none hover:text-destructive focus:ring-0 active:ring-0 self-start sm:self-center cursor-pointer"
                      type="button"
                      disabled={
                        (isEscrowLocked && index < initialMilestonesCount) ||
                        milestones.length === 1
                      }
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>

                  {index === milestones.length - 1 && (
                    <div className="flex justify-end mt-4">
                      <Button
                        disabled={isAnyMilestoneEmpty}
                        className="w-full md:w-1/4 cursor-pointer"
                        variant="outline"
                        onClick={handleAddMilestone}
                        type="button"
                      >
                        Add Item
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-start">
              <Button
                className="w-full md:w-1/4 cursor-pointer"
                type="submit"
                disabled={isAnyMilestoneEmpty || isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="ml-2">Updating...</span>
                  </div>
                ) : (
                  "Update"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
