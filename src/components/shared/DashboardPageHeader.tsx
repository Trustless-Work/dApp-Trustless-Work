"use client";

import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { getDashboardPage } from "@/constants/pages";

export const DashboardPageHeader = () => {
  const pathname = usePathname();
  const page = getDashboardPage(pathname);

  if (!page) {
    return null;
  }

  const Icon = page.icon;

  return (
    <header className="flex flex-col gap-4 pb-2">
      <div className="flex items-stretch gap-3 sm:gap-4">
        <div className="flex aspect-square shrink-0 items-center justify-center self-stretch rounded-lg border bg-muted/10 min-h-12 sm:min-h-14">
          <Icon className="size-5 text-foreground sm:size-6" aria-hidden />
        </div>

        <div className="min-w-0 space-y-1">
          <h1 className="text-pretty text-2xl font-semibold tracking-tight md:text-3xl">
            {page.title}
          </h1>
          <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
            {page.description}
          </p>
        </div>
      </div>

      <Separator />
    </header>
  );
};
