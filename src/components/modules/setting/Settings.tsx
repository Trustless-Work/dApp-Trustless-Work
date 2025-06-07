import Header from "@/components/layout/header/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import SettingsNavigationMenu from "./SettingsNavigationMenu";
import useSettings from "./hooks/settings.hook";
import { Profile } from "./ui/sections/Profile";
import { Appearance } from "./ui/sections/Appearance";
import { Preferences } from "./ui/sections/Preferences";
import { APIKeys } from "./ui/sections/APIKeys";

const Settings = () => {
  const { currentTab, setCurrentTab, saveProfile, theme, toggleTheme } =
    useSettings();

  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen w-full">
        <Header />
        <div className="flex flex-col lg:flex-row h-screen">
          <SettingsNavigationMenu
            currentTab={currentTab}
            onTabChange={setCurrentTab}
            className="lg:w-1/6 w-full h-1/4 lg:h-full"
          />

          <div className="flex-1 flex flex-col h-auto lg:h-3/4">
            <main className="flex-1 p-8">
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
