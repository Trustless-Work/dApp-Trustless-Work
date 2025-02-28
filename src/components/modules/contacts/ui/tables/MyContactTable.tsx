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
import { Contact } from "@/@types/contact.entity";
import NoData from "@/components/utils/ui/NoData";
import ExpandableContent from "./expandable/ExpandableContent";

interface MyContactsTableProps {
  contacts: Contact[];
}

const MyContactsTable = ({ contacts = [] }: MyContactsTableProps) => {
  return (
    <div className="container mx-auto py-3">
      {contacts.length === 0 ? (
        <NoData />
      ) : (
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
              {contacts.map((contact: Contact) => (
                <React.Fragment key={contact.id}>
                  <TableRow className="animate-fade-in">
                    <TableCell className="font-medium">
                      {contact.name}
                    </TableCell>
                    <TableCell>{contact.lastName}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.type}</TableCell>
                    <TableCell>{contact.address}</TableCell>
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
                            onClick={(e) => e.stopPropagation()}
                          >
                            More Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <ExpandableContent contact={contact} />
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default MyContactsTable;
