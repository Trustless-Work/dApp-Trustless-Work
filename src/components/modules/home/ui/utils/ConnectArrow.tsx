"use client";

import { motion } from "framer-motion";
import { useConnectArrow } from "../../hooks/connect-arrow.hook";

export const ConnectArrow = () => {
  const { visible } = useConnectArrow();

  return (
    <motion.div
      className="fixed inset-0 z-40 pointer-events-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hand-drawn arrow */}
      <div className="absolute top-0 right-0 w-[250px] h-[200px]">
        {/* Text bubble */}
        <motion.div
          className="absolute bottom-14 left-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <div className="bg-black/80 text-blue-400 p-2 rounded-lg shadow-md border border-blue-900 max-w-[200px] text-sm font-medium">
            <p>Test the dApp by connecting your wallet!</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
