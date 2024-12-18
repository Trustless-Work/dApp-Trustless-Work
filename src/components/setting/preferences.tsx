"use client";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function PreferencesSection({
  onSave,
}: {
  onSave: (data: any) => void;
}) {
  const form = useForm({
    defaultValues: {
      saveEscrow: false,
    },
  });
  const [saveEscrow, setSaveEscrow] = useState(false);

  const onSubmit = (data: any) => {
    onSave(data);
  };

  return (
    <section>
      <h1 className="text-3xl font-bold mb-4">Preferences</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="saveEscrow"
            render={() => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Save Escrows</FormLabel>
                  <FormDescription>
                    Enable this option to save escrow settings automatically.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={saveEscrow}
                    onCheckedChange={(checked) => setSaveEscrow(checked)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full md:w-1/6">
            Save Preferences
          </Button>
        </form>
      </Form>
    </section>
  );
}
