"use client";

import CreateEscrow from "@/components/modules/escrow/CreateEscrow";
import { EscrowSteps } from "@/components/modules/escrow/ui/steps/EscrowStepper";
import InitEscrow from "@/components/modules/escrow/InitEscrow";

const InitializeEscrowPage: React.FC = () => {
  const steps = [
    {
      title: "Create Escrow",
      description: "See details",
      component: <CreateEscrow />,
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
