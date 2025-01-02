"use client";

import WithAuthProtect from "@/helpers/WithAuth";
import MyEscrowsTable from "@/components/modules/escrow/MyEscrows";

const EscrowsPage = () => {
  return (
    <>
      <MyEscrowsTable />
    </>
  );
};

export default WithAuthProtect(EscrowsPage);
