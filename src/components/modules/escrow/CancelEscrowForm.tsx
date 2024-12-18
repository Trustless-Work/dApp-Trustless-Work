"use client";

import { Button } from "@/components/ui/button";
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
import { useCancelEscrowHook } from "./hooks/cancel-escrow.hook";
import { TooltipInfo } from "./EscrowFormField";

export function CancelEscrowForm() {
  const { form, onSubmit } = useCancelEscrowHook();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-6"
      >
        <FormField
          control={form.control}
          name="contractId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                Contract ID
                <TooltipInfo content="Unique identifier for this escrow contract." />
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter the contract id" {...field} />
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
                Engagement
                <TooltipInfo content="ID to identify escrows for a service provider." />
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter the engagement" {...field} />
              </FormControl>
              <FormDescription>
                This engagement will help you identify the escrows associated
                with a service provider.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full md:w-1/4" type="submit">
          Cancel Escrow
        </Button>
      </form>
    </Form>
  );
}
