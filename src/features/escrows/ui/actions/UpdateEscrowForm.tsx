"use client";

import type { Path, UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CREATE_ESCROW_PLACEHOLDERS } from "@/features/escrows/constants/create-escrow.constants";
import type { UpdateEscrowFormData } from "@/features/escrows/schemas/escrow-action.schemas";
import { EscrowRoleAddressList } from "@/features/escrows/ui/EscrowRoleAddressList";

type UpdateEscrowFormProps = {
  form: UseFormReturn<UpdateEscrowFormData>;
  isMulti: boolean;
};

const ROLE_ARRAY_FIELDS = [
  {
    key: "roles.approvers",
    label: "Approvers",
    description: "1-5 distinct addresses that approve milestones.",
  },
  {
    key: "roles.serviceProviders",
    label: "Service Providers",
    description: "1-5 distinct addresses that update milestone status.",
  },
  {
    key: "roles.releaseSigners",
    label: "Release Signers",
    description: "1-5 distinct addresses authorized to release funds.",
  },
  {
    key: "roles.disputeResolvers",
    label: "Dispute Resolvers",
    description: "1-5 distinct addresses that resolve disputes.",
  },
] as const;

export const UpdateEscrowForm = ({ form, isMulti }: UpdateEscrowFormProps) => {
  return (
    <div className="flex max-h-[60vh] flex-col gap-5 overflow-y-auto pr-1">
      <section className="flex flex-col gap-4">
        <p className="text-sm font-semibold tracking-tight">General</p>

        <FormField
          control={form.control}
          name="engagementId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Engagement ID</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={CREATE_ESCROW_PLACEHOLDERS.engagementId}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={CREATE_ESCROW_PLACEHOLDERS.title}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={3}
                  placeholder={CREATE_ESCROW_PLACEHOLDERS.description}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {!isMulti ? (
          <FormField
            control={form.control}
            name={"amount" as Path<UpdateEscrowFormData>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step="any"
                    placeholder={CREATE_ESCROW_PLACEHOLDERS.amount}
                    value={
                      typeof field.value === "number" ? field.value : ""
                    }
                    onChange={(event) =>
                      field.onChange(
                        event.target.value === ""
                          ? ""
                          : Number(event.target.value),
                      )
                    }
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

        <FormField
          control={form.control}
          name="platformFee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Platform Fee (%)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step="any"
                  placeholder={CREATE_ESCROW_PLACEHOLDERS.platformFee}
                  value={typeof field.value === "number" ? field.value : ""}
                  onChange={(event) =>
                    field.onChange(
                      event.target.value === ""
                        ? ""
                        : Number(event.target.value),
                    )
                  }
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="trustline.address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trustline (SAC contract id)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={
                    CREATE_ESCROW_PLACEHOLDERS.trustlineCustomAddress
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="trustline.symbol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asset symbol</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={CREATE_ESCROW_PLACEHOLDERS.trustlineSymbol}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </section>

      <section className="flex flex-col gap-4">
        <p className="text-sm font-semibold tracking-tight">Roles</p>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {ROLE_ARRAY_FIELDS.map((role) => (
            <EscrowRoleAddressList
              key={role.key}
              form={form}
              name={role.key as Path<UpdateEscrowFormData>}
              label={role.label}
              description={role.description}
            />
          ))}

          {!isMulti ? (
            <FormField
              control={form.control}
              name={"roles.receiver" as Path<UpdateEscrowFormData>}
              render={({ field }) => (
                <FormItem className="rounded-xl border border-border p-3 md:p-4">
                  <FormLabel>Receiver</FormLabel>
                  <FormDescription>
                    Single beneficiary for the full release.
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      value={
                        typeof field.value === "string" ? field.value : ""
                      }
                      placeholder={CREATE_ESCROW_PLACEHOLDERS.stellarAddress}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}

          <FormField
            control={form.control}
            name="roles.platform"
            render={({ field }) => (
              <FormItem className="rounded-xl border border-border p-3 md:p-4">
                <FormLabel>Platform</FormLabel>
                <FormDescription>
                  Immutable after creation.
                </FormDescription>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="roles.admin"
            render={({ field }) => (
              <FormItem className="rounded-xl border border-border p-3 md:p-4">
                <FormLabel>Admin</FormLabel>
                <FormDescription>
                  Immutable after creation.
                </FormDescription>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </section>
    </div>
  );
};
