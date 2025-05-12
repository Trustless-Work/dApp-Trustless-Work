import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tab";
import MyContactsTable from "@/components/modules/contact/ui/tables/MyContactsTable";
import MyContactsCards from "@/components/modules/contact/ui/cards/MyContactsCard";
import { useState } from "react";

const MyContacts = () => {
  const [activeMode, setActiveMode] = useState<"table" | "cards">("table");

  return (
    <div className="flex gap-3 w-full h-full justify-between">
      <Tabs defaultValue="table" className="w-full">
        <div className="flex w-full justify-between items-center flex-col gap-16 md:gap-3">
          <TabsList className="grid w-full grid-cols-2 gap-4">
            <TabsTrigger onClick={() => setActiveMode("table")} value="table">
              Table View
            </TabsTrigger>
            <TabsTrigger onClick={() => setActiveMode("cards")} value="cards">
              Card View
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="table">
          {activeMode === "table" ? <MyContactsTable /> : null}
        </TabsContent>

        <TabsContent value="cards">
          {activeMode === "cards" ? <MyContactsCards /> : null}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyContacts;
