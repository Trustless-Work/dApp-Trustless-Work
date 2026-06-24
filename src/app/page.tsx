"use client";

import { ToggleTheme } from "@/components/shared/ToggleTheme";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Home() {
  return (
    <div className="relative flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <ToggleTheme />

      <Button
        onClick={() =>
          toast.success("Event has been created", {
            description: "Monday, January 3rd at 6:00pm",
          })
        }
      >
        Click me
      </Button>
    </div>
  );
}
