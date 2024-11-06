import { MdOutlineLightMode } from "react-icons/md";
import { LuMoonStar } from "react-icons/lu";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button onClick={toggleTheme}>
      {theme === "dark" ? (
        <MdOutlineLightMode className="text-yellow-700" size={30} />
      ) : (
        <LuMoonStar className="text-gray-700" size={30} />
      )}
    </button>
  );
}
