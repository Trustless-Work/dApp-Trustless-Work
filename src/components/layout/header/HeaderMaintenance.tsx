"use client";

import Image from "next/image";

const HeaderMaintenance = () => {
  return (
    <div className="flex w-full justify-between items-center gap-2 px-4">
      <Image src="/logo.png" alt="Trustless Work" width={80} height={80} />
    </div>
  );
};

export default HeaderMaintenance;
