import React from "react";
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
import NoData from "@/components/utils/ui/NoData";
import { useContact } from "@/components/modules/contact/hooks/contact.hook";
import { Contact, RoleType } from "@/@types/contact.entity";
import SkeletonTable from "@/components/modules/escrow/ui/utils/SkeletonTable";

interface MyContactsTableProps {
  type: string;
}

const MyContactsTable = ({ type }: MyContactsTableProps) => {
  const { isLoading, handleDeleteContact } = useContact(type);
  // Mock Data for Testing Purposes
  const contacts: Contact[] = [
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      address: "123 Main St",
      role: RoleType.ISSUER,
      createdAt: {
        seconds: 1672531200,
        nanoseconds: 0,
      },
      updatedAt: {
        seconds: 1672531200,
        nanoseconds: 0,
      },
    },
    {
      id: "2",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      address: "456 Park Ave",
      role: RoleType.APPROVER,
      createdAt: {
        seconds: 1672531200,
        nanoseconds: 0,
      },
      updatedAt: {
        seconds: 1672531200,
        nanoseconds: 0,
      },
    },
    {
      id: "3",
      firstName: "Michael",
      lastName: "Johnson",
      email: "michael.johnson@example.com",
      address: "789 Broadway",
      role: RoleType.SERVICE_PROVIDER,
      createdAt: {
        seconds: 1672531200,
        nanoseconds: 0,
      },
      updatedAt: {
        seconds: 1672531200,
        nanoseconds: 0,
      },
    },
    {
      id: "4",
      firstName: "Emily",
      lastName: "Davis",
      email: "emily.davis@example.com",
      address: "321 Elm St",
      role: RoleType.DISPUTE_RESOLVER,
      createdAt: {
        seconds: 1672531200,
        nanoseconds: 0,
      },
      updatedAt: {
        seconds: 1672531200,
        nanoseconds: 0,
      },
    },
  ];

  if (isLoading) {
    return <SkeletonTable />;
  }

  if (!contacts.length) {
    return (
      <div className="h-[50vh] w-full flex items-center justify-center">
        <NoData />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact: Contact) => (
            <TableRow key={contact.id}>
              <TableCell>{contact.firstName}</TableCell>
              <TableCell>{contact.lastName}</TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell>{contact.address}</TableCell>
              <TableCell>{contact.role}</TableCell>
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
                      onClick={() => handleDeleteContact(contact.id)}
                    >
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
  );
};

export default MyContactsTable;
