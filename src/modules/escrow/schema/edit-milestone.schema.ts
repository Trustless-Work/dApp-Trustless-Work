import { z } from "zod";

export const formSchemaSingle = z.object({
  milestones: z
    .array(
      z.object({
        description: z.string().min(1, {
          message: "Milestone description is required.",
        }),
        status: z.string(),
        evidence: z.string().optional(),
        approved: z.boolean().optional(),
      }),
    )
    .min(1, { message: "At least one milestone is required." }),
});

export const formSchemaMulti = z.object({
  milestones: z
    .array(
      z.object({
        description: z.string().min(1, {
          message: "Milestone description is required.",
        }),
        status: z.string(),
        amount: z
          .union([z.string(), z.number()])
          .refine(
            (val) => {
              // Allow partial input like "0." or "0.5"
              if (typeof val === "string") {
                if (val === "" || val === "." || val.endsWith(".")) {
                  return true; // Allow partial input
                }
                const numVal = Number(val);
                return !isNaN(numVal) && numVal > 0;
              }
              return val > 0;
            },
            {
              message: "Milestone amount must be greater than 0.",
            },
          )
          .refine(
            (val) => {
              if (typeof val === "string") {
                if (val === "" || val === "." || val.endsWith(".")) {
                  return true; // Allow partial input
                }
                const numVal = Number(val);
                if (isNaN(numVal)) return false;
                const decimalPlaces = (numVal.toString().split(".")[1] || "")
                  .length;
                return decimalPlaces <= 2;
              }
              const decimalPlaces = (val.toString().split(".")[1] || "").length;
              return decimalPlaces <= 2;
            },
            {
              message:
                "Milestone amount can have a maximum of 2 decimal places.",
            },
          ),
        evidence: z.string().optional(),
        flags: z
          .object({
            approved: z.boolean().optional(),
            disputed: z.boolean().optional(),
            released: z.boolean().optional(),
            resolved: z.boolean().optional(),
          })
          .optional(),
      }),
    )
    .min(1, { message: "At least one milestone is required." }),
});
