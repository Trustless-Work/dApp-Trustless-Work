import { useToast } from "@/hooks/use-toast";
import { fundEscrow } from "@/services/escrow/fundEscrow";
import { useLoaderStore } from "@/store/utilsStore";
import { useWalletStore } from "@/store/walletStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  contractId: z.string().min(1, {
    message: "Engagement must be at least 5 characters.",
  }),
  engagementId: z.string().min(1, {
    message: "Engagement must be at least 1 characters.",
  }),
});

export const useFundEscrowHook = () => {
  const { address } = useWalletStore();
  const { toast } = useToast();
  const setIsLoading = useLoaderStore((state) => state.setIsLoading);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contractId: "",
      engagementId: "",
    },
  });

  const onSubmit = async (payload: z.infer<typeof formSchema>) => {
    const payloadSubmit = { ...payload, signer: address };

    setIsLoading(true);

    try {
      const { data } = await fundEscrow(payloadSubmit);

      if (data.status === "SUCCESS" || data.status === 201) {
        form.reset();
        setIsLoading(false);
        toast({
          title: "Success",
          description: data.message,
        });
      } else {
        setIsLoading(false);
        toast({
          title: "Error",
          description: data.message || "An error occurred",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      setIsLoading(false);
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

  return { form, onSubmit };
};
