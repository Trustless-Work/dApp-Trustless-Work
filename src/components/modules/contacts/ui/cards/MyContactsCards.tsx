"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Contact, ContactCategory } from "@/@types/contact.entity";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin } from "lucide-react";
import ContactDetailDialog from "../dialogs/ContactDetailDialog";
import NoData from "@/components/utils/ui/NoData";
import SkeletonCards from "@/components/modules/escrow/ui/utils/SkeletonCards";

interface MyContactsCardsProps {
  contacts: Contact[];
  type: ContactCategory;
}

const MyContactsCards = ({ contacts, type }: MyContactsCardsProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const totalPages = Math.ceil(contacts.length / itemsPerPage);
  const paginatedContacts = contacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <>
      {false ? (
        <SkeletonCards />
      ) : contacts.length !== 0 ? (
        <div className="py-3">
          <div className="flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {paginatedContacts.map((contact, index) => (
                <Card
                  key={index}
                  className="overflow-hidden cursor-pointer hover:shadow-lg"
                  onClick={() => {
                    setSelectedContact(contact);
                    setIsDialogOpen(true);
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-muted-foreground truncate">
                        {type}
                      </p>

                      <div className="flex items-center gap-1 md:gap-3">
                        <Badge variant="outline" className="uppercase">
                          Active
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-2 flex items-baseline">
                      <h3 className="text-2xl font-semibold">
                        {contact.name} {contact.lastName}
                      </h3>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {contact.email}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground truncate">
                          {contact.address}
                        </p>
                      </div>
                    </div>

                    <p className="mt-5 text-xs text-muted-foreground text-end italic">
                      <strong>Created:</strong>{" "}
                      {new Date().toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
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
          </div>
        </div>
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
    </>
  );
};

export default MyContactsCards;
