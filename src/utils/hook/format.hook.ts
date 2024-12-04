export const useFormatUtils = () => {
  const formatAddress = (address: string): string => {
    if (!address) return "";
    const start = address.slice(0, 8);
    const end = address.slice(-8);
    return `${start}....${end}`;
  };

  const formatDate = () => {
    return new Date().toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return { formatAddress, formatDate };
};
