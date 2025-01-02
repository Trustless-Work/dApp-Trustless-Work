"use client";

import WithAuthProtect from "@/helpers/WithAuth";
import MyEscrowsTable from "@/components/modules/escrow/MyEscrows";
import { useLoaderStore } from "@/store/utilsStore/store";
import { Bounded } from "@/components/layout/Bounded";
import Loader from "@/components/utils/Loader";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const EscrowsPage = () => {
  const isLoading = useLoaderStore((state) => state.isLoading);

  return (
    <>
      {isLoading ? (
        <Loader isLoading={isLoading} />
      ) : (
        <div className="flex flex-col gap-3 w-full h-full">
          <Card className={cn("overflow-hidden")}>
            <CardContent className="p-6">
              <MyEscrowsTable />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default WithAuthProtect(EscrowsPage);
