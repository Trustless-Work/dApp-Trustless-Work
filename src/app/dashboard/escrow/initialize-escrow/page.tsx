"use client";

import CreateEscrow from "@/components/modules/escrow/CreateEscrow";
import InitEscrow from "@/components/modules/escrow/InitEscrow";
import { EscrowSteps } from "@/components/modules/escrow/EscrowSteps/EscrowStepper";

const InitializeEscrowPage = () => {
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
