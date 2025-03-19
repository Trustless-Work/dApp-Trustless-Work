"use client";

import { CreateContactCard } from "@/components/modules/contacts/ui/cards/CreateContactCard";
import CreateContact from "@/components/modules/contacts/ui/pages/CreateContact";

const CreateContactPage: React.FC = () => {
  const steps = [
    {
      title: "Create Escrow",
      description: "See details",
      component: <CreateContact />,
    },
  ];
  return <CreateContactCard items={steps} />;
};

export default CreateContactPage;
