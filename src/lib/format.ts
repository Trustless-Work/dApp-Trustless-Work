interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

type FirestoreData = {
  [key: string]: FirestoreTimestamp | FirestoreData | FirestoreData[] | unknown;
};

export const convertFirestoreTimestamps = (
  data: FirestoreData | FirestoreData[] | unknown,
): FirestoreData | FirestoreData[] | unknown => {
  if (!data) return data;

  // If it's an array, map over each item
  if (Array.isArray(data)) {
    return data.map((item) => convertFirestoreTimestamps(item));
  }

  // If it's an object, process each property
  if (typeof data === "object" && data !== null) {
    const result: FirestoreData = {};
    for (const key in data) {
      const value = (data as FirestoreData)[key];
      if (value && typeof value === "object") {
        // Check if it's a Firestore timestamp
        if ("seconds" in value && "nanoseconds" in value) {
          result[key] = {
            seconds: (value as FirestoreTimestamp).seconds,
            nanoseconds: (value as FirestoreTimestamp).nanoseconds,
          } as FirestoreTimestamp;
        } else {
          result[key] = convertFirestoreTimestamps(value as FirestoreData);
        }
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  return data;
};

export const formatAddress = (address: string | undefined): string => {
  if (!address) return "";
  const start = address.slice(0, 8);
  const end = address.slice(-8);
  return `${start}....${end}`;
};

export const formatDateFromFirebase = (
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

export const formatCurrency = (
  amount: string | undefined | number,
  currency: string = "undefined",
): string => {
  if (!amount) return `${currency} 0.00`;

  const parsedAmount = parseFloat(amount.toString());
  if (isNaN(parsedAmount)) return `${currency} 0.00`;

  // ! ALL THE DECIMALS
  // return `$${parsedAmount.toString().replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;

  // ! ONLY 2 DECIMALS
  return `${currency} ${parsedAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
};

export const formatText = (role: string | undefined = "") => {
  return role
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])/g, (match) => ` ${match}`)
    .trim();
};

export const formatPercentage = (value: number): string => {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}m`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
  return num.toString();
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
