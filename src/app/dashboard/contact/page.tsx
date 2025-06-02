"use client";

import { Bounded } from "@/components/layout/Bounded";
import MyContacts from "@/components/modules/contact/pages/MyContacts";

const ContactsPage: React.FC = () => {
  return (
    <Bounded center={true}>
      <MyContacts />
    </Bounded>
  );
};

export default ContactsPage;
