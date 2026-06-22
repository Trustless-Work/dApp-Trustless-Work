import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/ui/breadcrumb";
import { useGlobalAuthenticationStore } from "@/store/data";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useDisplayNameByAddress } from "@/hooks/useDisplayNameByAddress";

const useHeader = () => {
  const { address } = useGlobalAuthenticationStore();
  const pathName = usePathname();
  const router = useRouter();

  const publicProfileWallet = useMemo(() => {
    const crumbs = pathName.split("/").filter(Boolean);
    const publicProfileIndex = crumbs.indexOf("public-profile");

    if (publicProfileIndex >= 0 && crumbs[publicProfileIndex + 1]) {
      return crumbs[publicProfileIndex + 1];
    }

    return null;
  }, [pathName]);

  const { displayName: publicProfileDisplayName } = useDisplayNameByAddress(
    publicProfileWallet,
    { fallback: "Unknown User" },
  );

  useEffect(() => {
    if (!address) {
      router.push("/");
    } else if (pathName === "/") {
      router.push("/dashboard");
    }
  }, [address, pathName, router]);

  const getBreadCrumbs = () => {
    const crumbs = pathName.split("/").filter(Boolean);

    return crumbs.map((crumb, index) => {
      const isEscrow = crumb.toLowerCase() === "escrow";
      const isPublicProfile = crumbs.includes("public-profile");
      const href = isEscrow ? "#" : "/" + crumbs.slice(0, index + 1).join("/");

      let label = crumb
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      if (isPublicProfile && index === crumbs.length - 1) {
        label = publicProfileDisplayName;
      }

      return (
        <BreadcrumbItem key={href}>
          {index === crumbs.length - 1 ? (
            <BreadcrumbPage>{label}</BreadcrumbPage>
          ) : (
            <>
              <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
              <BreadcrumbSeparator />
            </>
          )}
        </BreadcrumbItem>
      );
    });
  };

  return { getBreadCrumbs, pathName, address };
};

export default useHeader;
