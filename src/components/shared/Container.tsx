import { cn } from "@/lib/utils";

export const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-border bg-card p-6 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
};
