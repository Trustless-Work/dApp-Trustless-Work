"use client";

import { useThemeStore } from "@/store/themeStore/store";
import { db } from "@/constants/firebase";
import { doc, setDoc } from "firebase/firestore";
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
import { toast } from "@/hooks/use-toast";

type SettingsFormValues = {
  identification: string;
  name: string;
  lastName: string;
  saveEscrow: boolean;
};

export default function SettingsPage() {
  const { theme, toggleTheme } = useThemeStore();

  const form = useForm<SettingsFormValues>({
    defaultValues: {
      identification: "",
      name: "",
      lastName: "",
      saveEscrow: false,
    },
  });

  const onSubmit = async (data: SettingsFormValues) => {
    const userDoc = doc(db, "users", data.identification);
    try {
      await setDoc(userDoc, { ...data, wallet: "Generated Automatically" });

      toast({
        title: "Success",
        description: "Preferences saved successfully!",
      });
    } catch (error) {
      console.error("Error saving preferences:", error);

      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <div className="flex items-center justify-between">
        <span className="text-lg font-medium">Toggle Theme</span>
        <Button variant="outline" onClick={toggleTheme}>
          {theme === "dark" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="identification"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Identification</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your identification" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
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

          <Button className="w-full md:w-1/4" type="submit">
            Save Settings
          </Button>
        </form>
      </Form>
    </div>
  );
}
