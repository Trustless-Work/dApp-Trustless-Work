import { useState } from "react";
import { UserPayload } from "@/types/user.entity";
import { useGlobalAuthenticationStore } from "@/store/data";
import { PreferencesForm } from "./usePreferencesSection";
import { useGlobalUIBoundedStore } from "@/store/ui";
import { toast } from "sonner";

const useSettings = () => {
  const [currentTab, setCurrentTab] = useState("profile");

  const theme = useGlobalUIBoundedStore((state) => state.theme);
  const toggleTheme = useGlobalUIBoundedStore((state) => state.toggleTheme);
  const updateUser = useGlobalAuthenticationStore((state) => state.updateUser);
  const address = useGlobalAuthenticationStore((state) => state.address);

  const saveProfile = async (data: UserPayload | PreferencesForm) => {
    try {
      const user = await updateUser(address, data as UserPayload);

      if (user) {
        toast.success("Profile and preferences saved successfully!");
      } else {
        toast.error("Failed to save preferences. Please try again.");
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Failed to save preferences. Please try again.");
    }
  };

  return { currentTab, setCurrentTab, saveProfile, theme, toggleTheme };
};

export default useSettings;
