"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  BookOpenIcon,
  FlaskConicalIcon,
  GlobeIcon,
  Settings2Icon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "./button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

const SETTINGS_PATH = "/dashboard/settings";

const RESOURCE_BUTTON_CLASS = "rounded-md";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const RESOURCE_LINKS = [
  {
    title: "Documentation",
    href: "https://docs.trustlesswork.com",
    icon: BookOpenIcon,
  },
  {
    title: "Laboratory",
    href: "https://demo.trustlesswork.com",
    icon: FlaskConicalIcon,
  },
  {
    title: "Website",
    href: "https://trustlesswork.com",
    icon: GlobeIcon,
  },
] as const satisfies ReadonlyArray<{
  title: string;
  href: string;
  icon: LucideIcon;
}>;

type ResourceLink = (typeof RESOURCE_LINKS)[number];

const ResourceIconButton = ({ resource }: { resource: ResourceLink }) => {
  const Icon = resource.icon;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon-sm"
          className={RESOURCE_BUTTON_CLASS}
          asChild
        >
          <Link href={resource.href} target="_blank" rel="noopener noreferrer">
            <Icon />
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{resource.title}</p>
      </TooltipContent>
    </Tooltip>
  );
};

const ResourceLinks = () => {
  const { displayState, isMobile } = useSidebar();
  const isVisible = displayState === "expanded" || isMobile;

  return (
    <AnimatePresence initial={false}>
      {isVisible ? (
        <motion.div
          key="resources-expanded"
          className="relative h-8 w-full overflow-hidden px-2"
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: 1,
            height: "2rem",
            transition: { duration: 0.2, ease: EASE_OUT },
          }}
          exit={{
            opacity: 0,
            height: 0,
            transition: { duration: 0.16, ease: "easeIn" },
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center gap-1.5">
            {RESOURCE_LINKS.map((resource, index) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, scale: 0.82, x: -8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: 0,
                  transition: {
                    duration: 0.22,
                    delay: 0.08 + index * 0.055,
                    ease: EASE_OUT,
                  },
                }}
                exit={{
                  opacity: 0,
                  scale: 0.82,
                  x: -6,
                  transition: {
                    duration: 0.1,
                    delay: index * 0.025,
                    ease: "easeIn",
                  },
                }}
              >
                <ResourceIconButton resource={resource} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export const NavSettings = () => {
  const pathname = usePathname();
  const isActive = pathname.startsWith(SETTINGS_PATH);

  return (
    <SidebarMenu>
      <ResourceLinks />

      <SidebarMenuItem className="my-2">
        <SidebarMenuButton asChild isActive={isActive} tooltip="Settings">
          <Link href={SETTINGS_PATH}>
            <Settings2Icon />
            <span>Settings</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
