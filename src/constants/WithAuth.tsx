"use client";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useWalletStore } from "@/store/walletStore";

export default function WithAuthProtect(Component: any) {
  return function WithAuthProtect(props: any) {
    const { address } = useWalletStore();

    useEffect(() => {
      if (!address) {
        redirect("/");
      }
    }, []);

    if (!address) {
      return null;
    }

    return <Component {...props} />;
  };
}
