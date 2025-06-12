"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import TooltipInfo from "@/components/utils/ui/Tooltip";
import SelectField from "@/components/utils/ui/SelectSearch";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign, Trash2 } from "lucide-react";
import { useEscrowUIBoundedStore } from "../../../store/ui";
import { useInitializeMultiEscrow } from "../../../hooks/multi-release/initialize-multi-escrow.hook";
import { Card } from "@/components/ui/card";

export const InitializeMultiEscrowForm = () => {
  const {
    form,
    milestones,
    userOptions,
    trustlineOptions,
    showSelect,
    isAnyMilestoneEmpty,
    toggleField,
    onSubmit,
    handleAddMilestone,
    handleRemoveMilestone,
    fillTemplateForm,
  } = useInitializeMultiEscrow();

  const setEscrowType = useEscrowUIBoundedStore((state) => state.setEscrowType);
  const toggleStep = useEscrowUIBoundedStore((state) => state.toggleStep);

  const handleChangeType = () => {
    setEscrowType(null);
    toggleStep(2);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-6"
      >
        <Card className="flex justify-between items-center gap-4 p-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <h2 className="text-xl font-semibold">Multi Release Escrow</h2>
            </div>
            <p className="text-muted-foreground mt-1">
              Payments will be released as each milestone is completed
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Button
              variant="outline"
              onClick={handleChangeType}
              className="flex items-center gap-2"
            >
              Change Escrow Type
            </Button>
            {(process.env.NEXT_PUBLIC_ENV === "DEV" ||
              process.env.NEXT_PUBLIC_ENV === "LOCAL") && (
              <Button
                type="button"
                variant="outline"
                onClick={fillTemplateForm}
                className="shrink-0"
              >
                Use Template
              </Button>
            )}
          </div>
        </Card>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Title<span className="text-destructive ml-1">*</span>
                  <TooltipInfo content="Name of the escrow." />
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Escrow title"
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
                  <TooltipInfo content="Unique identifier for the escrow." />
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter identifier"
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

          <SelectField
            required
            control={form.control}
            name="trustline.address"
            label="Trustline"
            tooltipContent="Information on the trustline that will manage the movement of funds in escrow."
            options={trustlineOptions.map((tl) => ({
              value: tl.value,
              label: tl.label || "",
            }))}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="roles.approver"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-between">
                  <span className="flex items-center">
                    Approver<span className="text-destructive ml-1">*</span>
                    <TooltipInfo content="Address of the entity requiring the service." />
                  </span>
                  <Switch
                    checked={showSelect.approver}
                    onCheckedChange={(value) => toggleField("approver", value)}
                    title="Show Users List?"
                  />
                </FormLabel>

                <FormControl>
                  {showSelect.approver ? (
                    <SelectField
                      control={form.control}
                      name="roles.approver"
                      label=""
                      tooltipContent=""
                      options={userOptions}
                    />
                  ) : (
                    <Input
                      placeholder="Enter approver address"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                  )}
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
                    <TooltipInfo content="The person providing the service." />
                  </span>
                  <Switch
                    checked={showSelect.serviceProvider}
                    onCheckedChange={(value) =>
                      toggleField("serviceProvider", value)
                    }
                    title="Show Users List?"
                  />
                </FormLabel>

                <FormControl>
                  {showSelect.serviceProvider ? (
                    <SelectField
                      control={form.control}
                      name="roles.serviceProvider"
                      label=""
                      tooltipContent=""
                      options={userOptions}
                    />
                  ) : (
                    <Input
                      placeholder="Enter service provider address"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="roles.releaseSigner"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-between">
                  <span className="flex items-center">
                    Release Signer
                    <span className="text-destructive ml-1">*</span>
                    <TooltipInfo content="Address of the user in charge of releasing the escrow funds to the service provider." />
                  </span>
                  <Switch
                    checked={showSelect.releaseSigner}
                    onCheckedChange={(value) =>
                      toggleField("releaseSigner", value)
                    }
                    title="Show Users List?"
                  />
                </FormLabel>

                <FormControl>
                  {showSelect.releaseSigner ? (
                    <SelectField
                      control={form.control}
                      name="roles.releaseSigner"
                      label=""
                      tooltipContent=""
                      options={userOptions}
                    />
                  ) : (
                    <Input
                      placeholder="Enter release signer address"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                  )}
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
                    <TooltipInfo content="Address in charge of resolving disputes within the escrow." />
                  </span>
                  <Switch
                    checked={showSelect.disputeResolver}
                    onCheckedChange={(value) =>
                      toggleField("disputeResolver", value)
                    }
                    title="Show Users List?"
                  />
                </FormLabel>

                <FormControl>
                  {showSelect.disputeResolver ? (
                    <SelectField
                      control={form.control}
                      name="roles.disputeResolver"
                      label=""
                      tooltipContent=""
                      options={userOptions}
                    />
                  ) : (
                    <Input
                      placeholder="Enter dispute resolver address"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="roles.platformAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-between">
                  <span className="flex items-center">
                    Platform Address
                    <span className="text-destructive ml-1">*</span>
                    <TooltipInfo content="Address of the entity that owns the escrow." />
                  </span>
                  <Switch
                    checked={showSelect.platformAddress}
                    onCheckedChange={(value) =>
                      toggleField("platformAddress", value)
                    }
                    title="Show Users List?"
                  />
                </FormLabel>

                <FormControl>
                  {showSelect.platformAddress ? (
                    <SelectField
                      control={form.control}
                      name="roles.platformAddress"
                      label=""
                      tooltipContent=""
                      options={userOptions}
                    />
                  ) : (
                    <Input
                      placeholder="Enter platform address"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                  )}
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
                    <TooltipInfo content="Final recipient of funds." />
                  </span>
                  <Switch
                    checked={showSelect.receiver}
                    onCheckedChange={(value) => toggleField("receiver", value)}
                    title="Show Users List?"
                  />
                </FormLabel>

                <FormControl>
                  {showSelect.receiver ? (
                    <SelectField
                      control={form.control}
                      name="roles.receiver"
                      label=""
                      tooltipContent=""
                      options={userOptions}
                    />
                  ) : (
                    <Input
                      placeholder="Enter receiver address"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="platformFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Platform Fee<span className="text-destructive ml-1">*</span>
                  <TooltipInfo content="Commission that the platform will receive when the escrow is completed." />
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter platform fee"
                    value={field.value !== "" ? `${field.value}%` : ""}
                    onChange={(e) => {
                      let rawValue = e.target.value;
                      rawValue = rawValue.replace(/[^0-9.]/g, "");

                      if (rawValue.split(".").length > 2) {
                        rawValue = rawValue.slice(0, -1);
                      }

                      field.onChange(rawValue);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="receiverMemo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Receiver Memo (opcional)
                  <TooltipInfo content="Enter the code or memo needed to send funds to the right person." />
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter the escrow receiver Memo"
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
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                Description<span className="text-destructive ml-1">*</span>
                <TooltipInfo content="Text describing the function of the escrow." />
              </FormLabel>
              <FormControl>
                <Textarea
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
            <TooltipInfo content="Objectives to be completed to define the escrow as completed." />
          </FormLabel>
          {milestones.map((milestone, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-center space-x-4">
                <Input
                  placeholder="Milestone Description"
                  value={milestone.description}
                  className="w-3/5"
                  onChange={(e) => {
                    const updatedMilestones = [...milestones];
                    updatedMilestones[index].description = e.target.value;
                    form.setValue("milestones", updatedMilestones);
                  }}
                />

                <div className="relative w-2/5">
                  <DollarSign
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    size={18}
                  />
                  <Input
                    type="string"
                    className="pl-10"
                    placeholder="Enter milestone amount"
                    value={milestone.amount || ""}
                    onChange={(e) => {
                      const updatedMilestones = [...milestones];
                      updatedMilestones[index].amount = e.target.value;
                      form.setValue("milestones", updatedMilestones);
                    }}
                  />
                </div>

                <Button
                  onClick={() => handleRemoveMilestone(index)}
                  className="p-2 bg-transparent text-red-500 rounded-md border-none shadow-none hover:bg-transparent hover:shadow-none hover:text-red-500 focus:ring-0 active:ring-0"
                  disabled={index === 0}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>

              {index === milestones.length - 1 && (
                <div className="flex justify-end mt-4">
                  <Button
                    disabled={isAnyMilestoneEmpty}
                    className="w-full md:w-1/4"
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
            className="w-full md:w-1/4"
            type="submit"
            disabled={isAnyMilestoneEmpty}
          >
            Initialize Escrow
          </Button>
        </div>
      </form>
    </Form>
  );
};
