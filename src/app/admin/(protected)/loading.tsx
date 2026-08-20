import { Container } from "@/components/shared/Container";
import { Skeleton } from "@/components/ui/skeleton";

/** Mirrors the structure of `page.tsx` so nothing shifts once loaded. */
export default function AdminLoading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-5 w-72" />
      </div>

      <Container>
        <Skeleton className="h-5 w-full max-w-md" />
      </Container>
    </div>
  );
}
