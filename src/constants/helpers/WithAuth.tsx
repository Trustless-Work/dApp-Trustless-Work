"use client";
import { useEffect, ComponentType } from "react";
import { redirect } from "next/navigation";
import { useWalletStore } from "@/store/walletStore";

// small change

export default function WithAuthProtect<T extends JSX.IntrinsicAttributes>(
  Component: ComponentType<T>,
) {
  return function WithAuthProtect(props: T) {
    const { address } = useWalletStore();

    useEffect(() => {
      if (!address) {
        redirect("/");
      }
    });

    if (!address) {
      return null;
    }

    return <Component {...props} />;
  };
}
