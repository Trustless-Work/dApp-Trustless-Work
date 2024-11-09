import { getEngagement } from "@/services/escrow/getEngagement";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  contractId: z.string().min(1, {
    message: "Engagement must be at least 5 characters.",
  }),
  engagementId: z.string().min(1, {
    message: "Engagement must be at least 5 characters.",
  }),
});

export const useGetEngagementEscrowHook = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contractId: "",
      engagementId: "",
    },
  });

  const onSubmit = async (payload: z.infer<typeof formSchema>) => {
    const data = { ...payload };
    await getEngagement(data);
  };

  return { form, onSubmit };
};
