"use client";

import { useEffect, ComponentType, FC } from "react";
import { redirect } from "next/navigation";
import useLocalStorageUtils from "@/utils/hook/localStroage.hook";

export default function WithAuthProtect<T extends JSX.IntrinsicAttributes>(
  Component: ComponentType<T>,
): FC<T> {
  return function WithAuthProtectComponent(props: T) {
    const [name] = useLocalStorageUtils("address-wallet", "");

    useEffect(() => {
      if (!name || !name.state || !name.state.address) {
        redirect("/");
      }
    }, [name]);

    if (!name || !name.state || !name.state.address) {
      return null;
    }

    return <Component {...props} />;
  };
}
