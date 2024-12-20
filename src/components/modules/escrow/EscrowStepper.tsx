import React, { useState } from 'react';
import CreateEscrow from './CreateEscrow';
import InitEscrow from './InitEscrow';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const EscrowStepper = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [escrowData, setEscrowData] = useState({});

  const handleNext = (data: {}) => {
    setEscrowData((prevData) => ({ ...prevData, ...data }));
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between w-full mb-4">
        <button onClick={handleBack} disabled={currentStep === 0} >
          <ArrowLeft  className='hover:scale-150 transition-transform cursor-pointer' />
        </button>
        <h2 className="text-xl font-semibold">
          {currentStep === 0 ? 'Create an Escrow' : 'Fill in the details of the Escrow'}
        </h2>
        <button onClick={() => handleNext(escrowData)} disabled={currentStep === 1}>
         <ArrowRight className='hover:scale-150 transition-transform cursor-pointer' />
        </button>
      </div>
      {currentStep === 0 && <CreateEscrow onNext={handleNext} />}
      {currentStep === 1 && <InitEscrow serviceDetails={escrowData} />}
    </div>
  );
};

export default EscrowStepper;
