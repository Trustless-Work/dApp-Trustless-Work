import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const useEscrowFilter = () => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const pathname = usePathname();
  const router = useRouter();

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [amountRange, setAmountRange] = useState(
    searchParams.get("amount") || "",
  );

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const deleteParams = () => {
    params.delete("q");
    params.delete("status");
    params.delete("amount");
    router.replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      updateQuery("q", search);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const mapNameParams = (paramName: string) => {
    if (!paramName) return "No Filter";

    switch (paramName) {
      // Statuses
      case "all":
        return "No Filter";
      case "working":
        return "Working";
      case "pendingRelease":
        return "Pending Release";
      case "released":
        return "Released";
      case "resolved":
        return "Resolved";
      case "inDispute":
        return "In Dispute";

      // Amounts
      case "0-100":
        return "$0 - $100";
      case "100-500":
        return "$100 - $500";
      case "500-1000":
        return "$500 - $1000";
      case "1000+":
        return "Over $1000";
    }
  };

  return {
    search,
    router,
    status,
    amountRange,
    pathname,
    searchParams,
    setStatus,
    setSearch,
    setAmountRange,
    updateQuery,
    deleteParams,
    mapNameParams,
  };
};
