import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb } from "./Breadcrumb";
import { NetworkToggle } from "./NetworkToggle";
import { ToggleTheme } from "./ToggleTheme";
import { WalletButton } from "../tw-blocks/wallet-kit/WalletButtons";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-10 shrink-0 border-b bg-background/60 backdrop-blur-md">
      <div className="flex h-14 items-center gap-2 px-3 md:h-16 md:gap-2 md:px-8">
        <SidebarTrigger className="-ml-1 size-9 shrink-0 md:hidden" />
        <Separator
          orientation="vertical"
          className="mr-1 shrink-0 data-vertical:h-4 data-vertical:self-auto md:hidden"
        />

        <div className="min-w-0 flex-1 overflow-hidden">
          <Breadcrumb />
        </div>

        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <NetworkToggle />
          <WalletButton />
          <ToggleTheme />
        </div>

        <div className="flex shrink-0 items-center md:hidden">
          <ToggleTheme />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-border/60 px-3 py-2 md:hidden">
        <NetworkToggle className="w-full justify-center px-2" />
        <WalletButton className="w-full" mobileBar />
      </div>
    </header>
  );
};
