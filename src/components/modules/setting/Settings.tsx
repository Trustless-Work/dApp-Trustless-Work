import Header from "@/components/layout/header/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import useSettings from "./hooks/settings.hook";
import { Profile } from "./ui/sections/Profile";
import { Appearance } from "./ui/sections/Appearance";
import { Preferences } from "./ui/sections/Preferences";
import { APIKeys } from "./ui/sections/APIKeys";
import SettingsSidebar from "./SettingsSidebar";
import useIsMobile from "@/hooks/mobile.hook";

const Settings = () => {
  const { currentTab, setCurrentTab, saveProfile, theme, toggleTheme } =
    useSettings();
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full relative">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <SettingsSidebar
            currentTab={currentTab}
            onTabChange={setCurrentTab}
            className="h-full w-64"
          />
        </div>

        <div className="flex flex-col flex-1 h-screen">
          <Header className="flex-none h-10" />

          {/* Mobile Sidebar Toggle */}
          {isMobile && (
            <div className="flex items-center gap-2 p-4 lg:hidden">
              <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            </div>
          )}

          {/* Mobile Sidebar Overlay */}
          {isMobile && (
            <SettingsSidebar
              currentTab={currentTab}
              onTabChange={setCurrentTab}
              className="lg:hidden"
            />
          )}

          {/* Content */}
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
