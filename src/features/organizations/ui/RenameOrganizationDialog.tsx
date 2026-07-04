"use client";

import { Loader2 } from "lucide-react";
import { useEffect } from "react";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createOrganizationSchema } from "@/features/organizations/schemas/create-organization.schema";
import { useUpdateOrganization } from "@/features/organizations/hooks/useUpdateOrganization";
import type { OrganizationResponse } from "@/features/organizations/types/organization.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { CreateOrganizationFormData } from "@/features/organizations/schemas/create-organization.schema";

type RenameOrganizationDialogProps = {
  organization: OrganizationResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const RenameOrganizationDialog = ({
  organization,
  open,
  onOpenChange,
}: RenameOrganizationDialogProps) => {
  const { mutateAsync, isPending } = useUpdateOrganization();

  const form = useForm<CreateOrganizationFormData>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: { name: organization?.name ?? "" },
    mode: "onChange",
  });

  useEffect(() => {
    if (organization) {
      form.reset({ name: organization.name });
    }
  }, [form, organization]);

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!organization) {
      return;
    }

    await mutateAsync({ id: organization.id, payload: values });
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename organization</DialogTitle>
          <DialogDescription>
            Update the display name for this organization.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
