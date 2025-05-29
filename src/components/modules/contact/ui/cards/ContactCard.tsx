import { Contact } from "@/@types/contact.entity";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditContactDialog } from "../dialogs/EditContactDialog";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { ContactFormData } from "../../schema/contact-schema";

interface ContactCardProps {
  contact: Contact;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: ContactFormData) => Promise<void>;
}

export const ContactCard = ({
  contact,
  onDelete,
  onUpdate,
}: ContactCardProps) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{contact.name}</span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(contact.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Email:</span> {contact.email}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Wallet:</span> {contact.address}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Type:</span> {contact.walletType}
            </p>
          </div>
        </CardContent>
      </Card>

      <EditContactDialog
        contact={contact}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSubmit={(data) => onUpdate(contact.id, data)}
      />
    </>
  );
};
