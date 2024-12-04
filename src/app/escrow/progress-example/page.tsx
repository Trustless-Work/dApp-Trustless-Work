"use client";

import { Bounded } from "@/components/Bounded";
import { Steps } from "@/components/ui/steps";

const ProgressExample = () => {
  const steps = [
    {
      title: "Initialize Escrow",
      description: "Set up your escrow details",
      component: <div>Initialize Escrow Form</div>,
    },
    {
      title: "Fund Escrow",
      description: "Add funds to the escrow",
      component: <div>Fund Escrow Form</div>,
    },
    {
      title: "Complete Escrow",
      description: "Mark the escrow as complete",
      component: <div>Complete Escrow Form</div>,
    },
    {
      title: "Claim Escrow Earnings",
      description: "Claim your earnings from the escrow",
      component: <div>Claim Escrow Earnings Form</div>,
    },
    {
      title: "Get Engagement",
      description: "View final engagement details",
      component: <div>Get Engagement Form</div>,
    },
  ];
  return (
    <Bounded center={true}>
      <div>
        <Steps items={steps} />
      </div>
    </Bounded>
  );
};

export default ProgressExample;
