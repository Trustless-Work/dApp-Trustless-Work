"use client";

import { Form, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import useAPIKeys from "./hooks/api-keys.hook";
import Link from "next/link";

const APIKeysSection = () => {
  const { form, onSubmit, showApiKey, toggleVisibility } = useAPIKeys();

  return (
    <Card className={cn("overflow-hidden")}>
      <CardContent className="p-6">
        <div className="flex justify-between">
          <div className="flex flex-col">
            <div className="flex w-full justify-between">
              <h1 className="text-3xl font-bold mb-4">Your API Keys</h1>
            </div>
            <p className="text-gray-500 mb-4">
              Manage your API keys to access the{" "}
              <Link
                href="https://docs.trustlesswork.com/trustless-work"
                className="text-primary"
                target="_blank"
              >
                {" "}
                Trustless Work API
              </Link>{" "}
              endpoints.
            </p>
          </div>

          <div className="flex flex-col w-1/6 gap-3">
            <Button className="w-full" type="submit">
              Request an API Key
            </Button>
            <Button
              className="w-full"
              onClick={toggleVisibility}
              variant="outline"
            >
              Show API Key's
            </Button>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col gap-4">
              <FormItem className="w-5/12">
                <FormControl>
                  <Input
                    type={showApiKey}
                    disabled
                    defaultValue="joelin"
                    placeholder="Enter your first name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default APIKeysSection;
