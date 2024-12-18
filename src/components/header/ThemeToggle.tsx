import { MdOutlineLightMode } from "react-icons/md";
import { LuMoonStar } from "react-icons/lu";
import { useEffect } from "react";
import { useThemeStore } from "@/store/themeStore/store";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <button onClick={() => toggleTheme()}>
      {theme === "dark" ? (
        <MdOutlineLightMode className="text-yellow-700" size={30} />
      ) : (
        <LuMoonStar className="text-gray-700" size={30} />
      )}
    </button>
  );
}
