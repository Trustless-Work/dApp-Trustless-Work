"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Contact } from "@/@types/contact.entity";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useContact } from "@/components/modules/contact/hooks/contact.hook";
import { useFormatUtils } from "@/utils/hook/format.hook";

interface MyContactsTableProps {
  contacts: Contact[];
}

const MyContactsTable = ({ contacts }: MyContactsTableProps) => {
  const { handleDeleteContact, isDeleting } = useContact();
  const { formatAddress } = useFormatUtils();

  return (
    <div className="rounded-md border">
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
              <TableCell>{formatAddress(contact.address)}</TableCell>
              <TableCell>{contact.walletType}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDeleteContact(contact.id)}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MyContactsTable;
