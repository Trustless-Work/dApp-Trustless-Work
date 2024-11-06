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
import { useInitializeEscrowHook } from "./hooks/initialize-escrow.hook";

export function InitializeEscrowForm() {
  const { form, onSubmit } = useInitializeEscrowHook();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-6"
      >
        <FormField
          control={form.control}
          name="engagementId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Engagement</FormLabel>
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
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter the description" {...field} />
              </FormControl>
              <FormDescription>Describe the escrow.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="serviceProvider"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Provider</FormLabel>
              <FormControl>
                <Input placeholder="Enter the service provider" {...field} />
              </FormControl>
              <FormDescription>
                Please enter the wallet of the service provider.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter the amount of the entire escrow"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Please enter the amount/price of the escrow.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full md:w-1/4" type="submit">
          Initialize Escrow
        </Button>
      </form>
    </Form>
  );
}
