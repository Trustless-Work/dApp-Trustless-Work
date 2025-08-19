import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Contact } from "@/types/contact.entity";
import { ContactFormData } from "../../schema/contact-schema";
import { InitializeContactForm } from "../InitializeContactForm";

interface EditContactDialogProps {
  contact: Contact;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ContactFormData) => Promise<void>;
}

export const EditContactDialog = ({
  contact,
  isOpen,
  onClose,
  onSubmit,
}: EditContactDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Contact</DialogTitle>
        </DialogHeader>
        <InitializeContactForm onSubmit={onSubmit} defaultValues={contact} />
      </DialogContent>
    </Dialog>
  );
};
