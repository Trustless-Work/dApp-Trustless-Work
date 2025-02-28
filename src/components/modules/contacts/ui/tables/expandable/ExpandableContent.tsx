import { Contact } from "@/@types/contact.entity";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Divider from "@/components/utils/ui/Divider";

interface ExpandableContentProps {
  contact: Contact;
}

const ExpandableContent = ({ contact }: ExpandableContentProps) => {
  return (
    <TableRow>
      <TableCell colSpan={4} className="p-4">
        <h3 className="mb-1 font-bold text-xs">Contact Details</h3>
        <Divider type="horizontal" />
        <div className="flex flex-col">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{contact.name}</TableCell>
                <TableCell>{contact.lastName}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.address}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ExpandableContent;
