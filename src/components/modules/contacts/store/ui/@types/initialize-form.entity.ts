import { Contact } from "@/@types/contact.entity";

export type ContactFormData = Pick<
  Contact,
  "name" | "lastName" | "email" | "address"
>;

export interface InitializeFormContactStore {
  name: string;
  lastName: string;
  email: string;
  address: string;
  formData: ContactFormData;
  setFormData: (data: Partial<ContactFormData | null>) => void;
  resetForm: () => void;
}
