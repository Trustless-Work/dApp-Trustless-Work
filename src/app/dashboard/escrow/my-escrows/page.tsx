"use client";

import WithAuthProtect from "@/helpers/WithAuth";
import MyEscrowsTable from "@/components/modules/escrow/MyEscrows";
import CreateButton from "@/components/utils/Create";

const EscrowsPage = () => {
  return (
    <>
      <MyEscrowsTable />
    </>
  );
};

export default WithAuthProtect(EscrowsPage);
