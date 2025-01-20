import { useState } from "react";

export const useCopyUtils = () => {
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  const copyText = async (id: string | undefined, text: string | undefined) => {
    try {
      if (!text) throw new Error("Text is undefined");
      await navigator.clipboard.writeText(text);

      if (!id) throw new Error("Id is undefined");

      setCopiedKeyId(id);
      setTimeout(() => setCopiedKeyId(null), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  return { copyText, copiedKeyId };
};
