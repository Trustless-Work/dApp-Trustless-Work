"use client";

import { Bell, ChevronsUpDown, CreditCard } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useWalletStore } from "@/store/walletStore";
import { useFormatUtils } from "@/utils/hook/format.hook";
import { useCopyUtils } from "@/utils/hook/copy.hook";
import { FaRegCopy } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { useWalletUtils } from "@/utils/hook/wallet.hook";
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import Link from "next/link";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export const NavUser = () => {
  const { isMobile } = useSidebar();
  const { address, name } = useWalletStore();
  const { formatAddress } = useFormatUtils();
  const { copyText, copySuccess } = useCopyUtils();
  const { handleDisconnect } = useWalletUtils();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!address) {
      router.push("/");
    } else if (pathname === "/") {
      router.push("/dashboard");
    }
  }, [address, pathname, router]);

  const user = {
    name: "Chris Nager",
    adress: address,
    avatar: "https://avatars.githubusercontent.com/u/512548?s=60",
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.adress}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <div className="flex items-center">
                    <div className="flex flex-col items-center justify-center">
                      <p className="truncate text-xs">
                        {formatAddress(user.adress)}
                      </p>

                      <p className="text-xs text-green-700 h-2">
                        {copySuccess && "Address copied!"}
                      </p>
                    </div>
                    <button
                      onClick={() => copyText(user.adress)}
                      className="p-1.5 hover:bg-muted rounded-md transition-colors"
                      title="Copy address"
                    >
                      <FaRegCopy
                        className={cn(
                          "h-4 w-4",
                          copySuccess
                            ? "text-green-700"
                            : "text-muted-foreground",
                        )}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <CreditCard />
                Wallet - {name}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href="/profile">
                <DropdownMenuItem>
                  <FaRegUser />
                  Account
                </DropdownMenuItem>
              </Link>

              <Link href="/settings">
                <DropdownMenuItem>
                  <Bell />
                  Settings
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <button className="w-full" onClick={handleDisconnect}>
              <DropdownMenuItem>
                <IoSettingsOutline />
                Disconnect
              </DropdownMenuItem>
            </button>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
