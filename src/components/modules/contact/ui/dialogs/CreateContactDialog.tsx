import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InitializeContactForm from "../forms/InitializeContactForm";
import { ContactFormData } from "../../schema/contact-schema";

interface CreateContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ContactFormData) => Promise<void>;
}

export const CreateContactDialog = ({
  isOpen,
  onClose,
  onSubmit,
}: CreateContactDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Contact</DialogTitle>
        </DialogHeader>
        <InitializeContactForm onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
};
