import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useIsMobile } from "@/hooks/use-mobile";
import { useWalletStore } from "@/store/walletStore";
import { useWalletUtils } from "@/utils/hook/wallet.hook";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect } from "react";

const useHeader = () => {
  const { address } = useWalletStore();
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
      const href = "/" + crumbs.slice(0, index + 1).join("/");
      const label = crumb
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

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
