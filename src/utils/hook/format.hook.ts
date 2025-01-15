export const useFormatUtils = () => {
  const formatAddress = (address: string | undefined): string => {
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

  const formatDollar = (amount: string): string => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) return "$0.00";
    return `$${parsedAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
  };

  const formatText = (role: string | undefined = "") => {
    return role
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/([A-Z])/g, (match) => ` ${match}`)
      .trim()
      .toUpperCase();
  };

  return {
    formatAddress,
    formatDate,
    formatDateFromFirebase,
    formatDollar,
    formatText,
  };
};
