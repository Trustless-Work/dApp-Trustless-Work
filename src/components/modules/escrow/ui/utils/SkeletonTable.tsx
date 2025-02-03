import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SkeletonTable = () => {
  return (
    <div className="rounded-lg p-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Skeleton className="h-6 w-24" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-6 w-32" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-6 w-20" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-6 w-24" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-6 w-28" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-6 w-28" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              {[...Array(6)].map((_, j) => (
                <TableCell key={j}>
                  <Skeleton className="h-6 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SkeletonTable;
