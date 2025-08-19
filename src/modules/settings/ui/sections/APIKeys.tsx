"use client";

import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";
import { cn } from "@/lib/utils";
import useAPIKeys from "../../hooks/useApiKeys";
import Link from "next/link";
import { copyToClipboard } from "@/lib/copy";
import { useGlobalUIBoundedStore } from "@/store/ui";
import { useGlobalAuthenticationStore } from "@/store/data";
import { Trash2, Loader2 } from "lucide-react";
import { useSettingBoundedStore } from "../../store/ui";
import SkeletonAPIKey from "../utils/SkeletonAPIKey";

export const APIKeys = () => {
  const {
    onSubmit,
    showApiKey,
    toggleVisibility,
    handleRemoveAPiKey,
    deletingKeys,
  } = useAPIKeys();
  const copiedKeyId = useGlobalUIBoundedStore((state) => state.copiedKeyId);
  const loggedUser = useGlobalAuthenticationStore((state) => state.loggedUser);
  const isRequestingAPIKey = useSettingBoundedStore(
    (state) => state.isRequestingAPIKey,
  );

  return (
    <Card className={cn("overflow-hidden")}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
          <div className="flex flex-col flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              Your API Keys
            </h1>
            <p className="text-gray-500 mb-4 text-sm sm:text-base">
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

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto lg:w-48">
            <Button
              className="w-full sm:w-auto lg:w-full"
              type="button"
              onClick={onSubmit}
            >
              Request an API Key
            </Button>
            <Button
              className="w-full sm:w-auto lg:w-full"
              onClick={toggleVisibility}
              variant="outline"
            >
              Show API Key's
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full lg:w-2/3 mt-6">
          {loggedUser?.apiKey?.map((apiKey, index) => {
            const isDeleting = deletingKeys.has(apiKey);

            return (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
              >
                <div className="flex-grow min-w-0">
                  <Input
                    type={showApiKey}
                    disabled
                    defaultValue={apiKey}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2 sm:gap-3">
                  <Button
                    className="flex-1 sm:flex-none"
                    variant="outline"
                    onClick={() => copyToClipboard(index.toString(), apiKey)}
                    disabled={isDeleting}
                  >
                    {copiedKeyId === index.toString() ? "Copied!" : "Copy"}
                  </Button>
                  <Button
                    onClick={() => handleRemoveAPiKey(apiKey)}
                    variant="destructive"
                    disabled={isDeleting}
                    className="flex-1 sm:flex-none"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </Button>
                </div>
              </div>
            );
          })}

          {/* Skeleton */}
          {isRequestingAPIKey && <SkeletonAPIKey />}
        </div>
      </CardContent>
    </Card>
  );
};
