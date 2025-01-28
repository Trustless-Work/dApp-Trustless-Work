/* eslint-disable @typescript-eslint/no-explicit-any */

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../schema/report-issue-schema";
import { addReportIssue } from "../server/report-issue.firebase";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import { toast } from "@/hooks/use-toast";
import { IssueType } from "@/@types/issue.entity";

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
  });

  const onSubmit = async (payload: z.infer<typeof formSchema>) => {
    try {
      const res = await addReportIssue({ payload, address });

      if (res.success) {
        form.reset();
        toast({
          title: "Success",
          description: res.message,
        });
      } else {
        toast({
          title: "Error",
          description: res.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : "An error occurred";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return { form, onSubmit, typeOptions };
};
