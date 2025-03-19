import { Contact, ContactCategory } from "@/@types/contact.entity";

export type ContactFormData = Pick<
  Contact,
  "name" | "lastName" | "email" | "address" | "category"
>;

export interface InitializeFormContactStore {
  formData: ContactFormData;
  setFormData: (data: Partial<ContactFormData>) => void;
  resetForm: () => void;
}
