"use client";

import WithAuthProtect from "@/helpers/WithAuth";
import MyEscrowsTable from "@/components/modules/escrow/MyEscrows";

const MyEscrowsPage = () => {
  return <MyEscrowsTable />;
};

export default WithAuthProtect(MyEscrowsPage);
