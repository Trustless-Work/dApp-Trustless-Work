import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export const useContactFilter = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [walletType, setWalletType] = useState(
    searchParams.get("walletType") || "",
  );
  const [createdAt, setCreatedAt] = useState(
    searchParams.get("createdAt") || "",
  );

  const updateQuery = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );

  const deleteParams = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    ["q", "email", "walletType", "createdAt"].forEach((key) =>
      params.delete(key),
    );
    router.replace(`${pathname}?${params.toString()}`);
    setSearch("");
    setEmail("");
    setWalletType("");
    setCreatedAt("");
  }, [searchParams, pathname, router]);

  useEffect(() => {
    const delay = setTimeout(() => {
      updateQuery("q", search);
    }, 500);
    return () => clearTimeout(delay);
  }, [search, updateQuery]);

  useEffect(() => {
    const delay = setTimeout(() => {
      updateQuery("email", email);
    }, 500);
    return () => clearTimeout(delay);
  }, [email, updateQuery]);

  return {
    search,
    email,
    walletType,
    createdAt,
    setSearch,
    setEmail,
    setWalletType,
    setCreatedAt,
    updateQuery,
    deleteParams,
    searchParams,
  };
};
