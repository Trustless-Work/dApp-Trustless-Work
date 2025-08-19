import { z } from "zod";

export const getFormSchema = () => {
  return z.object({
    approverFunds: z
      .union([z.string(), z.number()])
      .refine(
        (val) => {
          if (typeof val === "string") {
            if (val === "" || val === "." || val.endsWith(".")) {
              return true; // Allow partial input
            }
            const numVal = Number(val);
            return !isNaN(numVal) && numVal >= 0;
          }
          return val >= 0;
        },
        {
          message: "Approver funds must be 0 or greater.",
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
          message: "Approver funds can have a maximum of 2 decimal places.",
        },
      ),
    receiverFunds: z
      .union([z.string(), z.number()])
      .refine(
        (val) => {
          if (typeof val === "string") {
            if (val === "" || val === "." || val.endsWith(".")) {
              return true; // Allow partial input
            }
            const numVal = Number(val);
            return !isNaN(numVal) && numVal >= 0;
          }
          return val >= 0;
        },
        {
          message: "Receiver funds must be 0 or greater.",
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
          message: "Receiver funds can have a maximum of 2 decimal places.",
        },
      ),
  });
};
