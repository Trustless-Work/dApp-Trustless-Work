"use client"
import CreateEscrow from '@/components/modules/escrow/CreateEscrow';
import InitEscrow from '@/components/modules/escrow/InitEscrow';
import { Steps } from '@/components/ui/steps'
import WithAuthProtect from '@/helpers/WithAuth';
import React from 'react'

const EscrowStepper = () => {
  const steps = [
    {
      title: "Create Escrow",
      description: "Create Escrow",
      component: <CreateEscrow />,
    },
    {
      title: "Initialize Escrow",
      description: "Set up your escrow details",
      component: <InitEscrow />,
    }
  ];
  return (
    <Steps items={steps} />
  )
}

export default WithAuthProtect(EscrowStepper)