import { UserPayload } from "@/@types/user.entity";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { useForm } from "react-hook-form";
import { firebaseStorage } from "../../../../../firebase";
import { v4 } from "uuid";
import { toast } from "@/hooks/toast.hook";
import formSchema from "../schema/profile.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface useProfileProps {
  onSave: (data: UserPayload) => void;
}

const useProfile = ({ onSave }: useProfileProps) => {
  const loggedUser = useGlobalAuthenticationStore((state) => state.loggedUser);
  const address = useGlobalAuthenticationStore((state) => state.address);
  const updateUser = useGlobalAuthenticationStore((state) => state.updateUser);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identification: loggedUser?.identification || "",
      firstName: loggedUser?.firstName || "",
      lastName: loggedUser?.lastName || "",
      email: loggedUser?.email || "",
      phone: loggedUser?.phone || "",
      country: loggedUser?.country || "",
      useCase: loggedUser?.useCase || "",
      profileImage: loggedUser?.profileImage || "",
    },
    mode: "onChange",
  });

  const onSubmit = (data: UserPayload) => {
    onSave({ ...data, profileImage: form.getValues("profileImage") });
  };

  const handleProfileImageUpload = async (file: File) => {
    try {
      const allowedExtensions = ["jpg", "jpeg", "png", "webp", "svg"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        toast({
          title: "Invalid file type",
          description: `Only ${allowedExtensions.join(", ")} files are allowed.`,
          variant: "destructive",
        });
        return;
      }

      const storageRef = ref(firebaseStorage, `users/${v4()}.${fileExtension}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      await updateUser(address, { ...loggedUser, profileImage: url });
      form.setValue("profileImage", url, { shouldDirty: true });

      toast({
        title: "Success",
        description: "Profile photo updated successfully.",
      });
    } catch (error) {
      console.error("Error saving photo:", error);
      toast({
        title: "Error",
        description: "Failed to save photo. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleProfileImageDelete = async () => {
    try {
      if (!loggedUser?.profileImage) {
        toast({
          title: "No image found",
          description: "No profile image to delete.",
          variant: "destructive",
        });
        return;
      }

      const storageRef = ref(firebaseStorage, loggedUser.profileImage);
      await deleteObject(storageRef);
      await updateUser(address, { ...loggedUser, profileImage: "" });
      form.setValue("profileImage", "", { shouldDirty: true });

      toast({
        title: "Success",
        description: "Profile photo deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast({
        title: "Error",
        description: "Failed to delete photo. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { form, onSubmit, handleProfileImageUpload, handleProfileImageDelete };
};

export default useProfile;
