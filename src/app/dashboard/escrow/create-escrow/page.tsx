"use client"

import CreateEscrow from '@/components/modules/escrow/CreateEscrow';
import { EscrowStepper } from '@/components/modules/escrow/EscrowStepper';
import InitEscrow from '@/components/modules/escrow/InitEscrow';
import WithAuthProtect from '@/helpers/WithAuth';
import React from 'react'

const CreateEscrowPage = () => {
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
    <EscrowStepper items={steps} />
  )
}

export default WithAuthProtect(CreateEscrowPage)