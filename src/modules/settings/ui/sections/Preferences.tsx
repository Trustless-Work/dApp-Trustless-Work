"use client";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "@/ui/form";
import { Switch } from "@/ui/switch";
import { Button } from "@/ui/button";
import usePreferences, {
  PreferencesForm,
} from "../../hooks/usePreferencesSection";
import { Card, CardContent } from "@/ui/card";
import { cn } from "@/lib/utils";

interface PreferencesProps {
  onSave: (data: PreferencesForm) => void;
}

export const Preferences = ({ onSave }: PreferencesProps) => {
  const { form, onSubmit } = usePreferences({
    onSave,
  });

  return (
    <Card className={cn("overflow-hidden")}>
      <CardContent className="p-6">
        <h1 className="text-3xl font-bold mb-4">Preferences</h1>
        <p className="text-gray-500 mb-4">
          Modify your preferences to tailor your experience and ensure
          everything fits your needs.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="saveEscrow"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Save Escrows</FormLabel>
                    <FormDescription>
                      Enable this option to save escrow settings automatically.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
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
      </CardContent>
    </Card>
  );
};
