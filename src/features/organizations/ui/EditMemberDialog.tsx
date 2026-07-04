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
import {
  editMemberSchema,
  type EditMemberFormData,
} from "@/features/organizations/schemas/edit-member.schema";
import { useUpdateMember } from "@/features/organizations/hooks/useUpdateMember";
import type { MemberResponse } from "@/features/organizations/types/organization.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type EditMemberDialogProps = {
  organizationId: string;
  member: MemberResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const EditMemberDialog = ({
  organizationId,
  member,
  open,
  onOpenChange,
}: EditMemberDialogProps) => {
  const { mutateAsync, isPending } = useUpdateMember();

  const form = useForm<EditMemberFormData>({
    resolver: zodResolver(editMemberSchema),
    defaultValues: { label: member?.label?.trim() ?? "" },
    mode: "onChange",
  });

  useEffect(() => {
    if (member) {
      form.reset({ label: member.label?.trim() ?? "" });
    }
  }, [form, member]);

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!member) {
      return;
    }

    await mutateAsync({
      organizationId,
      memberId: member.id,
      payload: values,
    });
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit member</DialogTitle>
          <DialogDescription>
            Update how this member appears in the organization.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="label"
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
