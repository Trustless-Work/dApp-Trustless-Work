export const useFormatUtils = () => {
  const formatAddress = (address: string | undefined): string => {
    if (!address) return "";
    const start = address.slice(0, 8);
    const end = address.slice(-8);
    return `${start}....${end}`;
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

    // ! ALL THE DECIMALS
    return `$${parsedAmount.toString().replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
    //return `$${parsedAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
  };

  const formatText = (role: string | undefined = "") => {
    return role
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/([A-Z])/g, (match) => ` ${match}`)
      .trim();
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
    formatDateFromFirebase,
    formatDollar,
    formatText,
    formatPercentage,
    formatNumber,
  };
};

interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

export const convertFirestoreTimestamps = (data: any): any => {
  if (!data) return data;

  // If it's an array, map over each item
  if (Array.isArray(data)) {
    return data.map((item) => convertFirestoreTimestamps(item));
  }

  // If it's an object, process each property
  if (typeof data === "object") {
    const result: Record<string, any> = {};
    for (const key in data) {
      if (data[key] && typeof data[key] === "object") {
        // Check if it's a Firestore timestamp
        if ("seconds" in data[key] && "nanoseconds" in data[key]) {
          result[key] = {
            seconds: data[key].seconds,
            nanoseconds: data[key].nanoseconds,
          } as FirestoreTimestamp;
        } else {
          result[key] = convertFirestoreTimestamps(data[key]);
        }
      } else {
        result[key] = data[key];
      }
    }
    return result;
  }

  return data;
};
