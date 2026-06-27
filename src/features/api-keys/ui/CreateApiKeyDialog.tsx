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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateApiKey } from "@/features/api-keys/hooks/useCreateApiKey";
import { useCreateApiKeyForm } from "@/features/api-keys/hooks/useCreateApiKeyForm";
import { useActiveOrganization } from "@/providers/OrganizationProvider";

type CreateApiKeyDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (apiKey: string) => void;
};

export const CreateApiKeyDialog = ({
  open,
  onOpenChange,
  onCreated,
}: CreateApiKeyDialogProps) => {
  const { activeOrganization, activeOrganizationId } = useActiveOrganization();
  const canCreate = Boolean(activeOrganizationId);

  const { mutateAsync, isPending } = useCreateApiKey({
    onCreated: (apiKey) => {
      onCreated(apiKey);
      onOpenChange(false);
    },
  });

  const { form, onSubmit } = useCreateApiKeyForm({
    platformId: activeOrganizationId ?? "",
    isSubmitting: isPending,
    onSubmit: async (values) => {
      await mutateAsync(values);
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({ description: "" });
    }
  }, [form, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create API key</DialogTitle>
          <DialogDescription>
            Get access to the Trustless Work API to integrate escrow
            functionality into your application.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            {!canCreate ? (
              <p className="text-sm text-muted-foreground">
                Select or create an organization in the team switcher before
                generating an API key.
              </p>
            ) : null}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Production backend"
                      autoComplete="off"
                      disabled={isPending || !canCreate}
                    />
                  </FormControl>
                  {activeOrganization ? (
                    <FormDescription>
                      The key will be scoped to{" "}
                      <span className="font-medium text-foreground">
                        {activeOrganization.name}
                      </span>
                      .
                    </FormDescription>
                  ) : null}
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
              <Button type="submit" disabled={isPending || !canCreate}>
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create key"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
