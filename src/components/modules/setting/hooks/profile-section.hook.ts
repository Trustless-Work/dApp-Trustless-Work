import { UserPayload } from "@/@types/user.entity";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useForm } from "react-hook-form";
import { firebaseStorage } from "../../../../../firebase";
import { v4 } from "uuid";
import { toast } from "@/hooks/use-toast";

interface useProfileProps {
  onSave: (data: UserPayload) => void;
}

const useProfile = ({ onSave }: useProfileProps) => {
  const loggedUser = useGlobalAuthenticationStore((state) => state.loggedUser);
  const address = useGlobalAuthenticationStore((state) => state.address);
  const updateUser = useGlobalAuthenticationStore((state) => state.updateUser);

  const form = useForm({
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
  });

  const onSubmit = (data: UserPayload) => {
    onSave(data);
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

  return { form, onSubmit, handleProfileImageUpload };
};

export default useProfile;
