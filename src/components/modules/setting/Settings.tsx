import Header from "@/components/layout/header/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import SettingsSidebar from "./Sidebar";
import useSettings from "./hooks/settings.hook";
import APIKeysSection from "./ui/sections/APIKeys";
import ProfileSection from "./ui/sections/Profile";
import AppearanceSection from "./ui/sections/Appearance";
import PreferencesSection from "./ui/sections/Preferences";

const Settings = () => {
  const { currentTab, setCurrentTab, saveProfile, theme, toggleTheme } =
    useSettings();

  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen w-full">
        <Header />
        <div className="flex flex-col lg:flex-row h-screen">
          <SettingsSidebar
            currentTab={currentTab}
            onTabChange={setCurrentTab}
            className="lg:w-1/6 w-full h-1/4 lg:h-full"
          />

          <div className="flex-1 flex flex-col h-auto lg:h-3/4">
            <main className="flex-1 p-8">
              {currentTab === "profile" && (
                <ProfileSection onSave={saveProfile} />
              )}
              {currentTab === "appearance" && (
                <AppearanceSection theme={theme} onThemeChange={toggleTheme} />
              )}
              {currentTab === "preferences" && (
                <PreferencesSection onSave={saveProfile} />
              )}
              {currentTab === "api-keys" && <APIKeysSection />}
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
