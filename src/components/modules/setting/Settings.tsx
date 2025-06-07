import Header from "@/components/layout/header/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import useSettings from "./hooks/settings.hook";
import { Profile } from "./ui/sections/Profile";
import { Appearance } from "./ui/sections/Appearance";
import { Preferences } from "./ui/sections/Preferences";
import { APIKeys } from "./ui/sections/APIKeys";
import SettingsSidebar from "./SettingsSidebar";

const Settings = () => {
  const { currentTab, setCurrentTab, saveProfile, theme, toggleTheme } =
    useSettings();

  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen w-full">
        <Header />
        <div className="flex flex-col h-full">
          <SettingsSidebar
            currentTab={currentTab}
            onTabChange={setCurrentTab}
            className="flex-shrink-0 mx-4 mt-4"
          />
          <div className="flex-1 overflow-auto">
            <main className="p-8">
              {currentTab === "profile" && <Profile onSave={saveProfile} />}
              {currentTab === "appearance" && (
                <Appearance theme={theme} onThemeChange={toggleTheme} />
              )}
              {currentTab === "preferences" && (
                <Preferences onSave={saveProfile} />
              )}
              {currentTab === "api-keys" && <APIKeys />}
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
