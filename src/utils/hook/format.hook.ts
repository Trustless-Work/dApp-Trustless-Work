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

  const formatDateFromFirebase = (
    seconds: number,
    nanoseconds: number,
  ): string => {
    const milliseconds = seconds * 1000 + nanoseconds / 1000000;
    const date = new Date(milliseconds);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    // DD/MM/YYYY
    return `${day}/${month}/${year}`;
  };

  return { formatAddress, formatDate, formatDateFromFirebase };
};
