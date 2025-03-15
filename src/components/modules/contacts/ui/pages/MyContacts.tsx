"use client";

import Loader from "@/components/utils/ui/Loader";
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
import { useGlobalUIBoundedStore } from "@/core/store/ui";
import { useContactBoundedStore } from "@/components/modules/contacts/store/ui";
import MyContactsTable from "@/components/modules/contacts/ui/tables/MyContactTable";
import MyContactsCards from "@/components/modules/contacts/ui/cards/MyContactsCards";
import MyContactsFilter from "@/components/modules/contacts/ui/filters/MyContactsFilter";
import useMyContacts from "@/components/modules/contacts/hooks/my-contacts.hook";
import { ContactCategory } from "@/@types/contact.entity";

const ContactsDashboard = () => {
  const isLoading = useGlobalUIBoundedStore((state) => state.isLoading);
  const setActiveTab = useContactBoundedStore((state) => state.setActiveTab);
  const setActiveMode = useContactBoundedStore((state) => state.setActiveMode);
  const activeMode = useContactBoundedStore((state) => state.activeMode);
  const activeTab = useContactBoundedStore(
    (state) => state.activeTab as ContactCategory,
  );

  const { currentData, isLoading: contactsLoading } = useMyContacts({
    type: activeTab,
  });

  const filteredContacts =
    currentData?.filter((contact) => contact.status === true) || [];

  return (
    <>
      {isLoading || contactsLoading ? (
        <Loader isLoading={isLoading || contactsLoading} />
      ) : (
        <div className="flex gap-3 w-full h-full justify-between">
          <Tabs defaultValue={activeTab} className="w-full">
            <div className="flex w-full justify-between items-center flex-col 2xl:flex-row gap-16 md:gap-3">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
                <TabsTrigger
                  onClick={() => setActiveTab("personal")}
                  value="personal"
                >
                  Personal
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => setActiveTab("favorites")}
                  value="favorites"
                >
                  Favorites
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2 mt-10 sm:mt-10 xl:mt-10 2xl:mt-0">
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

            <TabsContent value="personal" className="flex flex-col gap-3">
              <Card className={cn("overflow-hidden")}>
                <CardContent className="p-6">
                  <MyContactsFilter />
                </CardContent>
              </Card>
              {activeMode === "table" ? (
                <Card className={cn("overflow-hidden")}>
                  <MyContactsTable
                    type="personal"
                    contacts={filteredContacts}
                  />
                </Card>
              ) : (
                <MyContactsCards type="personal" contacts={filteredContacts} />
              )}
            </TabsContent>

            <TabsContent value="favorites" className="flex flex-col gap-3">
              <Card className={cn("overflow-hidden")}>
                <CardContent className="p-6">
                  <MyContactsFilter />
                </CardContent>
              </Card>
              {activeMode === "table" ? (
                <Card className={cn("overflow-hidden")}>
                  <MyContactsTable
                    type="favorites"
                    contacts={filteredContacts}
                  />
                </Card>
              ) : (
                <MyContactsCards type="favorites" contacts={filteredContacts} />
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
};

export default ContactsDashboard;
