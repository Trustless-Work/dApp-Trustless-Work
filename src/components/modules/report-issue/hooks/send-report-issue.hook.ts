/* eslint-disable @typescript-eslint/no-explicit-any */

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../schema/report-issue.schema";
import { addReportIssue } from "../server/report-issue.firebase";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import { IssueType } from "@/@types/issue.entity";
import { toast } from "sonner";

export const useSendReportIssue = () => {
  const { address } = useGlobalAuthenticationStore();

  const typeOptions = Object.values(IssueType).map((value) => ({
    value,
    label: value,
  }));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      description: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (payload: z.infer<typeof formSchema>) => {
    try {
      const res = await addReportIssue({ payload, address });

      if (res.success) {
        form.reset();
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    }
  };

  return { form, onSubmit, typeOptions };
};
