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
import useProfile from "./hooks/profile-section.hook";
import { UserPayload } from "@/@types/user.entity";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import { useFormatUtils } from "@/utils/hook/format.hook";

interface ProfileSectionProps {
  onSave: (data: UserPayload) => void;
}

const ProfileSection = ({ onSave }: ProfileSectionProps) => {
  const { form, onSubmit } = useProfile({
    onSave,
  });

  const loggedUser = useGlobalAuthenticationStore((state) => state.loggedUser);
  const { formatDateFromFirebase } = useFormatUtils();
  console.log(loggedUser);
  return (
    <Card className={cn("overflow-hidden")}>
      <CardContent className="p-6">
        <div className="flex w-full justify-between">
          <h1 className="text-3xl font-bold mb-4">Profile</h1>
          <p className="italic text-sm">
            {" "}
            {/* <strong>Created:</strong>{formatDateFromFirebase(loggedUser?.createdAt.)} */}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end w-full">
              <Button type="submit">Save Profile</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProfileSection;
