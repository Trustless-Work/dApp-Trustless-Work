import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import TooltipInfo from "@/components/utils/ui/Tooltip";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEditSingleBasicPropertiesDialog } from "../../../hooks/single-release/edit-single-basic-properties-dialog.hook";
import { DollarSign } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface EditSingleBasicPropertiesFormProps {
  setIsEditBasicPropertiesDialogOpen: (value: boolean) => void;
}

export const EditSingleBasicPropertiesForm = ({
  setIsEditBasicPropertiesDialogOpen,
}: EditSingleBasicPropertiesFormProps) => {
  const { form, onSubmit } = useEditSingleBasicPropertiesDialog({
    setIsEditBasicPropertiesDialogOpen,
  });

  return (
    <Form {...form}>
      <form className="grid gap-4 py-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                Title<span className="text-destructive ml-1">*</span>
                <TooltipInfo content="Significant title for escrow." />
              </FormLabel>
              <FormControl>
                <Input placeholder="Escrow title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="engagementId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Engagement<span className="text-destructive ml-1">*</span>
                  <TooltipInfo content="Unique identifier for this escrow engagement." />
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter identifier" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="platformFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Platform Fee<span className="text-destructive ml-1">*</span>
                  <TooltipInfo content="Fee charged by the platform for this escrow." />
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter platform fee"
                    value={field.value ? `${field.value}%` : ""}
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Amount<span className="text-destructive ml-1">*</span>
                  <TooltipInfo content="Total amount to be held in escrow." />
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <DollarSign
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                      size={18}
                    />
                    <Input
                      type="string"
                      className="pl-10"
                      placeholder="Enter the escrow amount"
                      {...field}
                    />
                  </div>
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
                  <TooltipInfo content="Total receiver Memo to be held in escrow." />
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter the escrow receiver Memo"
                    {...field}
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
                <TooltipInfo content="Description that clearly explains the purpose of the escrow." />
              </FormLabel>
              <FormControl>
                <Textarea placeholder="Escrow description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
