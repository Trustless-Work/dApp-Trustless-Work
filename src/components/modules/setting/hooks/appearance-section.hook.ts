import { db } from "@/core/config/firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "sonner";

interface useAppearanceProps {
  theme: "light" | "dark";
}

const useAppearance = ({ theme }: useAppearanceProps) => {
  const handleSaveTheme = async () => {
    try {
      const userDoc = doc(db, "users", "appearance-settings");
      await setDoc(userDoc, { theme });

      toast.success(`Theme "${theme}" saved successfully!`);
    } catch (error) {
      console.error("Error saving theme:", error);
      toast.error("Failed to save theme. Please try again.");
    }
  };

  return { handleSaveTheme };
};

export default useAppearance;
