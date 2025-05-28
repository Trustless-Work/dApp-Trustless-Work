import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tab";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MyContactsTable from "@/components/modules/contact/ui/tables/MyContactsTable";
import MyContactsCards from "@/components/modules/contact/ui/cards/MyContactsCards";
import MyContactsFilter from "@/components/modules/contact/ui/filters/MyContactsFilter";
import { useState } from "react";
import { useContactUIBoundedStore } from "@/components/modules/contact/store/ui";
import { useGlobalUIBoundedStore } from "@/core/store/ui";
import Loader from "@/components/utils/ui/Loader";
import TooltipInfo from "@/components/utils/ui/Tooltip";
import { CircleHelp } from "lucide-react";
import Joyride from "react-joyride";

const MyContacts = () => {
  const isLoading = useGlobalUIBoundedStore((state) => state.isLoading);
  const setActiveTab = useContactUIBoundedStore((state) => state.setActiveTab);
  const setActiveMode = useContactUIBoundedStore(
    (state) => state.setActiveMode,
  );
  const activeMode = useContactUIBoundedStore((state) => state.activeMode);
  const activeTab = useContactUIBoundedStore((state) => state.activeTab);
  const theme = useGlobalUIBoundedStore((state) => state.theme);
  const [run, setRun] = useState(false);

  const allTabs = [
    "issuer",
    "approver",
    "service-provider",
    "dispute-resolver",
    "release-signer",
    "platform-address",
    "receiver",
  ];

  const steps = [
    {
      target: "#step-1",
      content: "Select the type of contact you want to view",
      disableBeacon: true,
    },
    {
      target: "#step-2",
      content: "Create a new contact",
      disableBeacon: true,
    },
  ];

  return (
    <>
      {isLoading ? (
        <Loader isLoading={isLoading} />
      ) : (
        <>
          <Joyride
            run={run}
            steps={steps}
            continuous
            showSkipButton
            hideCloseButton
            callback={(data) => {
              const { status } = data;
              if (status === "skipped" || status === "finished") {
                setRun(false);
              }
            }}
            disableOverlayClose
            styles={{
              options:
                theme === "dark"
                  ? {
                      backgroundColor: "#19191B",
                      overlayColor: "rgba(0, 0, 0, 0.80)",
                      primaryColor: "#006BE4",
                      textColor: "#FFF",
                      width: 500,
                      zIndex: 1000,
                    }
                  : {
                      backgroundColor: "#FFFFFF",
                      overlayColor: "rgba(0, 0, 0, 0.60)",
                      primaryColor: "#006BE4",
                      textColor: "#000",
                      width: 500,
                      zIndex: 1000,
                    },
            }}
          />

          <div className="flex gap-3 w-full h-full justify-between">
            <Tabs defaultValue={activeTab} className="w-full">
              <div className="flex w-full justify-between items-center flex-col 2xl:flex-row gap-16 md:gap-3">
                <TabsList
                  className="grid w-full grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-7 gap-4"
                  id="step-1"
                >
                  {allTabs.map((tab) => (
                    <TabsTrigger
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      value={tab}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <div className="flex items-center gap-2 mt-20 sm:mt-10 xl:mt-10 2xl:mt-0">
                  <Select
                    value={activeMode}
                    onValueChange={(value) =>
                      setActiveMode(value as "table" | "cards")
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select view" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="table">Table</SelectItem>
                      <SelectItem value="cards">Cards</SelectItem>
                    </SelectContent>
                  </Select>

                  <TooltipInfo content="Help">
                    <button
                      className="btn-dark"
                      type="button"
                      onClick={() => setRun(true)}
                    >
                      <CircleHelp size={29} />
                    </button>
                  </TooltipInfo>
                </div>
              </div>

              <TabsContent value={activeTab} className="flex flex-col gap-3">
                <Card className={cn("overflow-hidden")}>
                  <CardContent className="p-6">
                    <MyContactsFilter />
                  </CardContent>
                </Card>
                {activeMode === "table" ? (
                  <Card className={cn("overflow-hidden")}>
                    <CardContent className="p-6">
                      <MyContactsTable type={activeTab} />
                    </CardContent>
                  </Card>
                ) : (
                  <Card className={cn("overflow-hidden")}>
                    <CardContent className="p-6">
                      <MyContactsCards type={activeTab} />
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </>
  );
};

export default MyContacts;
