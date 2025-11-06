"use client";

import { Card, CardContent } from "@/ui/card";
import type { Contact } from "@/types/contact.entity";
import { Button } from "@/ui/button";
import { Pencil, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { EditContactDialog } from "./dialogs/EditContactDialog";
import { useState } from "react";
import Link from "next/link";
import NoData from "@/shared/utils/NoData";
import { DeleteContactDialog } from "./dialogs/DeleteContactDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Input } from "@/ui/input";
import { useContact } from "../hooks/useContact";
import { formatAddress } from "@/lib/format";
import { User } from "@/types/user.entity";

interface MyContactsCardsProps {
  contacts: Contact[];
}

export const MyContactsCards = ({ contacts }: MyContactsCardsProps) => {
  const {
    handleDeleteContact,
    handleUpdateContact,
    isDeleting,
    isUpdating,
    isLoading,
    users,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
  } = useContact();
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null);

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
  };

  const handleDelete = (contact: Contact) => {
    setDeletingContact(contact);
  };

  const getUserFromStore = (address: string) => {
    return users.find((user: User) => user.address === address);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <>
      {isLoading ? (
        <div>
          <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center">
            <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-primary mb-3" />
            <p className="text-sm text-muted-foreground">Loading contacts…</p>
          </div>
        </div>
      ) : contacts.length !== 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {contacts.map((contact) => {
              const user = getUserFromStore(contact.address);
              return (
                <Card
                  key={contact.id}
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-all border border-border/40 flex flex-col justify-between"
                >
                  <CardContent className="p-6">
                    {/* Header with Avatar and Actions */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Avatar className="h-12 w-12 ring-2 ring-background shadow-sm">
                          <AvatarImage
                            src={user?.profileImage || "/placeholder.svg"}
                          />
                          <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                            {getInitials(contact.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-foreground truncate text-lg">
                            {contact.name}
                          </h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {contact.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-1 mx-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(contact)}
                          disabled={isUpdating}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(contact)}
                          disabled={isDeleting}
                          className="h-8 w-8 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Wallet
                        </span>
                        <span className="text-sm font-mono text-foreground">
                          {formatAddress(contact.address)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Type
                        </span>
                        <span className="text-sm text-foreground capitalize">
                          {contact.walletType}
                        </span>
                      </div>
                    </div>

                    {/* View Profile Button */}
                    <Link
                      href={`${!user ? "#" : `/dashboard/public-profile/${contact.address}`}`}
                      target={!user ? "_self" : "_blank"}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full group/btn"
                        disabled={!user}
                      >
                        <span>View Profile</span>
                        <ExternalLink className="h-3 w-3 ml-2 group-hover/btn:translate-x-0.5 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mt-8 mb-3">
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
        <NoData isCard={true} />
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
    </>
  );
};
