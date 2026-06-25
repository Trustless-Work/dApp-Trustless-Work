import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ToggleTheme } from "./ToggleTheme";
import { NetworkToggle } from "./NetworkToggle";
import { Breadcrumb } from "./Breadcrumb";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center border-b bg-background/60 backdrop-blur-md md:h-16">
      <div className="flex h-full w-full items-center gap-2 px-4 md:px-8">
        <SidebarTrigger className="-ml-1 size-10 md:hidden" />
        <Separator
          orientation="vertical"
          className="mr-2 data-vertical:h-4 data-vertical:self-auto md:hidden"
        />

        <Breadcrumb />

        <div className="ml-auto flex items-center gap-2">
          <NetworkToggle />
          <ToggleTheme />
        </div>
      </div>
    </header>
  );
};
