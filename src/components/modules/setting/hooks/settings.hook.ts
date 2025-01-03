import { useThemeStore } from "@/store/themeStore/store";
import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { db } from "@/core/config/firebase/firebase";
import { ProfileForm } from "../profileSection";
import { PreferencesForm } from "../preferencesSection";

const useSettings = () => {
  const [currentTab, setCurrentTab] = useState("profile");
  const { theme, toggleTheme } = useThemeStore();

  const saveProfile = async (data: ProfileForm | PreferencesForm) => {
    try {
      const userDoc = doc(db, "users", data.identification || "default");
      await setDoc(userDoc, { ...data, theme });

      toast({
        title: "Success",
        description: "Profile and preferences saved successfully!",
      });
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { currentTab, setCurrentTab, saveProfile, theme, toggleTheme };
};

export default useSettings;
