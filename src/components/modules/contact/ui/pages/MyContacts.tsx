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
import Loader from "@/components/utils/ui/Loader";

const MyContacts = () => {
  const { filteredContacts, isLoading, activeMode, setActiveMode } =
    useContact();

  return (
    <>
      <div className="flex gap-3 w-full h-full justify-between">
        <div className="w-full">
          <div className="flex w-full justify-end items-center gap-2 mb-4">
            <div className="flex items-center gap-2">
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

          <div className="flex flex-col gap-3">
            <Card className={cn("overflow-hidden")}>
              <CardContent className="p-6">
                <MyContactsFilter />
              </CardContent>
            </Card>
            {activeMode === "table" ? (
              <Card className={cn("overflow-hidden")}>
                <CardContent>
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
  );
};

export default MyContacts;
