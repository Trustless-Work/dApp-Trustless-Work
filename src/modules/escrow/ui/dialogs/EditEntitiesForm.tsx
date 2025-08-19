import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";
import TooltipInfo from "@/shared/utils/Tooltip";
import { Input } from "@/ui/input";
import { Switch } from "@/ui/switch";
import SelectField from "@/shared/utils/SelectSearch";
import { DialogFooter } from "@/ui/dialog";
import { Button } from "@/ui/button";
import useEditEntitiesDialog from "../../hooks/useEditEntitiesDialog";
import { Loader2, Save } from "lucide-react";

interface EditEntitiesFormProps {
  setIsEditEntitiesDialogOpen: (value: boolean) => void;
  isEditingEntities: boolean;
}

export const EditEntitiesForm = ({
  setIsEditEntitiesDialogOpen,
  isEditingEntities,
}: EditEntitiesFormProps) => {
  const { form, userOptions, showSelect, toggleField, onSubmit } =
    useEditEntitiesDialog({
      setIsEditEntitiesDialogOpen,
    });

  return (
    <Form {...form}>
      <form className="grid gap-4 py-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col ms-center gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="serviceProvider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    <span className="flex items-center">
                      Service Provider
                      <span className="text-destructive ml-1">*</span>
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
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="approver"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    <span className="flex items-center">
                      Approver<span className="text-destructive ml-1">*</span>
                      <TooltipInfo content="Address of the approver for this escrow." />
                    </span>
                    <Switch
                      checked={showSelect.approver}
                      onCheckedChange={(value) =>
                        toggleField("approver", value)
                      }
                      title="Show Users List?"
                    />
                  </FormLabel>

                  <FormControl>
                    {showSelect.approver ? (
                      <SelectField
                        control={form.control}
                        name="approver"
                        label=""
                        tooltipContent="A"
                        options={userOptions}
                      />
                    ) : (
                      <Input placeholder="Enter approver address" {...field} />
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
              name="releaseSigner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    <span className="flex items-center">
                      Release Signer
                      <span className="text-destructive ml-1">*</span>
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
                        placeholder="Enter release signer address"
                        {...field}
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
                      <span className="text-destructive ml-1">*</span>
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
                        placeholder="Enter dispute resolver address"
                        {...field}
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
              name="platformAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    <span className="flex items-center">
                      Platform Address{" "}
                      <span className="text-destructive ml-1">*</span>
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
                      <Input placeholder="Enter platform address" {...field} />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="receiver"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    <span className="flex items-center">
                      Receiver <span className="text-destructive ml-1">*</span>
                      <TooltipInfo content="Receiver wallet address." />
                    </span>
                    <Switch
                      checked={showSelect.receiver}
                      onCheckedChange={(value) =>
                        toggleField("receiver", value)
                      }
                      title="Show Users List?"
                    />
                  </FormLabel>
                  <FormControl>
                    {showSelect.receiver ? (
                      <SelectField
                        control={form.control}
                        name="receiver"
                        label=""
                        tooltipContent=""
                        options={userOptions}
                      />
                    ) : (
                      <Input placeholder="Enter receiver address" {...field} />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="submit"
            className="bg-green-800 hover:bg-green-700 text-white"
            disabled={isEditingEntities}
          >
            {isEditingEntities ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin flex-shrink-0" />
                <span className="truncate">Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">Save Changes</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
