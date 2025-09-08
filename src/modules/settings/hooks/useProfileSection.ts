import { UserPayload } from "@/types/user.entity";
import { useGlobalAuthenticationStore } from "@/store/data";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { useForm } from "react-hook-form";
import { firebaseStorage } from "../../../../firebase";
import { v4 } from "uuid";
import formSchema from "../schema/profile.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";

interface useProfileProps {
  onSave: (data: UserPayload) => Promise<void> | void;
}

const useProfile = ({ onSave }: useProfileProps) => {
  const loggedUser = useGlobalAuthenticationStore((state) => state.loggedUser);
  const address = useGlobalAuthenticationStore((state) => state.address);
  const updateUser = useGlobalAuthenticationStore((state) => state.updateUser);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

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

  const onSubmit = async (data: UserPayload) => {
    await Promise.resolve(
      onSave({ ...data, profileImage: loggedUser?.profileImage || "" }),
    );
  };

  const handleProfileImageUpload = async (file: File) => {
    try {
      setIsUploadingImage(true);
      const allowedExtensions = ["jpg", "jpeg", "png", "webp", "svg"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        toast.error(`Only ${allowedExtensions.join(", ")} files are allowed.`);
        return;
      }

      const storageRef = ref(firebaseStorage, `users/${v4()}.${fileExtension}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      await updateUser(address, { ...loggedUser, profileImage: url });
      form.setValue("profileImage", url, { shouldDirty: true });

      toast.success("Profile photo updated successfully.");
    } catch (error) {
      console.error("Error saving photo:", error);
      toast.error("Failed to save photo. Please try again.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleProfileImageDelete = async () => {
    try {
      if (!loggedUser?.profileImage) {
        toast.error("No profile image to delete.");
        return;
      }

      const storageRef = ref(firebaseStorage, loggedUser.profileImage);
      await deleteObject(storageRef);
      await updateUser(address, { ...loggedUser, profileImage: "" });
      form.setValue("profileImage", "", { shouldDirty: true });

      toast.success("Profile photo deleted successfully.");
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast.error("Failed to delete photo. Please try again.");
    }
  };

  return {
    form,
    onSubmit,
    handleProfileImageUpload,
    handleProfileImageDelete,
    isUploadingImage,
  };
};

export default useProfile;
