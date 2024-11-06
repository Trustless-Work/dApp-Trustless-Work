import { usePathname } from "next/navigation"; // Importar usePathname
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

type ItemsHeaderProps = {
  isEnabled: string;
};

const ItemsHeader = ({ isEnabled }: ItemsHeaderProps) => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    isEnabled && (
      <NavigationMenu className="mx-auto md:m-0">
        <NavigationMenuList className="flex gap-10">
          <NavigationMenuItem>
            <Link
              href="/escrow/initialize-escrow"
              className={
                isActive("/escrow/initialize-escrow")
                  ? "font-bold text-primary"
                  : ""
              }
              passHref
            >
              Create Escrow
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              href="/escrow/fund-escrow"
              className={
                isActive("/escrow/fund-escrow") ? "font-bold text-primary" : ""
              }
              passHref
            >
              Fund Escrow
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              href="/escrow/complete-escrow"
              className={
                isActive("/escrow/complete-escrow") ? "font-bold text-primary" : ""
              }
              passHref
            >
              Complete Escrow
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              href="/escrow/claim-escrow-earnings"
              className={
                isActive("/escrow/claim-escrow-earnings") ? "font-bold text-primary" : ""
              }
              passHref
            >
              Claim Escrow Earnings
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              href="/escrow/cancel-escrow"
              className={
                isActive("/escrow/cancel-escrow") ? "font-bold text-primary" : ""
              }
              passHref
            >
              Cancel Escrow
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              href="/escrow/refund-remaining-funds"
              className={
                isActive("/escrow/refund-remaining-funds") ? "font-bold text-primary" : ""
              }
              passHref
            >
              Refund remaining funds
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              href="/escrow/get-engagement"
              className={
                isActive("/escrow/get-engagement")
                  ? "font-bold text-primary"
                  : ""
              }
              passHref
            >
              Get Engagement
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    )
  );
};

export default ItemsHeader;
