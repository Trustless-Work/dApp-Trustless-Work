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
import { useInitializeEscrow } from "@/components/modules/escrow/hooks/initialize-escrow.hook";
import TooltipInfo from "@/components/utils/ui/Tooltip";
import SelectField from "@/components/utils/ui/SelectSearch";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Trash2 } from "lucide-react";

const InitializeEscrowForm = () => {
  const {
    form,
    milestones,
    onSubmit,
    handleAddMilestone,
    handleRemoveMilestone,
    handleFieldChange,
    userOptions,
  } = useInitializeEscrow();

  const [showSelect, setShowSelect] = useState({
    client: false,
    serviceProvider: false,
    platformAddress: false,
    releaseSigner: false,
    disputeResolver: false,
  });

  const toggleField = (field: string, value: boolean) => {
    setShowSelect((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Title
                  <TooltipInfo content="Significant title for escrow." />
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Escrow title"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange("title", e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Description
                  <TooltipInfo content="Description that clearly explains the purpose of the escrow." />
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Escrow description"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange("description", e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="client"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-between">
                  <span className="flex items-center">Client</span>
                  <Switch
                    checked={showSelect.client}
                    onCheckedChange={(value) => toggleField("client", value)}
                    title="Show Users List?"
                  />
                </FormLabel>

                <FormControl>
                  {showSelect.client ? (
                    <SelectField
                      control={form.control}
                      name="client"
                      label=""
                      tooltipContent=""
                      options={userOptions}
                    />
                  ) : (
                    <Input
                      placeholder="Enter client address"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange("client", e.target.value);
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
            name="serviceProvider"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-between">
                  <span className="flex items-center">
                    Service Provider
                    <TooltipInfo content="Address of the service provider for this escrow." />
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
                      name="serviceProvider"
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
                        handleFieldChange("serviceProvider", e.target.value);
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
            name="engagementId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Engagement
                  <TooltipInfo content="Unique identifier for this escrow engagement." />
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter identifier"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange("engagementId", e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="platformAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-between">
                  <span className="flex items-center">
                    Platform Address
                    <TooltipInfo content="Public key of the platform managing the escrow." />
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
                      name="platformAddress"
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
                        handleFieldChange("platformAddress", e.target.value);
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
                  Platform Fee
                  <TooltipInfo content="Fee charged by the platform for this escrow." />
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter platform fee"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange("platformFee", e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Amount
                  <TooltipInfo content="Total amount to be held in escrow." />
                </FormLabel>
                <FormControl>
                  <Input
                    type="string"
                    placeholder="Enter the escrow amount"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange("amount", e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="releaseSigner"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-between">
                  <span className="flex items-center">
                    Release Signer
                    <TooltipInfo content="Entity authorized to release funds from escrow." />
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
                      name="releaseSigner"
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
                        handleFieldChange("releaseSigner", e.target.value);
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
            name="disputeResolver"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-between">
                  <span className="flex items-center">
                    Dispute Resolver
                    <TooltipInfo content="Entity responsible for resolving disputes." />
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
                      name="disputeResolver"
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
                        handleFieldChange("disputeResolver", e.target.value);
                      }}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormLabel className="flex items-center">
            Milestones
            <TooltipInfo content="Key stages or deliverables for the escrow." />
          </FormLabel>
          {milestones.map((milestone, index) => (
            <>
              <div key={index} className="flex items-center space-x-4">
                <Input
                  placeholder="Milestone Description"
                  value={milestone.description}
                  onChange={(e) => {
                    const updatedMilestones = [...milestones];
                    updatedMilestones[index].description = e.target.value;
                    form.setValue("milestones", updatedMilestones);
                    handleFieldChange("milestones", updatedMilestones);
                  }}
                />

                <Button
                  onClick={() => handleRemoveMilestone(index)}
                  className="p-2 bg-transparent text-red-500 rounded-md border-none shadow-none hover:bg-transparent hover:shadow-none hover:text-red-500 focus:ring-0 active:ring-0"
                  disabled={index === 0}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>

              {index === milestones.length - 1 && (
                <div className="flex justify-end">
                  <Button
                    disabled={milestone.description === ""}
                    className="w-full md:w-1/4"
                    variant="outline"
                    onClick={handleAddMilestone}
                    type="button"
                  >
                    Add Item
                  </Button>
                </div>
              )}
            </>
          ))}
        </div>

        <div className="flex justify-start">
          <Button className="w-full md:w-1/4" type="submit">
            Initialize Escrow
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default InitializeEscrowForm;
