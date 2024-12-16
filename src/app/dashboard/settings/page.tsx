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
import { Textarea } from "@/components/ui/textArea";

type SettingsFormValues = {
  identification: string;
  username: string;
  email: string;
  bio: string;
  saveEscrow: boolean;
};

export default function SettingsPage() {
  const { theme, toggleTheme } = useThemeStore();
  const form = useForm<SettingsFormValues>({
    defaultValues: {
      identification: "",
      username: "",
      email: "",
      bio: "",
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
    <Bounded>
      <div>
        <section className="mb-12 border-b pb-8">
          <h1 className="text-3xl font-bold mb-4">Appearance</h1>
          <p className="text-sm text-gray-500 mb-4">
            Customize the appearance of the app. Automatically switch between
            day and night themes.
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
        </section>

        <section>
          <h1 className="text-3xl font-bold mb-4">Profile</h1>
          <p className="text-sm text-gray-500 mb-4">
            This is how others will see you on the site.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="identification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identification</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your identification"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Select a verified email to display"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="I own a computer."
                        {...field}
                        className="resize-none"
                      />
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
        </section>
      </div>
    </Bounded>
  );
}
