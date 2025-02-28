import { useFormatUtils } from "@/utils/hook/format.hook";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NoData from "@/components/utils/ui/NoData";
import SkeletonCards from "../utils/SkeletonCards";
import { Contact } from "@/@types/contact.entity";

interface MyContactsCardsProps {
  contacts: Contact[];
}

const MyContactsCards = ({ contacts }: MyContactsCardsProps) => {
  return (
    <>
      {contacts.length === 0 ? (
        <Card className={cn("overflow-hidden")}>
          <NoData isCard={true} />
        </Card>
      ) : (
        <div className="py-3">
          <div className="flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {contacts.map((contact, index) => (
                <Card
                  key={index}
                  className="overflow-hidden cursor-pointer hover:shadow-lg"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-muted-foreground truncate">
                        {contact.name} {contact.lastName}
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      <strong>Email:</strong> {contact.email}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      <strong>Address:</strong> {contact.address}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyContactsCards;
