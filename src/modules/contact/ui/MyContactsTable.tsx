"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { Contact } from "@/types/contact.entity";
import { Button } from "@/ui/button";
import { Loader2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { EditContactDialog } from "./dialogs/EditContactDialog";
import { DeleteContactDialog } from "./dialogs/DeleteContactDialog";
import { useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import NoData from "@/shared/utils/NoData";
import { Input } from "@/ui/input";
import { useContact } from "../hooks/useContact";
import { formatAddress } from "@/lib/format";

interface MyContactsTableProps {
  contacts: Contact[];
}

export const MyContactsTable = ({ contacts }: MyContactsTableProps) => {
  const {
    handleDeleteContact,
    handleUpdateContact,
    isLoading,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
  } = useContact();
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const handleEdit = (contact: Contact) => {
    setOpenDropdownId(null);
    setEditingContact(contact);
  };

  const handleDelete = (contact: Contact) => {
    setOpenDropdownId(null);
    setDeletingContact(contact);
  };

  return (
    <div className="container mx-auto py-3">
      {isLoading ? (
        <div>
          <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center">
            <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-primary mb-3" />
            <p className="text-sm text-muted-foreground">Loading contacts…</p>
          </div>
        </div>
      ) : contacts.length !== 0 ? (
        <>
          <div className="rounded-lg p-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Wallet Address</TableHead>
                  <TableHead>Wallet Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <Link
                        href={`/dashboard/public-profile/${contact.address}`}
                        target="_blank"
                        className="hover:underline"
                      >
                        {contact.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/dashboard/public-profile/${contact.address}`}
                        target="_blank"
                        className="hover:underline"
                      >
                        {contact.email}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/dashboard/public-profile/${contact.address}`}
                        target="_blank"
                        className="hover:underline"
                      >
                        {formatAddress(contact.address)}
                      </Link>
                    </TableCell>
                    <TableCell>{contact.walletType}</TableCell>
                    <TableCell>
                      <DropdownMenu
                        open={openDropdownId === contact.id}
                        onOpenChange={(open) =>
                          setOpenDropdownId(open ? contact.id : null)
                        }
                      >
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEdit(contact)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(contact)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mt-8 mb-3 px-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                Items per page:
              </span>
              <Input
                type="number"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="w-20 h-8 text-sm"
              />
            </div>
            <div className="flex items-center gap-2 justify-between sm:justify-end">
              <Button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
              >
                Next
              </Button>
            </div>
          </div>
        </>
      ) : (
        <NoData />
      )}

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

      {deletingContact && (
        <DeleteContactDialog
          isOpen={!!deletingContact}
          onClose={() => setDeletingContact(null)}
          onConfirm={async () => {
            await handleDeleteContact(deletingContact.id);
            setDeletingContact(null);
          }}
          contactName={deletingContact.name}
        />
      )}
    </div>
  );
};
