/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/core/config/firebase/firebase";
import { formSchema, IssueType } from "../schema/report-issue-schema";

export const useSendReportIssue = () => {
  const { toast } = useToast();

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
      const res = await addDoc(collection(db, "api issues"), {
        ...payload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      if (res.id) {
        form.reset();
        toast({
          title: "Success",
          description: "Issue reported successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "An error occurred",
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
