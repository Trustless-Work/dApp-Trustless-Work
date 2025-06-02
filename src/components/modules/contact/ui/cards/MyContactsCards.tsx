"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Contact } from "@/@types/contact.entity";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useContact } from "@/components/modules/contact/hooks/contact.hook";
import { useFormatUtils } from "@/utils/hook/format.hook";
import { EditContactDialog } from "../dialogs/EditContactDialog";
import { useState } from "react";

interface MyContactsCardsProps {
  contacts: Contact[];
}

const MyContactsCards = ({ contacts }: MyContactsCardsProps) => {
  const { handleDeleteContact, handleUpdateContact, isDeleting, isUpdating } =
    useContact();
  const { formatAddress } = useFormatUtils();
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {contacts.map((contact) => (
        <Card key={contact.id} className="min-w-[280px]">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <CardTitle className="text-base font-medium truncate max-w-[180px]">
                {contact.name}
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingContact(contact)}
                  disabled={isUpdating}
                  className="h-8 w-8"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteContact(contact.id)}
                  disabled={isDeleting}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground truncate">
                <span className="font-medium">Email:</span> {contact.email}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                <span className="font-medium">Wallet:</span>{" "}
                {formatAddress(contact.address)}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                <span className="font-medium">Type:</span> {contact.walletType}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}

      {editingContact && (
        <EditContactDialog
          contact={editingContact}
          isOpen={!!editingContact}
          onClose={() => setEditingContact(null)}
          onSubmit={async (data) => {
            const success = await handleUpdateContact(editingContact.id, data);
            if (success) setEditingContact(null);
          }}
        />
      )}
    </div>
  );
};

export default MyContactsCards;
