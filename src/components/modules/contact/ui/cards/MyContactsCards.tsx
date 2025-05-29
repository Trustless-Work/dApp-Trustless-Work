"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Contact } from "@/@types/contact.entity";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useContact } from "@/components/modules/contact/hooks/contact.hook";
import { useFormatUtils } from "@/utils/hook/format.hook";

interface MyContactsCardsProps {
  contacts: Contact[];
}

const MyContactsCards = ({ contacts }: MyContactsCardsProps) => {
  const { handleDeleteContact, isDeleting } = useContact();
  const { formatAddress } = useFormatUtils();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {contacts.map((contact) => (
        <Card key={contact.id}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{contact.name}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteContact(contact.id)}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Email:</span> {contact.email}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Wallet Address:</span>{" "}
                {formatAddress(contact.address)}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Wallet Type:</span>{" "}
                {contact.walletType}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MyContactsCards;
