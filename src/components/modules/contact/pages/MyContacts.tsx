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
import { useState } from "react";

const MyContacts = () => {
  const [activeTab, setActiveTab] = useState<string>("issuer");
  const [activeMode, setActiveMode] = useState<"table" | "cards">("table");

  const allTabs = [
    "issuer",
    "approver",
    "service-provider",
    "dispute-resolver",
    "release-signer",
    "platform-address",
    "receiver",
  ];

  return (
    <div className="flex gap-3 w-full h-full justify-between">
      <Tabs defaultValue="issuer" className="w-full">
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
          </div>
        </div>

        <TabsContent value={activeTab} className="flex flex-col gap-3">
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
  );
};

export default MyContacts;
