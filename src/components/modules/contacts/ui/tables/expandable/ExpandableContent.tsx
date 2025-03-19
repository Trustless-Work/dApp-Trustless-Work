import { TableCell } from "@/components/ui/table";
import type { Contact } from "@/@types/contact.entity";

interface ExpandableContentProps {
  contact: Contact;
}

const ExpandableContent = ({ contact }: ExpandableContentProps) => {
  return (
    <TableCell colSpan={9} className="bg-muted/30">
      <div className="p-4">
        <h3 className="text-sm font-semibold mb-4">Contact Details</h3>
        <div className="border rounded border-primary p-6">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-sm font-semibold mb-4">
                Personal Information
              </h4>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-sm text-muted-foreground">
                    Full Name:
                  </span>
                  <span className="text-sm col-span-2">{`${contact.name} ${contact.lastName}`}</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <span className="text-sm col-span-2">{contact.email}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-4">Additional Details</h4>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-sm text-muted-foreground">
                    Address:
                  </span>
                  <span className="text-sm col-span-2 truncate">
                    {contact.address}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-sm text-muted-foreground">
                    Created:
                  </span>
                  <span className="text-sm col-span-2">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TableCell>
  );
};

export default ExpandableContent;
