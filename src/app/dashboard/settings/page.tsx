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
import { Skeleton } from "@/components/ui/skeleton";
import { Bounded } from "@/components/Bounded";
import { WrapperForm } from "@/components/Wrappers";

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
    <WrapperForm>
      <div>
        <h1 className="text-3xl font-bold mb-4">Settings</h1>
        <div className="mb-6">
          <h2 className="text-lg font-medium">Theme</h2>
          <p className="text-sm text-gray-500 mb-4">
            Select the theme for the dashboard.
          </p>
          <div className="flex gap-4">
            <div
              onClick={toggleTheme}
              className={`cursor-pointer p-6 rounded-lg border ${
                theme === "light" ? "border-blue-500" : "border-gray-300"
              } bg-white shadow-sm`}
            >
              <Skeleton className="h-24 w-32 rounded-md" />
              <p
                className={`text-center mt-2 ${
                  theme === "light"
                    ? "font-bold text-blue-500"
                    : "text-gray-600"
                }`}
              >
                Light
              </p>
            </div>

            <div
              onClick={toggleTheme}
              className={`cursor-pointer p-6 rounded-lg border ${
                theme === "dark" ? "border-blue-500" : "border-gray-300"
              } bg-gray-800 shadow-sm`}
            >
              <Skeleton className="h-24 w-32 rounded-md bg-gray-700" />
              <p
                className={`text-center mt-2 ${
                  theme === "dark" ? "font-bold text-blue-500" : "text-gray-400"
                }`}
              >
                Dark
              </p>
            </div>
          </div>
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
    </WrapperForm>
  );
}
