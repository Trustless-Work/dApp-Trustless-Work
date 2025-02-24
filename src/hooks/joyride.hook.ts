import { steps } from "@/constants/steps/steps";
import { useGlobalUIBoundedStore } from "@/core/store/ui";
import { useState } from "react";
import { CallBackProps, STATUS } from "react-joyride";

export const useJoyride = () => {
  const run = useGlobalUIBoundedStore((state) => state.run);
  const setRun = useGlobalUIBoundedStore((state) => state.setRun);
  const [stepIndex, setStepIndex] = useState(0);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, index, status, type } = data;

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);
      setStepIndex(0);
    } else if (action === "next" && index < steps.length - 1) {
      setStepIndex(index + 1);
    } else if (action === "prev" && index > 0) {
      setStepIndex(index - 1);
    } else if (type === "tour:end") {
      setRun(false);
      setStepIndex(0);
    }
  };

  return {
    handleJoyrideCallback,
    run,
    setRun,
    stepIndex,
    setStepIndex,
  };
};
