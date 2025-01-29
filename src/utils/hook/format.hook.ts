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
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    // DD/MM/YYYY HH:MM
    return `${day}/${month}/${year} | ${hours}:${minutes}`;
  };

  const formatDollar = (amount: string | undefined | number): string => {
    if (!amount) return "$0.00";

    const parsedAmount = parseFloat(amount.toString());
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

  const formatPercentage = (value: number): string => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}m`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
    return num.toString();
  };

  return {
    formatAddress,
    formatDate,
    formatDateFromFirebase,
    formatDollar,
    formatText,
    formatPercentage,
    formatNumber,
  };
};
