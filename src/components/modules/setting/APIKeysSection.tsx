"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import useAPIKeys from "./hooks/api-keys.hook";
import Link from "next/link";
import { useCopyUtils } from "@/utils/hook/copy.hook";
import { useGlobalAuthenticationStore } from "@/core/store/data";

const APIKeysSection = () => {
  const { onSubmit, showApiKey, toggleVisibility } = useAPIKeys();
  const { copyText, copiedKeyId } = useCopyUtils();
  const loggedUser = useGlobalAuthenticationStore((state) => state.loggedUser);

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
            <Button className="w-full" type="button" onClick={onSubmit}>
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

        <div className="flex flex-col gap-4 w-3/6 mt-5">
          {loggedUser?.apiKey?.map((apiKey, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex-grow">
                <Input type={showApiKey} disabled defaultValue={apiKey} />
              </div>
              <Button
                className="!mt-0"
                variant="outline"
                onClick={() => copyText(index.toString(), apiKey)}
              >
                {copiedKeyId === index.toString() ? "Copied!" : "Copy"}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default APIKeysSection;
