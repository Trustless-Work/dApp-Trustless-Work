import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
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
import { useContact } from "@/components/modules/contact/hooks/contact.hook";
import { useContactUIBoundedStore } from "@/components/modules/contact/store/ui";
import Loader from "@/components/utils/ui/Loader";
import TooltipInfo from "@/components/utils/ui/Tooltip";
import { CircleHelp } from "lucide-react";
import Joyride from "react-joyride";
import { useMemo } from "react";

const MyContacts = () => {
  const {
    contacts,
    isLoading,
    activeMode,
    setActiveMode,
    run,
    setRun,
    steps,
    theme,
  } = useContact();
  const { filters } = useContactUIBoundedStore();

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const matchesName =
        filters.name === "" ||
        contact.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchesEmail =
        filters.email === "" ||
        contact.email.toLowerCase().includes(filters.email.toLowerCase());
      const matchesWalletType =
        !filters.walletType || contact.walletType === filters.walletType;

      return matchesName && matchesEmail && matchesWalletType;
    });
  }, [contacts, filters]);

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
            <div className="w-full">
              <div className="flex w-full justify-end items-center gap-2 mb-4">
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

              <div className="flex flex-col gap-3">
                <Card className={cn("overflow-hidden")}>
                  <CardContent className="p-6">
                    <MyContactsFilter />
                  </CardContent>
                </Card>
                {activeMode === "table" ? (
                  <Card className={cn("overflow-hidden")}>
                    <CardContent className="p-6">
                      <MyContactsTable contacts={filteredContacts} />
                    </CardContent>
                  </Card>
                ) : (
                  <Card className={cn("overflow-hidden")}>
                    <CardContent className="p-6">
                      <MyContactsCards contacts={filteredContacts} />
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MyContacts;
