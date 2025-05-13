import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useContact } from "@/components/modules/contact/hooks/contact.hook";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import NoData from "@/components/utils/ui/NoData";
import SkeletonCards from "@/components/modules/escrow/ui/utils/SkeletonCards";
const MyContactsCards = () => {
  const { contacts, isLoading, handleDeleteContact } = useContact();

  if (isLoading) {
    return <SkeletonCards />;
  }

  if (!contacts.length) {
    return (
      <div className="h-[50vh] w-full flex items-center justify-center">
        <NoData />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {contacts.map((contact) => (
        <Card key={contact.id} className="overflow-hidden">
          <CardHeader>
            <CardTitle>{`${contact.firstName} ${contact.lastName}`}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Email: {contact.email}</p>
            <p>Address: {contact.address}</p>
            <p>Role: {contact.role}</p>
          </CardContent>
          <CardFooter className="flex justify-end">
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
                  onClick={() => handleDeleteContact(contact.id)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default MyContactsCards;
