"use client";

import { AppearanceSection } from "@/components/setting/appearanceSection";
import { ProfileSection } from "@/components/setting/profileSection";
import { SettingsSidebar } from "@/components/setting/settingsSidebar";
import { useState } from "react";
import { db } from "@/constants/firebase";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { useThemeStore } from "@/store/themeStore/store";
import Header from "@/components/header/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { PreferencesSection } from "@/components/setting/preferences";

export default function SettingsPage() {
  const [currentTab, setCurrentTab] = useState("profile");
  const { theme, toggleTheme } = useThemeStore();

  const saveProfile = async (data: any) => {
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

  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen w-full">
        <Header />
        <div className="flex h-screen">
          <SettingsSidebar
            currentTab={currentTab}
            onTabChange={setCurrentTab}
          />

          <div className="flex-1 flex flex-col">
            <main className="flex-1 p-8">
              {currentTab === "profile" && (
                <ProfileSection onSave={saveProfile} walletAddress={""} />
              )}
              {currentTab === "appearance" && (
                <AppearanceSection theme={theme} onThemeChange={toggleTheme} />
              )}
              {currentTab === "preferences" && (
                <PreferencesSection onSave={saveProfile} />
              )}
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
