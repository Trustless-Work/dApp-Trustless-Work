import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const WalletsListSkeleton = () => (
  <>
    <div className="flex flex-col gap-3 md:hidden">
      {Array.from({ length: 2 }).map((_, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="size-4 rounded-full" />
          </CardHeader>
          <CardContent className="flex justify-end gap-1">
            <Skeleton className="size-8 rounded-md" />
            <Skeleton className="size-8 rounded-md" />
          </CardContent>
        </Card>
      ))}
    </div>
    <div className="hidden md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Wallet</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 2 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="size-4 rounded-full" />
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="ml-auto h-8 w-16" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </>
);

export { WalletsListSkeleton };

export const VerifiedWalletsSkeleton = () => (
  <Card className="w-full md:w-1/2">
    <CardHeader className="flex flex-row items-start justify-between gap-4">
      <div className="space-y-2">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-4 w-full max-w-sm" />
      </div>
      <Skeleton className="h-8 w-28" />
    </CardHeader>
    <CardContent>
      <WalletsListSkeleton />
    </CardContent>
  </Card>
);
