import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import {
  SiDiscord,
  SiGithub,
  SiInstagram,
  SiTelegram,
  SiX,
} from "@icons-pack/react-simple-icons";
import { FullWidthDivider } from "./FullWidthDivider";

type SocialLink = {
  label: string;
  href: string;
  icon: ReactNode;
};

type FooterProps = {
  containedDividers?: boolean;
};

export const Footer = ({ containedDividers = false }: FooterProps) => {
  return (
    <div className="relative w-full overflow-x-clip">
      <FullWidthDivider contained position="top" />

      <footer className="relative mx-auto w-full max-w-5xl lg:border-x px-20">
        <div className="grid max-w-5xl grid-cols-6 gap-6 p-4">
          <div className="col-span-6 flex flex-col gap-4 pt-5 md:col-span-4">
            <Link className="w-max" href="#">
              <Image
                src="/icon.png"
                alt="Trustless Work"
                width={50}
                height={50}
              />
            </Link>

            <p className="max-w-sm text-balance text-muted-foreground text-sm">
              Escrow infrastructure for stablecoin payments
            </p>

            <div className="flex gap-2">
              {socialLinks.map(({ href, icon, label }) => (
                <Button asChild key={label} size="icon" variant="outline">
                  <Link
                    aria-label={label}
                    href={href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {icon}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
          <div className="col-span-3 w-full md:col-span-1">
            <span className="text-muted-foreground text-xs">Resources</span>
            <div className="mt-2 flex flex-col gap-2">
              {resources.map(({ href, title }) => (
                <Link
                  className="w-max text-sm hover:underline"
                  href={href}
                  key={title}
                >
                  {title}
                </Link>
              ))}
            </div>
          </div>
          <div className="col-span-3 w-full md:col-span-1">
            <span className="text-muted-foreground text-xs">Company</span>
            <div className="mt-2 flex flex-col gap-2">
              {company.map(({ href, title }) => (
                <Link
                  className="w-max text-sm hover:underline"
                  href={href}
                  key={title}
                >
                  {title}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <FullWidthDivider contained={containedDividers} />

        <div className="flex items-center justify-center gap-2 py-4">
          <p className="text-center font-light text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()}, All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
};

const company = [
  {
    title: "Escrow Laboratory",
    href: "https://demo.trustlesswork.com",
  },
  {
    title: "Escrow Blocks",
    href: "https://blocks.trustlesswork.com",
  },
];

const resources = [
  {
    title: "Website",
    href: "https://trustless.work",
  },
  {
    title: "Documentation",
    href: "https://docs.trustless.work",
  },
];

const socialLinks: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/Trustless-Work",
    icon: <SiGithub className="text-foreground" size={18} />,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/trustlesswork/",
    icon: <SiInstagram className="text-foreground" size={18} />,
  },
  {
    label: "Telegram",
    href: "https://t.me/+kmr8tGegxLU0NTA5",
    icon: <SiTelegram className="text-foreground" size={18} />,
  },
  {
    label: "X",
    href: "https://x.com/TrustlessWork",
    icon: <SiX className="text-foreground" size={18} />,
  },
  {
    label: "Discord",
    href: "https://discord.gg/BAU5s2kVp2",
    icon: <SiDiscord className="text-foreground" size={18} />,
  },
];
