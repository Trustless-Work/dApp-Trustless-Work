import Header from "@/shared/Header";
import { SidebarProvider } from "@/ui/sidebar";
import useIsMobile from "@/hooks/useMobile";
import { useTranslation } from "react-i18next";
import { SettingsSidebar } from "../SettingsSidebar";
import { Profile } from "../sections/Profile";
import { Preferences } from "../sections/Preferences";
import { APIKeys } from "../sections/APIKeys";
import useSettings from "../../hooks/useSettings";
import { useSearchParams } from "next/navigation";

export const Settings = () => {
  const searchParams = useSearchParams();
  const isProd = process.env.NEXT_PUBLIC_ENV === "PROD";
  const requestedTab = searchParams.get("tab") || undefined;
  const allowedTabs = [
    "profile",
    "preferences",
    ...(isProd ? ["api-keys"] : []),
  ];
  const initialTab = allowedTabs.includes(requestedTab || "")
    ? requestedTab
    : undefined;

  const { currentTab, setCurrentTab, saveProfile } = useSettings(initialTab);
  const isMobile = useIsMobile();
  const { t } = useTranslation();

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
              <h1 className="text-3xl font-bold tracking-tight">
                {t("settings.title")}
              </h1>
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
              {currentTab === "preferences" && (
                <Preferences onSave={saveProfile} />
              )}
              {isProd && currentTab === "api-keys" && <APIKeys />}
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};
