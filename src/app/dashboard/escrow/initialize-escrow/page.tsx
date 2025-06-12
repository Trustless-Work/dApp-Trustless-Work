"use client";

import CreateEscrow from "@/components/modules/escrow/ui/pages/CreateEscrow";
import { EscrowSteps } from "@/components/modules/escrow/ui/steps/EscrowStepper";
import InitEscrow from "@/components/modules/escrow/ui/pages/InitEscrow";
import { ChooseEscrowType } from "@/components/modules/escrow/ui/pages/ChooseEscrowType";

const InitializeEscrowPage: React.FC = () => {
  const steps = [
    {
      title: "Create Escrow",
      description: "See details",
      component: <CreateEscrow />,
    },
    {
      title: "Choose Escrow Type",
      description: "Select the type of escrow that best suits your needs.",
      component: <ChooseEscrowType />,
    },
    {
      title: "Initialize Escrow",
      description: "Set up your escrow details",
      component: <InitEscrow />,
    },
  ];
  return <EscrowSteps items={steps} />;
};

export default InitializeEscrowPage;
