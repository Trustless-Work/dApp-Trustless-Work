import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Contact } from "@/@types/contact.entity";
import InitializeContactForm from "../forms/InitializeContactForm";
import { ContactFormData } from "../../schema/contact-schema";

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
