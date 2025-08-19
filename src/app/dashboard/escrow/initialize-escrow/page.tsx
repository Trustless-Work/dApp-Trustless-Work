"use client";

import { EscrowSteps } from "@/modules/escrow/ui/utils/EscrowStepper";
import { ChooseEscrowType } from "@/modules/escrow/ui/views/ChooseEscrowType";
import { InitializeEscrow } from "@/modules/escrow/ui/views/InitEscrow";

const InitializeEscrowPage: React.FC = () => {
  const steps = [
    {
      title: "Choose Escrow Type",
      description: "Select the type of escrow that best suits your needs.",
      component: <ChooseEscrowType />,
    },
    {
      title: "Initialize Escrow",
      description: "Set up your escrow details",
      component: <InitializeEscrow />,
    },
  ];
  return <EscrowSteps items={steps} />;
};

export default InitializeEscrowPage;
