/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { Button } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";
import { cn } from "@/lib/utils";
import useAPIKeys from "../../hooks/useApiKeys";
import Link from "next/link";
import { copyToClipboard } from "@/lib/copy";
import { useGlobalUIBoundedStore } from "@/store/ui";
import { useSettingBoundedStore } from "../../store/ui";
import SkeletonAPIKey from "../utils/SkeletonAPIKey";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { Badge } from "@/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { Input } from "@/ui/input";
import { Trash2, Loader2 } from "lucide-react";

export const APIKeys = () => {
  const {
    onSubmit,
    apiKeys,
    isDialogOpen,
    createdKey,
    closeDialog,
    deleteApiKey,
    deletingKeys,
  } = useAPIKeys();
  const copiedKeyId = useGlobalUIBoundedStore((state) => state.copiedKeyId);
  const isRequestingAPIKey = useSettingBoundedStore(
    (state) => state.isRequestingAPIKey,
  );

  const renderDate = (date: any) => {
    if (!date) return "-";
    if (typeof date === "string") return new Date(date).toLocaleString();
    if ("_seconds" in date) {
      const ms = date._seconds * 1000 + (date._nanoseconds || 0) / 1e6;
      return new Date(ms).toLocaleString();
    }
    if ("seconds" in date) {
      const ms = date.seconds * 1000 + (date.nanoseconds || 0) / 1e6;
      return new Date(ms).toLocaleString();
    }
    return "-";
  };

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
          </div>
        </div>

        {/* One-time API key dialog */}
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => !open && closeDialog()}
        >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Your API Key</DialogTitle>
              <DialogDescription>
                This is the only time the key will be shown. Copy it and store
                it securely.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Key ID</label>
                <div className="flex gap-2 mt-1">
                  <Input disabled value={createdKey?.id || ""} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">API Key (token)</label>
                <div className="flex gap-2 mt-1">
                  <Input disabled value={createdKey?.apiKey || ""} />
                  <Button
                    variant="outline"
                    onClick={() =>
                      copyToClipboard("api-key", createdKey?.apiKey)
                    }
                  >
                    {copiedKeyId === "api-key" ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button onClick={closeDialog}>I have copied it</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* List */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Existing Keys</h2>
          </div>

          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Expires At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys?.length ? (
                  apiKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell className="font-mono text-xs">
                        {key.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 flex-wrap">
                          {key.roles?.map((r) => (
                            <Badge
                              key={r}
                              variant="secondary"
                              className="px-2 py-0.5 text-xs"
                            >
                              {r}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{renderDate(key.createdAt)}</TableCell>
                      <TableCell>{renderDate(key.lastUsedAt)}</TableCell>
                      <TableCell>
                        {key.active ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="destructive">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell>{renderDate(key.expiresAt)}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteApiKey(key.id)}
                          disabled={deletingKeys.has(key.id)}
                        >
                          {deletingKeys.has(key.id) ? (
                            <span className="inline-flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2">
                              <Trash2 className="h-4 w-4" />
                            </span>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-sm text-muted-foreground"
                    >
                      No API keys yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Skeleton while requesting new key */}
          {isRequestingAPIKey && (
            <div className="mt-4">
              <SkeletonAPIKey />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
