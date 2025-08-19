import { useGlobalUIBoundedStore } from "@/store/ui";

export const copyToClipboard = async (
  id: string | undefined,
  text: string | undefined,
) => {
  try {
    if (!text) throw new Error("Text is undefined");
    await navigator.clipboard.writeText(text);

    if (!id) throw new Error("Id is undefined");

    useGlobalUIBoundedStore.getState().setCopiedKeyId(id);
    setTimeout(
      () => useGlobalUIBoundedStore.getState().setCopiedKeyId(null),
      2000,
    );
  } catch (error) {
    console.error("Failed to copy text:", error);
  }
};

export const getCopiedKeyId = () =>
  useGlobalUIBoundedStore.getState().copiedKeyId;
