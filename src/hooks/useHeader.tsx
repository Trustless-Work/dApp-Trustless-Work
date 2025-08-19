import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/ui/breadcrumb";
import { useGlobalAuthenticationStore } from "@/store/data";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const useHeader = () => {
  const { address, loggedUser } = useGlobalAuthenticationStore();
  const pathName = usePathname();
  const router = useRouter();

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

      if (isPublicProfile && index === crumbs.length - 1 && loggedUser) {
        label =
          `${loggedUser.firstName || ""} ${loggedUser.lastName || ""}`.trim() ||
          "Unknown User";
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
