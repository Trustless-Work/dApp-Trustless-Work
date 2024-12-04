"use client";

import { useEffect, ComponentType, useState } from "react";
import { redirect } from "next/navigation";
import useLocalStorageUtils from "@/utils/hook/localStroage.hook";

export default function WithAuthProtect<T extends JSX.IntrinsicAttributes>(
  Component: ComponentType<T>,
) {
  return function WithAuthProtect(props: T) {
    const [name] = useLocalStorageUtils("address-wallet", "");
    useEffect(() => {
      console.log();
      if (!name.state.address) {
        redirect("/");
      }
    });

    if (!name.state.address) {
      return null;
    }

    return <Component {...props} />;
  };
}
