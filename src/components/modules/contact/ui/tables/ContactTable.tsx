import { Contact } from "@/@types/contact.entity";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EditContactDialog } from "../dialogs/EditContactDialog";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { ContactFormData } from "../../schema/contact-schema";

interface ContactTableProps {
  contacts: Contact[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: ContactFormData) => Promise<void>;
}

export const ContactTable = ({
  contacts,
  onDelete,
  onUpdate,
}: ContactTableProps) => {
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Wallet Address</TableHead>
            <TableHead>Wallet Type</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell>{contact.name}</TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell>{contact.address}</TableCell>
              <TableCell>{contact.walletType}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingContact(contact)}
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingContact && (
        <EditContactDialog
          contact={editingContact}
          isOpen={!!editingContact}
          onClose={() => setEditingContact(null)}
          onSubmit={(data) => onUpdate(editingContact.id, data)}
        />
      )}
    </>
  );
};
