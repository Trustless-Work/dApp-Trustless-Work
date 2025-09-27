import axios from "axios";

const ENV =
  process.env.NEXT_PUBLIC_ENV === "PROD"
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_ENV === "DEV"
      ? process.env.NEXT_PUBLIC_API_URL_DEV
      : process.env.NEXT_PUBLIC_API_URL_LOCAL;

const http = axios.create({
  baseURL: ENV,
  timeout: 60000, // 1 minute
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.API_KEY,
  },
});

export default http;
