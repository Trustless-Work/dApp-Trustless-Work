import Header from "@/components/layout/header/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import SettingsSidebar from "./Sidebar";
import ProfileSection from "./ProfileSection";
import AppearanceSection from "./AppearanceSection";
import PreferencesSection from "./PreferencesSection";
import useSettings from "./hooks/settings.hook";

const Settings = () => {
  const { currentTab, setCurrentTab, saveProfile, theme, toggleTheme } =
    useSettings();

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
};

export default Settings;
