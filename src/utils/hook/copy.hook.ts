import { useState } from "react";

export const useCopyUtils = () => {
  const [copySuccess, setCopySuccess] = useState(false);

  const copyText = async (text: string | undefined) => {
    try {
      await navigator.clipboard.writeText(text!);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("Failed to copy address:", error);
    }
  };

  return { copyText, setCopySuccess, copySuccess };
};
