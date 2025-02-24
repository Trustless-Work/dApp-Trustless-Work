import Joyride from "react-joyride";
import { steps } from "@/constants/steps/steps";
import { useGlobalUIBoundedStore } from "@/core/store/ui";
import { useJoyride } from "@/hooks/joyride.hook";

const JoyrideTutorial = () => {
  const theme = useGlobalUIBoundedStore((state) => state.theme);

  const { run, stepIndex, handleJoyrideCallback } = useJoyride();
  console.log(stepIndex);
  return (
    <Joyride
      run={run}
      steps={steps}
      stepIndex={stepIndex}
      continuous
      showSkipButton
      hideCloseButton={true}
      callback={handleJoyrideCallback}
      disableOverlayClose={true}
      styles={{
        options:
          theme === "dark"
            ? {
                backgroundColor: "#19191B",
                overlayColor: "rgba(0, 0, 0, 0.80)",
                primaryColor: "#006BE4",
                textColor: "#FFF",
                width: 500,
                zIndex: 1000,
              }
            : {
                backgroundColor: "#FFFFFF",
                overlayColor: "rgba(0, 0, 0, 0.60)",
                primaryColor: "#006BE4",
                textColor: "#000",
                width: 500,
                zIndex: 1000,
              },
      }}
    />
  );
};

export default JoyrideTutorial;
