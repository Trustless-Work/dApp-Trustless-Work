"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import useAppearance from "../../hooks/appearance-section.hook";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AppearanceProps {
  theme: "light" | "dark";
  onThemeChange: (theme: "light" | "dark") => void;
}

export const Appearance = ({ theme, onThemeChange }: AppearanceProps) => {
  const { handleSaveTheme } = useAppearance({ theme });

  return (
    <Card className={cn("overflow-hidden")}>
      <CardContent className="p-6">
        <h1 className="text-3xl font-bold mb-4">Appearance</h1>
        <p className="text-gray-500 mb-4">
          Customize the appearance of the app. Automatically switch between day
          and night themes.
        </p>
        <h3>Theme</h3>
        <p className="text-gray-500 mb-4">
          Select the theme for the dashboard.
        </p>
        <div className="flex gap-4 mb-6">
          <div
            onClick={() => onThemeChange("light")}
            className={`p-6 rounded-lg cursor-pointer ${
              theme === "light" ? "border-blue-500" : "border-gray-300"
            } border bg-white`}
          >
            <Skeleton className="h-24 w-32 rounded-md" />
            <p className="text-center mt-2 text-black">Light</p>
          </div>
          <div
            onClick={() => onThemeChange("dark")}
            className={`p-6 rounded-lg cursor-pointer ${
              theme === "dark" ? "border-blue-500" : "border-gray-300"
            } border bg-gray-800`}
          >
            <Skeleton className="h-24 w-32 rounded-md bg-gray-700" />
            <p className="text-center mt-2 text-white">Dark</p>
          </div>
        </div>
        <Button
          onClick={handleSaveTheme}
          className="w-full md:w-1/6"
          type="button"
        >
          Update preferences
        </Button>
      </CardContent>
    </Card>
  );
};
