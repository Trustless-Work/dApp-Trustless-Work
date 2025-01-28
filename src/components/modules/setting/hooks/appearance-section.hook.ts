import { db } from "@/core/config/firebase/firebase";
import { toast } from "@/hooks/toast.hook";
import { doc, setDoc } from "firebase/firestore";

interface useAppearanceProps {
  theme: "light" | "dark";
}

const useAppearance = ({ theme }: useAppearanceProps) => {
  const handleSaveTheme = async () => {
    try {
      const userDoc = doc(db, "users", "appearance-settings");
      await setDoc(userDoc, { theme });

      toast({
        title: "Success",
        description: `Theme "${theme}" saved successfully!`,
      });
    } catch (error) {
      console.error("Error saving theme:", error);
      toast({
        title: "Error",
        description: "Failed to save theme. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { handleSaveTheme };
};

export default useAppearance;
