"use client";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Switch } from "@radix-ui/react-switch";

export function ProfileSection({
  onSave,
  walletAddress,
}: {
  onSave: (data: any) => void;
  walletAddress: string;
}) {
  const form = useForm({
    defaultValues: {
      identification: "",
      firstName: "",
      lastName: "",
      saveEscrow: false,
      wallet: "",
    },
  });

  useEffect(() => {
    form.setValue("wallet", walletAddress);
  }, [walletAddress, form]);

  const onSubmit = (data: any) => {
    onSave(data);
  };

  return (
    <section>
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="identification"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Identification</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="saveEscrow"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Save Escrow</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="wallet"
            render={({ field }) => (
              <FormItem>
                <Input type="hidden" {...field} />
              </FormItem>
            )}
          />
          <Button type="submit">Save Profile</Button>
        </form>
      </Form>
    </section>
  );
}
