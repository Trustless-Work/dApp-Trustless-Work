"use client";

import { Form, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import useAPIKeys from "./hooks/api-keys.hook";
import Link from "next/link";
import { useCopyUtils } from "@/utils/hook/copy.hook";

const APIKeysSection = () => {
  const { form, onSubmit, showApiKey, toggleVisibility } = useAPIKeys();
  const { copyText, copiedKeyId } = useCopyUtils();

  const apiKeys = [
    { id: "1", key: "api-key-1" },
    { id: "2", key: "api-key-2" },
    { id: "3", key: "api-key-3" },
  ]; // Ejemplo de claves de API.

  return (
    <Card className={cn("overflow-hidden")}>
      <CardContent className="p-6">
        <div className="flex justify-between">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold mb-4">Your API Keys</h1>
            <p className="text-gray-500 mb-4">
              Manage your API keys to access the{" "}
              <Link
                href="https://docs.trustlesswork.com/trustless-work"
                className="text-primary"
                target="_blank"
              >
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
              {apiKeys.map((apiKey) => (
                <FormItem key={apiKey.id} className="flex items-center gap-4">
                  <FormControl className="flex-grow">
                    <Input
                      type={showApiKey}
                      disabled
                      defaultValue={apiKey.key}
                    />
                  </FormControl>
                  <Button
                    variant="outline"
                    onClick={() => copyText(apiKey.id, apiKey.key)}
                  >
                    {copiedKeyId === apiKey.id ? "Copied!" : "Copy"}
                  </Button>
                </FormItem>
              ))}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default APIKeysSection;
