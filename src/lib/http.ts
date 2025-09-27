import axios from "axios";

const ENV =
  process.env.NEXT_PUBLIC_ENV === "PROD"
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_ENV === "DEV"
      ? process.env.NEXT_PUBLIC_API_URL_DEV
      : process.env.NEXT_PUBLIC_API_URL_LOCAL;

const isServer = typeof window === "undefined";

const http = axios.create({
  baseURL: isServer ? ENV : "/api/proxy",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default http;
