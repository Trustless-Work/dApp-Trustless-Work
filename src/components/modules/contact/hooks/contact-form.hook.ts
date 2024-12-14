import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  type: z.enum(["company", "individual"], { required_error: "Please select a type" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
})

type FormValues = z.infer<typeof formSchema>

export const useContactForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      type: undefined,
      description: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)
    try {
      // Mock API call for email uniqueness check and Firebase insertion
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simulating a successful response
      toast({
        title: "Success",
        description: "Your escrow has been funded successfully.",
      })
      form.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while processing your request.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return { form, isLoading, onSubmit }
}

