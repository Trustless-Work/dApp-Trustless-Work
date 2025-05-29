"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { WalletType } from "@/@types/contact.entity";
import { useForm } from "react-hook-form";
import { formSchema, ContactFormData } from "../../schema/contact-schema";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface InitializeContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<void>;
}

const InitializeContactForm = ({ onSubmit }: InitializeContactFormProps) => {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      walletType: WalletType.ALBEDO,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Contact name" {...field} />
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
                <Input placeholder="Contact email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wallet Address</FormLabel>
              <FormControl>
                <Input placeholder="Wallet public key" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="walletType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wallet Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select wallet type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={WalletType.ALBEDO}>
                    {WalletType.ALBEDO}
                  </SelectItem>
                  <SelectItem value={WalletType.LOBSTR}>
                    {WalletType.LOBSTR}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-start">
          <Button type="submit" className="w-full md:w-1/4">
            Create Contact
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default InitializeContactForm;
