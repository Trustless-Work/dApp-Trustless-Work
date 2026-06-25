"use client";

import Link from "next/link";
import { Fragment } from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb as BreadcrumbUI,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

type BreadcrumbItemData = {
  href: string;
  label: string;
};

function formatBreadcrumbLabel(segment: string): string {
  return decodeURIComponent(segment)
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getBreadcrumbItems(pathname: string): BreadcrumbItemData[] {
  if (pathname === "/") {
    return [{ href: "/", label: "Home" }];
  }

  const segments = pathname.split("/").filter(Boolean);

  return segments.map((segment, index) => ({
    href: `/${segments.slice(0, index + 1).join("/")}`,
    label: formatBreadcrumbLabel(segment),
  }));
}

export const Breadcrumb = () => {
  const pathname = usePathname();
  const items = getBreadcrumbItems(pathname);

  return (
    <BreadcrumbUI>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Fragment key={item.href}>
              {index > 0 && (
                <BreadcrumbSeparator className="hidden md:block" />
              )}
              <BreadcrumbItem className={cn(!isLast && "hidden md:block")}>
                {isLast ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </BreadcrumbUI>
  );
};
