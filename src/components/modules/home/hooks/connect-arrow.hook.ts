"use client";

import { useScroll } from "framer-motion";
import { useEffect, useState } from "react";

export const useConnectArrow = () => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);

  // Control visibility based on scroll
  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      if (latest > 50 && visible) {
        setVisible(false);
      } else if (latest <= 50 && !visible) {
        setVisible(true);
      }
    });

    return () => unsubscribe();
  }, [scrollY, visible]);

  return { visible };
};
