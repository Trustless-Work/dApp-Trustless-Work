"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import type { Contact, ContactCategory } from "@/@types/contact.entity";
import ExpandableContent from "./expandable/ExpandableContent";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import NoData from "@/components/utils/ui/NoData";
import { cn } from "@/lib/utils";
import SkeletonCards from "@/components/modules/escrow/ui/utils/SkeletonCards";
import ContactDetailDialog from "../dialogs/ContactDetailDialog";

interface MyContactsTableProps {
  contacts: Contact[];
  type: ContactCategory;
}

const MyContactsTable = ({ contacts = [], type }: MyContactsTableProps) => {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const totalPages = Math.ceil(contacts.length / itemsPerPage);
  const paginatedContacts = contacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const toggleRowExpansion = (contactId: string) => {
    setExpandedRows((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId],
    );
  };

  return (
    <div className="container mx-auto py-3">
      {false ? (
        <SkeletonCards />
      ) : contacts.length !== 0 ? (
        <>
          <div className="rounded-lg p-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedContacts.map((contact: Contact) => (
                  <React.Fragment key={contact.contactId}>
                    <TableRow
                      className="animate-fade-in"
                      onClick={() => toggleRowExpansion(contact.contactId)}
                    >
                      <TableCell className="font-medium">
                        {contact.name}
                      </TableCell>
                      <TableCell>{contact.lastName}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{type}</TableCell>
                      <TableCell className="truncate max-w-xs">
                        {contact.address}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedContact(contact);
                                setIsDialogOpen(true);
                              }}
                            >
                              More Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedContact(contact);
                                setIsDialogOpen(true);
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedContact(contact);
                                setIsDialogOpen(true);
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      <TableCell>
                        <p
                          className="w-5 h-5 cursor-pointer border border-gray-400 dark:border-gray-500 rounded-lg flex justify-center items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRowExpansion(contact.contactId);
                          }}
                        >
                          {expandedRows.includes(contact.contactId) ? "-" : "+"}
                        </p>
                      </TableCell>
                    </TableRow>
                    {expandedRows.includes(contact.contactId) && (
                      <ExpandableContent contact={contact} />
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end items-center gap-4 mt-10 mb-3 px-3">
            <div className="flex items-center gap-2">
              <span>Items per page:</span>
              <Input
                type="number"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="w-16"
              />
            </div>
            <Button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        <Card className={cn("overflow-hidden")}>
          <NoData isCard={true} />
        </Card>
      )}

      <ContactDetailDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        contact={selectedContact}
      />
    </div>
  );
};

export default MyContactsTable;
